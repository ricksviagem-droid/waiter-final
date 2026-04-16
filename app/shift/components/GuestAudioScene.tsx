'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { GuestAudioScene as GuestAudioSceneType, GuestAudioResult } from '@/lib/shift/types'
import Timer from './Timer'
import { TIMER_SECONDS } from '@/lib/shift/scenes'

interface Props {
  scene: GuestAudioSceneType
  sceneNumber: number
  totalScenes: number
  onComplete: (result: GuestAudioResult) => void
  onPartialReport: () => void
}

type Phase = 'loading-audio' | 'playing' | 'recording' | 'processing' | 'result'

export default function GuestAudioScene({ scene, sceneNumber, totalScenes, onComplete, onPartialReport }: Props) {
  const [phase, setPhase] = useState<Phase>('loading-audio')
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [timerRunning, setTimerRunning] = useState(false)
  const [result, setResult] = useState<GuestAudioResult | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showRick, setShowRick] = useState(false)
  const [recording, setRecording] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopTimer = useCallback(() => {
    setTimerRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const startTimer = useCallback(() => {
    setTimerRunning(true)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0 }
        return t - 1
      })
    }, 1000)
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setRecording(false)
    stopTimer()
    setPhase('processing')
  }, [stopTimer])

  const handleTimerExpire = useCallback(() => {
    if (phase === 'recording') stopRecording()
  }, [phase, stopRecording])

  // Auto-start recording when phase becomes 'recording'
  useEffect(() => {
    if (phase !== 'recording') return
    let cancelled = false

    async function startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        const recorder = new MediaRecorder(stream)
        mediaRecorderRef.current = recorder
        chunksRef.current = []

        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
        recorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop())
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          await transcribeAndEvaluate(blob)
        }
        recorder.start()
        setRecording(true)
        startTimer()
      } catch {
        if (!cancelled) setPhase('result')
      }
    }

    startRecording()
    return () => { cancelled = true }
  }, [phase, startTimer])

  // Load and play guest audio
  useEffect(() => {
    let cancelled = false
    setPhase('loading-audio')
    setTimeLeft(TIMER_SECONDS)
    setResult(null)
    setShowFeedback(false)
    setShowRick(false)

    async function loadAudio() {
      try {
        const res = await fetch('/api/shift/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: scene.guestAudio, nationality: scene.guestNationality, gender: scene.guestGender }),
        })
        if (!res.ok) throw new Error('TTS failed')
        const blob = await res.blob()
        if (cancelled) return
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio
        audio.onended = () => { if (!cancelled) setPhase('recording') }
        audio.onerror = () => { if (!cancelled) setPhase('recording') }
        setPhase('playing')
        audio.play().catch(() => { if (!cancelled) setPhase('recording') })
      } catch {
        if (!cancelled) setPhase('recording')
      }
    }
    loadAudio()
    return () => {
      cancelled = true
      audioRef.current?.pause()
      stopTimer()
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    }
  }, [scene, stopTimer])

  async function transcribeAndEvaluate(audioBlob: Blob) {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'response.webm')
      const whisperRes = await fetch('/api/shift/whisper', { method: 'POST', body: formData })
      const { transcript } = await whisperRes.json()

      const evalRes = await fetch('/api/shift/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, scene }),
      })
      const evalData = await evalRes.json()
      const r: GuestAudioResult = {
        sceneId: scene.id, type: 'guest-audio', transcript,
        score: evalData.score ?? 5, sopScore: evalData.sopScore ?? 5,
        feedback: evalData.feedback ?? '', betterPhrase: evalData.betterPhrase ?? '',
        passed: evalData.passed ?? false,
      }
      setResult(r)
      setPhase('result')
      // Auto-advance after 3s unless user opened feedback
      autoAdvanceRef.current = setTimeout(() => {
        if (!showFeedback) onComplete(r)
      }, 3000)
    } catch {
      const r: GuestAudioResult = {
        sceneId: scene.id, type: 'guest-audio', transcript: '(error)',
        score: 0, sopScore: 0, feedback: '', betterPhrase: '', passed: false,
      }
      setResult(r)
      setPhase('result')
      autoAdvanceRef.current = setTimeout(() => onComplete(r), 2000)
    }
  }

  const handleManualAdvance = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    if (result) onComplete(result)
  }

  const scoreColor = (s: number) => s >= 7 ? '#22c55e' : s >= 5 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scene image 55% */}
      <div style={{ height: '55%', position: 'relative', background: '#0a1520', flexShrink: 0, overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/scenes/scene-${String(scene.id).padStart(2, '0')}.jpg`} alt={scene.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(10,20,35,0.85)', backdropFilter: 'blur(8px)', border: '1px solid #3b9eff', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#3b9eff' }}>
          SCENE {sceneNumber} / {totalScenes}
        </div>
        <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(59,158,255,0.15)', border: '1px solid #3b9eff', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#3b9eff', backdropFilter: 'blur(8px)' }}>
          🎙 GUEST AUDIO
        </div>

        {/* Recording indicator */}
        {recording && (
          <div style={{ position: 'absolute', bottom: 14, right: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 20, padding: '5px 12px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'micPulse 1s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>RECORDING</span>
          </div>
        )}

        {/* Rick tip button */}
        <button onClick={() => setShowRick(v => !v)} style={{ position: 'absolute', bottom: 14, left: 14, background: showRick ? 'rgba(59,158,255,0.3)' : 'rgba(10,20,35,0.85)', border: '1px solid #3b9eff', borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 600, color: '#3b9eff', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
          💡 Rick Tip
        </button>

        {/* Rick tip overlay */}
        {showRick && (
          <div style={{ position: 'absolute', bottom: 46, left: 12, width: 230, background: 'rgba(10,20,35,0.95)', border: '1px solid #3b9eff', borderRadius: 12, padding: '10px 12px', backdropFilter: 'blur(10px)', boxShadow: '0 0 16px rgba(59,158,255,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#3b9eff,#1a5fa8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>R</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#3b9eff', letterSpacing: 1 }}>RICK TUTOR</span>
            </div>
            <p style={{ fontSize: 12, color: '#c8dff5', lineHeight: 1.5, margin: 0 }}>{scene.rickTip}</p>
          </div>
        )}
      </div>

      {/* Interaction panel 45% */}
      <div style={{ flex: 1, background: 'rgba(10,18,30,0.97)', borderTop: '1px solid #1e3a5f', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, paddingRight: 10 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>{scene.title}</h2>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#3b9eff', fontWeight: 600 }}>{scene.sopReference}</p>
          </div>
          {(phase === 'recording') && (
            <Timer seconds={timeLeft} total={TIMER_SECONDS} onExpire={handleTimerExpire} running={timerRunning} />
          )}
        </div>

        {/* Guest speech bubble */}
        <div style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px' }}>
          <p style={{ margin: 0, fontSize: 13, color: phase === 'loading-audio' ? '#3b5a7a' : '#c8dff5', lineHeight: 1.5, fontStyle: 'italic' }}>
            {phase === 'loading-audio' ? 'Loading guest audio…' : `"${scene.guestAudio}"`}
          </p>
        </div>

        {/* Phase status */}
        {phase === 'loading-audio' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#7aa8cc', fontSize: 13 }}>
            <div style={{ width: 18, height: 18, border: '2px solid #3b9eff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Preparing scene…
          </div>
        )}

        {phase === 'playing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f59e0b', fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'micPulse 1s ease-in-out infinite' }} />
            Guest is speaking… listen carefully.
          </div>
        )}

        {phase === 'recording' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 13, fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'micPulse 1s ease-in-out infinite' }} />
              Speak your response now
            </div>
            <button onClick={stopRecording} style={{ padding: '10px', borderRadius: 10, border: '1px solid #ef4444', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              ⏹ Done — submit response
            </button>
          </div>
        )}

        {phase === 'processing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#7aa8cc', fontSize: 13 }}>
            <div style={{ width: 18, height: 18, border: '2px solid #3b9eff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Evaluating your response…
          </div>
        )}

        {phase === 'result' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflow: 'auto' }}>
            {/* Score pills */}
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, background: 'rgba(10,20,35,0.8)', border: `1px solid ${scoreColor(result.score)}`, borderRadius: 10, padding: '6px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: scoreColor(result.score) }}>{result.score}/10</div>
                <div style={{ fontSize: 10, color: '#7aa8cc' }}>Score</div>
              </div>
              <div style={{ flex: 1, background: result.passed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${result.passed ? '#22c55e' : '#ef4444'}`, borderRadius: 10, padding: '6px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: result.passed ? '#22c55e' : '#ef4444' }}>{result.passed ? '✓' : '✗'}</div>
                <div style={{ fontSize: 10, color: '#7aa8cc' }}>{result.passed ? 'Passed' : 'Failed'}</div>
              </div>
              <button onClick={() => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); setShowFeedback(v => !v) }}
                style={{ flex: 1, border: '1px solid #1e3a5f', borderRadius: 10, background: showFeedback ? 'rgba(59,158,255,0.15)' : 'transparent', color: '#3b9eff', fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: '6px 4px' }}>
                📋 Feedback
              </button>
            </div>

            {/* Feedback panel (on demand) */}
            {showFeedback && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid #1e3a5f', borderRadius: 10, padding: '8px 12px' }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#c8dff5', lineHeight: 1.5 }}>{result.feedback}</p>
                </div>
                {result.betterPhrase && (
                  <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid #166534', borderRadius: 10, padding: '8px 12px' }}>
                    <p style={{ margin: 0, fontSize: 11, color: '#86efac', lineHeight: 1.5 }}><strong style={{ color: '#22c55e' }}>Better: </strong>{result.betterPhrase}</p>
                  </div>
                )}
                <button onClick={handleManualAdvance} style={{ padding: '10px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#3b9eff,#1a5fa8)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Next Scene →
                </button>
              </div>
            )}

            {!showFeedback && (
              <p style={{ margin: 0, fontSize: 12, color: '#3b5a7a', textAlign: 'center' }}>
                Advancing to next scene…
              </p>
            )}
          </div>
        )}

        <button onClick={onPartialReport} style={{ background: 'none', border: 'none', color: '#2a4a6a', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0, alignSelf: 'center', marginTop: 'auto' }}>
          View partial report
        </button>
      </div>
    </div>
  )
}
