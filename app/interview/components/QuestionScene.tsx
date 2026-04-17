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

type Phase = 'loading-audio' | 'playing' | 'camera-preview' | 'recording' | 'processing' | 'result'

export default function QuestionScene({ question, questionIndex, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('loading-audio')
  const [timeLeft, setTimeLeft] = useState(question.timeSeconds)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [result, setResult] = useState<QuestionResult | null>(null)
  const [showCaption, setShowCaption] = useState(false)
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
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset when question changes
  useEffect(() => {
    setPhase('loading-audio')
    setTimeLeft(question.timeSeconds)
    setLiveTranscript('')
    setVideoUrl(null)
    setResult(null)
    setShowCaption(false)
    setShowPt(false)
    setPtText(null)
    setWordTooltip(null)
  }, [question])

  // Load and play Rick's question audio
  useEffect(() => {
    if (phase !== 'loading-audio') return
    let cancelled = false
    async function loadAudio() {
      try {
        const res = await fetch('/api/shift/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: question.question, speaker: 'rick' }),
        })
        if (!res.ok) throw new Error()
        const blob = await res.blob()
        if (cancelled) return
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.onended = () => { if (!cancelled) setPhase('camera-preview') }
        audio.onerror = () => { if (!cancelled) setPhase('camera-preview') }
        setPhase('playing')
        audio.play().catch(() => { if (!cancelled) setPhase('camera-preview') })
      } catch {
        if (!cancelled) setPhase('camera-preview')
      }
    }
    loadAudio()
    return () => { cancelled = true }
  }, [phase, question])

  // Open camera on camera-preview or recording
  useEffect(() => {
    if (phase !== 'camera-preview' && phase !== 'recording') return
    let cancelled = false
    async function openCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.muted = true
          videoRef.current.play().catch(() => {})
        }
      } catch {}
    }
    openCamera()
    return () => {
      cancelled = true
    }
  }, [phase])

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    try { speechRef.current?.stop() } catch {}
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    setPhase('processing')
  }, [])

  const startRecording = useCallback(() => {
    if (!streamRef.current) return
    chunksRef.current = []
    const recorder = new MediaRecorder(streamRef.current)
    recorderRef.current = recorder

    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = async () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
      await transcribeAndEvaluate(blob, url)
    }
    recorder.start()
    setPhase('recording')

    // Timer
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); stopRecording(); return 0 }
        return t - 1
      })
    }, 1000)

    // Live transcript
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
  }, [stopRecording])

  async function transcribeAndEvaluate(blob: Blob, blobUrl: string) {
    try {
      // Extract audio blob for Whisper (send full webm — it has audio track)
      const formData = new FormData()
      formData.append('audio', blob, 'response.webm')
      const whisperRes = await fetch('/api/shift/whisper', { method: 'POST', body: formData })
      const { transcript } = await whisperRes.json()
      const finalTranscript = transcript || liveTranscript || ''
      if (finalTranscript) setLiveTranscript(finalTranscript)

      const evalRes = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      autoRef.current = setTimeout(() => onComplete(r), 5000)
    } catch {
      const r: QuestionResult = {
        questionId: question.id, question: question.question,
        videoUrl: blobUrl, transcript: liveTranscript || '',
        timeUsed: question.timeSeconds, skipped: false,
        score: 5, verdict: 'good', rickFeedback: '', betterAnswer: '',
      }
      setResult(r)
      setPhase('result')
      autoRef.current = setTimeout(() => onComplete(r), 3000)
    }
  }

  function handleSkip() {
    if (timerRef.current) clearInterval(timerRef.current)
    try { speechRef.current?.stop() } catch {}
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    streamRef.current?.getTracks().forEach(t => t.stop())
    const r: QuestionResult = {
      questionId: question.id, question: question.question,
      videoUrl: null, transcript: '', timeUsed: 0, skipped: true,
      score: 0, verdict: 'skipped', rickFeedback: "Question skipped.", betterAnswer: '',
    }
    setResult(r)
    setPhase('result')
    autoRef.current = setTimeout(() => onComplete(r), 2000)
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

  const scoreColor = (s: number) => s >= 7 ? '#4ade80' : s >= 5 ? '#fbbf24' : '#f87171'
  const timerColor = timeLeft > 30 ? S : timeLeft > 15 ? '#f59e0b' : '#f87171'

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
          <div style={{ fontSize: 15, fontWeight: 800, color: S, marginBottom: wordTooltip.hint ? 4 : 0 }}>{wordTooltip.pt}</div>
          {wordTooltip.hint && <div style={{ fontSize: 11, color: '#4a6a7a', lineHeight: 1.4 }}>{wordTooltip.hint}</div>}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '12px 16px', background: 'rgba(6,9,14,0.98)', borderBottom: '1px solid ' + SB, flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 10, color: S, fontWeight: 700, letterSpacing: 1 }}>QUESTION {questionIndex + 1} / {TOTAL_QUESTIONS}</span>
          <div style={{ fontSize: 9, color: '#4a6a7a', marginTop: 1, letterSpacing: 1 }}>{question.blockLabel.toUpperCase()}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {(phase === 'recording') && (
            <span style={{ fontSize: 13, fontWeight: 700, color: timerColor }}>{timeLeft}s</span>
          )}
          <button onClick={() => setShowCaption(v => !v)}
            style={{ background: showCaption ? SBG : 'transparent', border: '1px solid ' + SB, borderRadius: 8, padding: '3px 8px', fontSize: 10, color: S, cursor: 'pointer', fontWeight: 700 }}>
            EN
          </button>
          <button onClick={() => void togglePt()}
            style={{ background: showPt ? SBG : 'transparent', border: '1px solid ' + SB, borderRadius: 8, padding: '3px 8px', fontSize: 10, color: S, cursor: 'pointer', fontWeight: 700 }}>
            {ptLoading ? '…' : '🇧🇷'}
          </button>
        </div>
      </div>

      {/* Camera / video area */}
      <div style={{ flex: 1, background: '#04060a', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {(phase === 'camera-preview' || phase === 'recording') && (
          <video ref={videoRef} autoPlay muted playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
        )}

        {(phase === 'loading-audio' || phase === 'playing') && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/scenes/rick.jpeg" alt="Rick"
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 25%', border: '2px solid ' + S }}
              onError={e => { const el = e.currentTarget; el.style.display = 'none'; (el.nextSibling as HTMLElement).style.display = 'flex' }}
            />
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(122,176,204,0.15)', display: 'none', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: S, border: '2px solid ' + S }}>R</div>
            {phase === 'loading-audio' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4a6a7a', fontSize: 13 }}>
                <div style={{ width: 16, height: 16, border: `2px solid ${S}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Preparing question…
              </div>
            )}
            {phase === 'playing' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: S, fontSize: 13, fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: S, animation: 'micPulse 0.9s ease-in-out infinite', display: 'inline-block' }} />
                Rick is asking…
              </div>
            )}
          </div>
        )}

        {phase === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#4a6a7a' }}>
            <div style={{ width: 36, height: 36, border: `2px solid ${S}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 13 }}>Analysing your response…</span>
          </div>
        )}

        {phase === 'result' && result && (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 }}>
            {result.videoUrl && (
              <video src={result.videoUrl} controls playsInline
                style={{ width: '100%', maxHeight: 200, borderRadius: 12, objectFit: 'cover', border: '1px solid ' + SB }} />
            )}
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <div style={{ flex: 1, background: SBG, border: '1px solid ' + SB, borderRadius: 10, padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor(result.score ?? 0) }}>{result.score ?? 0}/10</div>
                <div style={{ fontSize: 10, color: '#4a6a7a' }}>Score</div>
              </div>
              <div style={{ flex: 2, background: SBG, border: '1px solid ' + SB, borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ fontSize: 10, color: S, fontWeight: 700, marginBottom: 3 }}>RICK SAYS</div>
                <div style={{ fontSize: 11, color: '#a8c8dc', lineHeight: 1.5 }}>{result.rickFeedback}</div>
              </div>
            </div>
          </div>
        )}

        {/* Recording indicator */}
        {phase === 'recording' && (
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 20, padding: '4px 10px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171', animation: 'micPulse 0.8s ease-in-out infinite', display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700 }}>REC</span>
          </div>
        )}
      </div>

      {/* Question panel */}
      <div style={{ background: 'rgba(6,9,14,0.98)', borderTop: '1px solid ' + SB, padding: '12px 16px', flexShrink: 0 }}>
        <div style={{ background: SBG, border: '1px solid ' + SB, borderRadius: 10, padding: '10px 13px', marginBottom: 10 }}>
          {showCaption ? (
            <p style={{ margin: 0, fontSize: 13, color: '#c8dce8', lineHeight: 1.65, fontStyle: 'italic' }}>
              "
              {question.question.split(/(\s+)/).map((token, i) => {
                const isWord = /\S/.test(token)
                const clean = token.replace(/[^a-zA-Z''-]/g, '')
                return isWord ? (
                  <span key={i} onClick={e => { e.stopPropagation(); handleWordTap(token, (e.target as HTMLElement).getBoundingClientRect()) }}
                    style={{ cursor: 'pointer', borderBottom: wordLoadingKey === clean ? `1px solid ${S}` : `1px dashed ${SB}`, paddingBottom: 1 }}
                  >{token}</span>
                ) : token
              })}
              "
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: 12, color: '#4a6a7a', fontStyle: 'italic' }}>Tap EN to see question caption</p>
          )}
          {showPt && (
            <p style={{ margin: '7px 0 0', fontSize: 12, color: '#4a7a8a', lineHeight: 1.5, borderTop: '1px solid ' + SB, paddingTop: 7 }}>
              {ptLoading ? 'Traduzindo…' : (ptText ?? '—')}
            </p>
          )}
        </div>

        {/* Live transcript while recording */}
        {phase === 'recording' && liveTranscript && (
          <div style={{ background: 'rgba(122,176,204,0.04)', border: '1px solid rgba(122,176,204,0.15)', borderRadius: 8, padding: '7px 10px', marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#7a9aaa', fontStyle: 'italic', lineHeight: 1.5 }}>"{liveTranscript}"</p>
          </div>
        )}

        {/* Action buttons */}
        {phase === 'camera-preview' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={startRecording}
              style={{ flex: 1, padding: '13px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${S},#4a88a8)`, color: '#04060a', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>
              ● START RECORDING
            </button>
            <button onClick={handleSkip}
              style={{ padding: '13px 16px', borderRadius: 12, border: '1px solid ' + SB, background: 'transparent', color: '#4a6a7a', fontSize: 13, cursor: 'pointer' }}>
              Skip
            </button>
          </div>
        )}

        {phase === 'recording' && (
          <button onClick={stopRecording}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#5a8898,#3a6878)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>
            ■ SEND ANSWER
          </button>
        )}

        {phase === 'result' && (
          <button onClick={() => { if (autoRef.current) clearTimeout(autoRef.current); if (result) onComplete(result) }}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${S},#4a88a8)`, color: '#04060a', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>
            NEXT QUESTION →
          </button>
        )}

        {(phase === 'loading-audio' || phase === 'playing' || phase === 'processing') && (
          <div style={{ height: 46 }} />
        )}
      </div>
    </div>
  )
}
