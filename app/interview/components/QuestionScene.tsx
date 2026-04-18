'use client'

import { useEffect, useRef, useState } from 'react'
import type { InterviewQuestion, QuestionResult } from '@/lib/interview/data'
import { TOTAL_QUESTIONS } from '@/lib/interview/data'
import RickPhoto from '@/components/RickPhoto'

const S = '#7ab0cc'
const SB = 'rgba(122,176,204,0.22)'
const SBG = 'rgba(122,176,204,0.06)'

interface Props {
  question: InterviewQuestion
  questionIndex: number
  onComplete: (result: QuestionResult) => void
}

type Phase = 'loading-audio' | 'ready' | 'recording' | 'done'

export default function QuestionScene({ question, questionIndex, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('loading-audio')
  const [timeLeft, setTimeLeft] = useState(question.timeSeconds)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [cameraReady, setCameraReady] = useState(false)
  const [showPt, setShowPt] = useState(false)
  const [ptText, setPtText] = useState<string | null>(null)
  const [ptLoading, setPtLoading] = useState(false)
  const [wordTooltip, setWordTooltip] = useState<{ word: string; pt: string; hint: string; x: number; y: number } | null>(null)
  const [wordLoadingKey, setWordLoadingKey] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const speechRef = useRef<any>(null)
  const transcriptRef = useRef('')
  const timeLeftRef = useRef(question.timeSeconds)
  const didInit = useRef(false)
  const sentRef = useRef(false)

  // On mount: open camera + play Rick audio simultaneously
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    let cancelled = false

    async function init() {
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
      } catch {}

      // Play Rick audio in background (don't wait)
      fetch('/api/shift/tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: question.question, speaker: 'rick' }),
      }).then(res => res.ok ? res.blob() : null)
        .then(blob => { if (blob && !cancelled) new Audio(URL.createObjectURL(blob)).play().catch(() => {}) })
        .catch(() => {})

      if (!cancelled) setPhase('ready')
    }

    init()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startRecording() {
    if (!streamRef.current) return
    chunksRef.current = []
    const recorder = new MediaRecorder(streamRef.current)
    recorderRef.current = recorder

    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      onComplete({
        questionId: question.id,
        question: question.question,
        videoUrl: URL.createObjectURL(blob),
        transcript: transcriptRef.current,
        timeUsed: question.timeSeconds - timeLeftRef.current,
        skipped: false,
      })
    }
    recorder.start()
    setPhase('recording')

    // Live transcription — no Whisper per question, saved for final report
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SR) {
      const recog = new SR()
      recog.continuous = true; recog.interimResults = true; recog.lang = 'en-US'
      recog.onresult = (e: any) => {
        const text = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join(' ')
        transcriptRef.current = text
        setLiveTranscript(text)
      }
      recog.onerror = () => {}
      recog.start()
      speechRef.current = recog
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1
        timeLeftRef.current = next
        if (next <= 0) {
          clearInterval(timerRef.current!)
          doSend()
          return 0
        }
        return next
      })
    }, 1000)
  }

  function doSend() {
    if (sentRef.current) return
    sentRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    try { speechRef.current?.stop() } catch {}
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
      setPhase('done')
    }
  }

  function handleSkip() {
    if (sentRef.current) return
    sentRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    try { speechRef.current?.stop() } catch {}
    streamRef.current?.getTracks().forEach(t => t.stop())
    onComplete({ questionId: question.id, question: question.question, videoUrl: null, transcript: '', timeUsed: 0, skipped: true })
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} onClick={() => setWordTooltip(null)}>

      {wordTooltip && (
        <div onClick={e => e.stopPropagation()} style={{
          position: 'fixed',
          left: Math.min(wordTooltip.x - 80, window.innerWidth - 180),
          top: wordTooltip.y - 90,
          width: 160, background: 'rgba(6,9,14,0.97)',
          border: '1px solid ' + SB, borderRadius: 12, padding: '10px 12px',
          zIndex: 999, boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
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
          {phase === 'recording' && (
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

      {/* Camera area */}
      <div style={{ flex: 1, position: 'relative', background: '#02040a', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: cameraReady ? 'block' : 'none' }} />

        {!cameraReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, border: `2px solid ${S}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 12, color: '#4a6a7a' }}>Opening camera…</span>
          </div>
        )}

        {phase === 'recording' && (
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.65)', borderRadius: 20, padding: '4px 10px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f87171', display: 'inline-block', animation: 'micPulse 0.8s ease-in-out infinite' }} />
            <span style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700 }}>REC</span>
          </div>
        )}

        {phase === 'done' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,6,10,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ fontSize: 40, color: '#4ade80' }}>✓</div>
            <span style={{ fontSize: 13, color: S }}>Answer saved</span>
          </div>
        )}
      </div>

      {/* Bottom panel — question always visible */}
      <div style={{ background: 'rgba(6,9,14,0.98)', borderTop: '1px solid ' + SB, padding: '12px 16px', flexShrink: 0 }}>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
          <RickPhoto size={28} imgStyle={{ border: `1.5px solid ${S}` }} fallbackStyle={{ background: SBG, color: S }} />
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

        {phase === 'recording' && liveTranscript && (
          <div style={{ background: SBG, border: '1px solid ' + SB, borderRadius: 8, padding: '7px 10px', marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#6a8a9a', fontStyle: 'italic', lineHeight: 1.5 }}>"{liveTranscript}"</p>
          </div>
        )}

        {phase === 'loading-audio' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, color: '#4a6a7a', fontSize: 12 }}>
            <div style={{ width: 14, height: 14, border: `2px solid ${S}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Preparing question…
          </div>
        )}

        {phase === 'ready' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={startRecording}
              style={{ flex: 1, padding: '13px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${S},#4a88a8)`, color: '#04060a', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171', flexShrink: 0 }} />
              RECORD ANSWER
            </button>
            <button onClick={handleSkip}
              style={{ padding: '13px 16px', borderRadius: 12, border: '1px solid ' + SB, background: 'transparent', color: '#4a6a7a', fontSize: 13, cursor: 'pointer' }}>
              Skip
            </button>
          </div>
        )}

        {phase === 'recording' && (
          <button onClick={doSend}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#5a8898,#3a6878)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>
            ✓ SEND ANSWER
          </button>
        )}

        {phase === 'done' && <div style={{ height: 46 }} />}
      </div>
    </div>
  )
}
