'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { InterviewQuestion, QuestionResult } from '@/lib/interview/data'
import { TOTAL_QUESTIONS } from '@/lib/interview/data'

const S = '#7ab0cc'
const SB = 'rgba(122,176,204,0.22)'
const SBG = 'rgba(122,176,204,0.06)'

interface Props {
  question: InterviewQuestion
  questionIndex: number
  onComplete: (result: QuestionResult) => void
}

type Phase = 'opening' | 'active' | 'processing' | 'result'

export default function QuestionScene({ question, questionIndex, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('opening')
  const [timeLeft, setTimeLeft] = useState(question.timeSeconds)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [result, setResult] = useState<QuestionResult | null>(null)
  const [showPt, setShowPt] = useState(false)
  const [ptText, setPtText] = useState<string | null>(null)
  const [ptLoading, setPtLoading] = useState(false)
  const [wordTooltip, setWordTooltip] = useState<{ word: string; pt: string; hint: string; x: number; y: number } | null>(null)
  const [wordLoadingKey, setWordLoadingKey] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [ricksAudioPlaying, setRicksAudioPlaying] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const speechRef = useRef<any>(null)
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didStart = useRef(false)

  const stopAll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    try { speechRef.current?.stop() } catch {}
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }, [])

  // On mount: open camera + play Rick audio + start timer simultaneously
  useEffect(() => {
    if (didStart.current) return
    didStart.current = true

    let cancelled = false

    async function init() {
      // 1. Open camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.muted = true
          await videoRef.current.play().catch(() => {})
        }
        setCameraReady(true)

        // 2. Start recording immediately
        chunksRef.current = []
        const recorder = new MediaRecorder(stream)
        recorderRef.current = recorder
        recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
        recorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop())
          const blob = new Blob(chunksRef.current, { type: 'video/webm' })
          const url = URL.createObjectURL(blob)
          setVideoUrl(url)
          if (!cancelled) await transcribeAndEvaluate(blob, url)
        }
        recorder.start()
        setPhase('active')

        // 3. Start timer
        timerRef.current = setInterval(() => {
          setTimeLeft(t => {
            if (t <= 1) {
              clearInterval(timerRef.current!)
              if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
              try { speechRef.current?.stop() } catch {}
              setPhase('processing')
              return 0
            }
            return t - 1
          })
        }, 1000)

        // 4. Live transcript
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SR) {
          const recog = new SR()
          recog.continuous = true; recog.interimResults = true; recog.lang = 'en-US'
          recog.onresult = (e: any) => {
            const text = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join(' ')
            setLiveTranscript(text)
          }
          recog.onerror = () => {}
          recog.start()
          speechRef.current = recog
        }
      } catch {
        if (!cancelled) setPhase('active') // no camera, proceed anyway
      }

      // 5. Play Rick's question audio in background
      try {
        const res = await fetch('/api/shift/tts', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: question.question, speaker: 'rick' }),
        })
        if (res.ok) {
          const blob = await res.blob()
          if (!cancelled) {
            const audio = new Audio(URL.createObjectURL(blob))
            setRicksAudioPlaying(true)
            audio.onended = () => setRicksAudioPlaying(false)
            audio.play().catch(() => setRicksAudioPlaying(false))
          }
        }
      } catch {}
    }

    init()
    return () => {
      cancelled = true
      if (autoRef.current) clearTimeout(autoRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function transcribeAndEvaluate(blob: Blob, blobUrl: string) {
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'response.webm')
      const whisperRes = await fetch('/api/shift/whisper', { method: 'POST', body: formData })
      const { transcript } = await whisperRes.json()
      const finalTranscript = transcript || liveTranscript || ''
      if (finalTranscript) setLiveTranscript(finalTranscript)

      const evalRes = await fetch('/api/interview/evaluate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: finalTranscript, question: question.question, skipped: false }),
      })
      const evalData = await evalRes.json()

      const r: QuestionResult = {
        questionId: question.id, question: question.question,
        videoUrl: blobUrl, transcript: finalTranscript,
        timeUsed: question.timeSeconds - timeLeft,
        skipped: false, ...evalData,
      }
      setResult(r)
      setPhase('result')
      autoRef.current = setTimeout(() => onComplete(r), 4000)
    } catch {
      const r: QuestionResult = {
        questionId: question.id, question: question.question,
        videoUrl: blobUrl, transcript: liveTranscript || '',
        timeUsed: question.timeSeconds, skipped: false,
        score: 5, verdict: 'good', rickFeedback: '', betterAnswer: '',
      }
      setResult(r)
      setPhase('result')
      autoRef.current = setTimeout(() => onComplete(r), 2000)
    }
  }

  function handleSend() {
    stopAll()
    setPhase('processing')
  }

  async function togglePt() {
    setShowPt(v => !v)
    if (!ptText && !ptLoading) {
      setPtLoading(true)
      try {
        const res = await fetch('/api/shift/translate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: question.question, mode: 'sentence' }),
        })
        const data = await res.json()
        setPtText(data.pt ?? null)
      } catch { setPtText(null) }
      finally { setPtLoading(false) }
    }
  }

  async function handleWordTap(word: string, rect: DOMRect) {
    const clean = word.replace(/[^a-zA-Z''-]/g, '')
    if (!clean) return
    setWordLoadingKey(clean)
    setWordTooltip(null)
    try {
      const res = await fetch('/api/shift/translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, mode: 'word' }),
      })
      const data = await res.json()
      setWordTooltip({ word: clean, pt: data.pt ?? clean, hint: data.hint ?? '', x: rect.left + rect.width / 2, y: rect.top })
    } catch {
      setWordTooltip({ word: clean, pt: '—', hint: '', x: rect.left + rect.width / 2, y: rect.top })
    } finally { setWordLoadingKey(null) }
  }

  const timerColor = timeLeft > 60 ? S : timeLeft > 30 ? '#f59e0b' : '#f87171'
  const scoreColor = (s: number) => s >= 7 ? '#4ade80' : s >= 5 ? '#fbbf24' : '#f87171'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} onClick={() => setWordTooltip(null)}>

      {/* Word tooltip */}
      {wordTooltip && (
        <div onClick={e => e.stopPropagation()} style={{
          position: 'fixed', left: Math.min(wordTooltip.x - 80, window.innerWidth - 180),
          top: wordTooltip.y - 90, width: 160, background: 'rgba(6,9,14,0.97)',
          border: '1px solid ' + SB, borderRadius: 12, padding: '10px 12px',
          zIndex: 999, boxShadow: '0 4px 24px rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
        }}>
          <div style={{ fontSize: 11, color: '#6a8a9a', marginBottom: 3 }}>{wordTooltip.word}</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: S }}>{wordTooltip.pt}</div>
          {wordTooltip.hint && <div style={{ fontSize: 11, color: '#4a6a7a', lineHeight: 1.4, marginTop: 3 }}>{wordTooltip.hint}</div>}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '10px 16px', background: 'rgba(6,9,14,0.98)', borderBottom: '1px solid ' + SB, flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 10, color: S, fontWeight: 700, letterSpacing: 1 }}>Q {questionIndex + 1} / {TOTAL_QUESTIONS}</span>
          <div style={{ fontSize: 9, color: '#4a6a7a', letterSpacing: 1 }}>{question.blockLabel.toUpperCase()}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Timer */}
          {(phase === 'active') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.4)', border: `1px solid ${timerColor}40`, borderRadius: 20, padding: '3px 10px' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
          )}
          <button onClick={() => void togglePt()}
            style={{ background: showPt ? SBG : 'transparent', border: '1px solid ' + SB, borderRadius: 8, padding: '3px 8px', fontSize: 10, color: S, cursor: 'pointer', fontWeight: 700 }}>
            {ptLoading ? '…' : '🇧🇷 PT'}
          </button>
        </div>
      </div>

      {/* Camera view — always shown */}
      <div style={{ flex: 1, position: 'relative', background: '#02040a', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: cameraReady ? 'block' : 'none' }} />

        {/* No camera fallback */}
        {!cameraReady && phase !== 'result' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 32, height: 32, border: `2px solid ${S}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 12, color: '#4a6a7a' }}>Opening camera…</span>
          </div>
        )}

        {/* Processing overlay */}
        {phase === 'processing' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,6,10,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: `2px solid ${S}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 13, color: '#4a6a7a' }}>Analysing your response…</span>
          </div>
        )}

        {/* Result overlay */}
        {phase === 'result' && result && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,6,10,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 20 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor(result.score ?? 0) }}>{result.score ?? 0}/10</div>
            <div style={{ fontSize: 13, color: '#a8c8dc', textAlign: 'center', lineHeight: 1.6, maxWidth: 280 }}>{result.rickFeedback}</div>
            <div style={{ fontSize: 11, color: '#4a6a7a' }}>Next question in 4s…</div>
          </div>
        )}

        {/* REC badge */}
        {phase === 'active' && (
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.65)', borderRadius: 20, padding: '4px 10px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f87171', display: 'inline-block', animation: 'micPulse 0.8s ease-in-out infinite' }} />
            <span style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700 }}>REC</span>
          </div>
        )}

        {/* Rick audio playing indicator */}
        {ricksAudioPlaying && phase === 'active' && (
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.65)', borderRadius: 20, padding: '4px 10px' }}>
            <span style={{ fontSize: 10 }}>🎙</span>
            <span style={{ fontSize: 10, color: S, fontWeight: 600 }}>Rick</span>
          </div>
        )}
      </div>

      {/* Bottom panel — question text always visible */}
      <div style={{ background: 'rgba(6,9,14,0.98)', borderTop: '1px solid ' + SB, padding: '12px 16px', flexShrink: 0 }}>

        {/* Rick label + question */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/scenes/rick.jpeg" alt="Rick"
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 25%', flexShrink: 0, border: `1.5px solid ${S}` }}
            onError={e => { const el = e.currentTarget; el.style.display = 'none'; (el.nextSibling as HTMLElement).style.display = 'flex' }}
          />
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: SBG, display: 'none', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: S, flexShrink: 0 }}>R</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#c8dce8', lineHeight: 1.65 }}>
              {question.question.split(/(\s+)/).map((token, i) => {
                const isWord = /\S/.test(token)
                const clean = token.replace(/[^a-zA-Z''-]/g, '')
                return isWord ? (
                  <span key={i}
                    onClick={e => { e.stopPropagation(); handleWordTap(token, (e.target as HTMLElement).getBoundingClientRect()) }}
                    style={{ cursor: 'pointer', borderBottom: wordLoadingKey === clean ? `1px solid ${S}` : `1px dashed ${SB}`, paddingBottom: 1 }}
                  >{token}</span>
                ) : token
              })}
            </p>
            {showPt && (
              <p style={{ margin: '6px 0 0', fontSize: 11, color: '#4a6a7a', lineHeight: 1.5, borderTop: '1px solid ' + SB, paddingTop: 6 }}>
                {ptLoading ? 'Traduzindo…' : (ptText ?? '—')}
              </p>
            )}
          </div>
        </div>

        {/* Live transcript */}
        {phase === 'active' && liveTranscript && (
          <div style={{ background: SBG, border: '1px solid ' + SB, borderRadius: 8, padding: '7px 10px', marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#6a8a9a', fontStyle: 'italic', lineHeight: 1.5 }}>"{liveTranscript}"</p>
          </div>
        )}

        {/* Send button */}
        {phase === 'active' && (
          <button onClick={handleSend}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${S},#4a88a8)`, color: '#04060a', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>
            ✓ SEND ANSWER
          </button>
        )}

        {(phase === 'opening' || phase === 'processing') && <div style={{ height: 46 }} />}

        {phase === 'result' && (
          <button onClick={() => { if (autoRef.current) clearTimeout(autoRef.current); if (result) onComplete(result) }}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${S},#4a88a8)`, color: '#04060a', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>
            NEXT →
          </button>
        )}
      </div>
    </div>
  )
}
