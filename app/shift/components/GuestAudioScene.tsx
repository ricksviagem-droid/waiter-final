'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import type { GuestAudioScene as GuestAudioSceneType, GuestAudioResult } from '@/lib/shift/types'
import Timer from './Timer'
import RickTutor from './RickTutor'
import MicButton from './MicButton'
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
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState<GuestAudioResult | null>(null)
  const [audioError, setAudioError] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startTimer = useCallback(() => {
    setTimerRunning(true)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    setTimerRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  // Load and play guest audio
  useEffect(() => {
    let cancelled = false
    setPhase('loading-audio')
    setTimeLeft(TIMER_SECONDS)

    async function loadAudio() {
      try {
        const res = await fetch('/api/shift/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: scene.guestAudio,
            nationality: scene.guestNationality,
            gender: scene.guestGender,
          }),
        })
        if (!res.ok) throw new Error('TTS failed')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        if (cancelled) return

        const audio = new Audio(url)
        audioRef.current = audio
        audio.onended = () => {
          if (!cancelled) {
            setPhase('recording')
            startTimer()
          }
        }
        audio.onerror = () => {
          if (!cancelled) {
            setAudioError(true)
            setPhase('recording')
            startTimer()
          }
        }
        setPhase('playing')
        audio.play().catch(() => {
          setPhase('recording')
          startTimer()
        })
      } catch {
        if (!cancelled) {
          setAudioError(true)
          setPhase('recording')
          startTimer()
        }
      }
    }

    loadAudio()
    return () => {
      cancelled = true
      audioRef.current?.pause()
      stopTimer()
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [scene, startTimer, stopTimer])

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await transcribeAndEvaluate(blob)
      }

      recorder.start()
    } catch {
      setPhase('result')
    }
  }, [])

  const handleStopRecording = useCallback(() => {
    stopTimer()
    mediaRecorderRef.current?.stop()
    setPhase('processing')
  }, [stopTimer])

  const handleTimerExpire = useCallback(() => {
    if (phase === 'recording') {
      mediaRecorderRef.current?.stop()
      setPhase('processing')
    }
  }, [phase])

  async function transcribeAndEvaluate(audioBlob: Blob) {
    setPhase('processing')
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'response.webm')
      const whisperRes = await fetch('/api/shift/whisper', { method: 'POST', body: formData })
      const { transcript: tx } = await whisperRes.json()
      setTranscript(tx)

      const evalRes = await fetch('/api/shift/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: tx, scene }),
      })
      const evalData = await evalRes.json()

      const r: GuestAudioResult = {
        sceneId: scene.id,
        type: 'guest-audio',
        transcript: tx,
        score: evalData.score ?? 5,
        sopScore: evalData.sopScore ?? 5,
        feedback: evalData.feedback ?? '',
        betterPhrase: evalData.betterPhrase ?? '',
        passed: evalData.passed ?? false,
      }
      setResult(r)
      setPhase('result')
    } catch {
      const r: GuestAudioResult = {
        sceneId: scene.id,
        type: 'guest-audio',
        transcript: transcript || '(no audio captured)',
        score: 0,
        sopScore: 0,
        feedback: 'Could not evaluate this response.',
        betterPhrase: '',
        passed: false,
      }
      setResult(r)
      setPhase('result')
    }
  }

  const scoreColor = (s: number) => (s >= 7 ? '#22c55e' : s >= 5 ? '#f59e0b' : '#ef4444')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scene image — 55% */}
      <div style={{ height: '55%', position: 'relative', background: '#0a1520', flexShrink: 0 }}>
        <Image
          src={`/scenes/scene-${String(scene.id).padStart(2, '0')}.jpg`}
          alt={scene.title}
          fill
          style={{ objectFit: 'cover', opacity: 0.85 }}
          onError={() => {}}
          priority
        />
        {/* Scene badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(10,20,35,0.8)', backdropFilter: 'blur(8px)',
          border: '1px solid #3b9eff', borderRadius: 20,
          padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#3b9eff',
        }}>
          SCENE {sceneNumber} / {totalScenes}
        </div>
        {/* Guest audio badge */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(59,158,255,0.15)', border: '1px solid #3b9eff',
          borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#3b9eff',
          backdropFilter: 'blur(8px)',
        }}>
          🎙 GUEST AUDIO
        </div>
        {/* Rick Tutor */}
        <RickTutor tip={scene.rickTip} visible={phase === 'recording' || phase === 'playing'} />
      </div>

      {/* Interaction panel — 45% */}
      <div style={{
        flex: 1, background: 'rgba(10,18,30,0.97)',
        borderTop: '1px solid #1e3a5f', padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden',
      }}>
        {/* Title + SOP */}
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff' }}>{scene.title}</h2>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#3b9eff', fontWeight: 600 }}>{scene.sopReference}</p>
        </div>

        {/* Phase: loading */}
        {phase === 'loading-audio' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, color: '#c8dff5', fontSize: 14 }}>
            <div style={{ width: 24, height: 24, border: '3px solid #3b9eff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Loading guest audio…
          </div>
        )}

        {/* Phase: playing */}
        {phase === 'playing' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'rgba(59,158,255,0.08)', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#7aa8cc', lineHeight: 1.5 }}>
                <strong style={{ color: '#3b9eff' }}>Guest:</strong> {scene.guestAudio}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f59e0b', fontSize: 13 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'micPulse 1s ease-in-out infinite' }} />
              Guest is speaking…
            </div>
          </div>
        )}

        {/* Phase: recording */}
        {phase === 'recording' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid #1e3a5f', borderRadius: 10, padding: '8px 14px' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#7aa8cc', lineHeight: 1.5 }}>
                <strong style={{ color: '#3b9eff' }}>Guest:</strong> {scene.guestAudio}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <MicButton
                recording={!!mediaRecorderRef.current?.state && mediaRecorderRef.current.state === 'recording'}
                disabled={false}
                onStart={handleStartRecording}
                onStop={handleStopRecording}
              />
              <Timer seconds={timeLeft} total={TIMER_SECONDS} onExpire={handleTimerExpire} running={timerRunning} />
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#556b82', textAlign: 'center' }}>
              Tap mic to record your response
            </p>
          </div>
        )}

        {/* Phase: processing */}
        {phase === 'processing' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, color: '#c8dff5', fontSize: 14 }}>
            <div style={{ width: 24, height: 24, border: '3px solid #3b9eff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Evaluating your response…
          </div>
        )}

        {/* Phase: result */}
        {phase === 'result' && result && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
            {/* Scores */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ label: 'Score', value: result.score }, { label: 'SOP', value: result.sopScore }].map(({ label, value }) => (
                <div key={label} style={{
                  flex: 1, background: 'rgba(10,20,35,0.8)', border: `1px solid ${scoreColor(value)}`,
                  borderRadius: 10, padding: '8px 12px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: scoreColor(value) }}>{value}/10</div>
                  <div style={{ fontSize: 11, color: '#7aa8cc' }}>{label}</div>
                </div>
              ))}
              <div style={{
                flex: 1, background: result.passed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${result.passed ? '#22c55e' : '#ef4444'}`,
                borderRadius: 10, padding: '8px 12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: result.passed ? '#22c55e' : '#ef4444' }}>
                  {result.passed ? '✓' : '✗'}
                </div>
                <div style={{ fontSize: 11, color: '#7aa8cc' }}>{result.passed ? 'Passed' : 'Failed'}</div>
              </div>
            </div>

            {/* Feedback */}
            <div style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#c8dff5', lineHeight: 1.5 }}>{result.feedback}</p>
            </div>

            {/* Better phrase */}
            {result.betterPhrase && (
              <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid #166534', borderRadius: 10, padding: '8px 14px' }}>
                <p style={{ margin: 0, fontSize: 11, color: '#86efac', lineHeight: 1.5 }}>
                  <strong style={{ color: '#22c55e' }}>Better: </strong>{result.betterPhrase}
                </p>
              </div>
            )}

            <button
              onClick={() => onComplete(result)}
              style={{
                marginTop: 'auto', padding: '12px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg,#3b9eff,#1a5fa8)',
                color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Next Scene →
            </button>
          </div>
        )}

        {/* Partial report button */}
        <button
          onClick={onPartialReport}
          style={{
            background: 'none', border: 'none', color: '#3b5a7a',
            fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0, alignSelf: 'center',
          }}
        >
          View partial report
        </button>
      </div>
    </div>
  )
}
