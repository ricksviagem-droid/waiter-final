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
type WordColor = 'idle' | 'red' | 'yellow' | 'green'
type MicStatus = 'checking' | 'ok' | 'denied' | 'unavailable'

function playSendSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12)
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.22)
  } catch {}
}

export default function GuestAudioScene({ scene, sceneNumber, totalScenes, onComplete, onPartialReport }: Props) {
  const [phase, setPhase] = useState<Phase>('loading-audio')
  const [micStatus, setMicStatus] = useState<MicStatus>('checking')
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [timerRunning, setTimerRunning] = useState(false)
  const [result, setResult] = useState<GuestAudioResult | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showRick, setShowRick] = useState(false)
  const [recording, setRecording] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [wordColor, setWordColor] = useState<WordColor>('idle')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const guestAudioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const speechRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null)
  const showFeedbackRef = useRef(false)

  const playClick = useCallback(() => { try { new Audio('/click.mp3').play() } catch {} }, [])

  // Mic permission check on mount
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicStatus('unavailable')
      return
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        stream.getTracks().forEach(t => t.stop())
        setMicStatus('ok')
      })
      .catch(err => {
        setMicStatus(err.name === 'NotAllowedError' ? 'denied' : 'unavailable')
      })
  }, [])

  const stopTimer = useCallback(() => {
    setTimerRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const startTimer = useCallback(() => {
    setTimerRunning(true)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current!); return 0 } return t - 1 })
    }, 1000)
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop()
    streamRef.current?.getTracks().forEach(t => t.stop())
    try { speechRef.current?.stop() } catch {}
    setRecording(false)
    stopTimer()
    setPhase('processing')
  }, [stopTimer])

  const handleTimerExpire = useCallback(() => {
    if (phase === 'recording') stopRecording()
  }, [phase, stopRecording])

  // Auto-start recording + Web Speech API when phase becomes 'recording'
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

        recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
        recorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop())
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
          await transcribeAndEvaluate(blob, url)
        }
        recorder.start()
        setRecording(true)
        startTimer()

        // Web Speech API for live transcription
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SR) {
          const recog = new SR()
          recog.continuous = true
          recog.interimResults = true
          recog.lang = 'en-US'
          recog.onresult = (e: any) => {
            const text = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join(' ')
            setLiveTranscript(text)
            const words = text.trim().split(/\s+/).filter(Boolean).length
            setWordColor(words >= 10 ? 'green' : words >= 4 ? 'yellow' : 'red')
          }
          recog.onerror = () => {}
          recog.start()
          speechRef.current = recog
        } else {
          setWordColor('red')
        }
      } catch {
        if (!cancelled) setPhase('result')
      }
    }

    startRecording()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, startTimer])

  // Load and play guest audio
  useEffect(() => {
    let cancelled = false
    setPhase('loading-audio')
    setTimeLeft(TIMER_SECONDS)
    setResult(null)
    setShowFeedback(false)
    showFeedbackRef.current = false
    setShowRick(false)
    setLiveTranscript('')
    setWordColor('idle')
    setAudioUrl(null)

    async function loadAudio() {
      try {
        const res = await fetch('/api/shift/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: scene.guestAudio, nationality: scene.guestNationality, gender: scene.guestGender }),
        })
        if (!res.ok) throw new Error()
        const blob = await res.blob()
        if (cancelled) return
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        guestAudioRef.current = audio
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
      guestAudioRef.current?.pause()
      stopTimer()
      streamRef.current?.getTracks().forEach(t => t.stop())
      try { speechRef.current?.stop() } catch {}
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    }
  }, [scene, stopTimer])

  async function transcribeAndEvaluate(blob: Blob, blobUrl: string) {
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'response.webm')
      const whisperRes = await fetch('/api/shift/whisper', { method: 'POST', body: formData })
      const { transcript } = await whisperRes.json()
      if (transcript) setLiveTranscript(transcript)

      const evalRes = await fetch('/api/shift/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, scene }),
      })
      const evalData = await evalRes.json()
      const r: GuestAudioResult = {
        sceneId: scene.id, type: 'guest-audio',
        transcript: transcript || '',
        audioUrl: blobUrl,
        score: evalData.score ?? 5, sopScore: evalData.sopScore ?? 5,
        feedback: evalData.feedback ?? '', betterPhrase: evalData.betterPhrase ?? '',
        passed: evalData.passed ?? false,
      }
      setResult(r)
      setPhase('result')
      autoAdvanceRef.current = setTimeout(() => {
        if (!showFeedbackRef.current) onComplete(r)
      }, 3000)
    } catch {
      const r: GuestAudioResult = {
        sceneId: scene.id, type: 'guest-audio',
        transcript: liveTranscript || '', audioUrl: blobUrl,
        score: 0, sopScore: 0, feedback: '', betterPhrase: '', passed: false,
      }
      setResult(r)
      setPhase('result')
      autoAdvanceRef.current = setTimeout(() => onComplete(r), 2000)
    }
  }

  const handleSend = () => {
    playSendSound()
    playClick()
    stopRecording()
  }

  const handleManualAdvance = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    if (result) onComplete(result)
  }

  const scoreColor = (s: number) => s >= 7 ? '#22c55e' : s >= 5 ? '#f59e0b' : '#ef4444'

  const DOT_COLORS: Record<WordColor, string> = {
    idle: '#3b5a7a', red: '#ef4444', yellow: '#f59e0b', green: '#22c55e'
  }

  const MIC_ICON = micStatus === 'ok' ? '🎙' : micStatus === 'denied' ? '🚫' : micStatus === 'checking' ? '⏳' : '⚠️'
  const MIC_COLOR = micStatus === 'ok' ? '#22c55e' : micStatus === 'denied' ? '#ef4444' : '#f59e0b'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scene image 55% */}
      <div style={{ height: '55%', position: 'relative', background: '#0a1520', flexShrink: 0, overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/scenes/scene-${String(scene.id).padStart(2, '0')}.jpg`} alt={scene.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
          onError={e => { (e.currentTarget as HTMLImageElement).src = `/scenes/scene-${String(scene.id).padStart(2, '0')}.svg` }}
        />
        <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(10,20,35,0.85)', backdropFilter: 'blur(8px)', border: '1px solid #3b9eff', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#3b9eff' }}>
          SCENE {sceneNumber} / {totalScenes}
        </div>
        <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(59,158,255,0.15)', border: '1px solid #3b9eff', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#3b9eff', backdropFilter: 'blur(8px)' }}>
          🎙 GUEST AUDIO
        </div>

        {/* Mic status indicator */}
        <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(0,0,0,0.7)', border: `1px solid ${MIC_COLOR}`, borderRadius: 20, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(8px)' }}>
          <span style={{ fontSize: 11 }}>{MIC_ICON}</span>
          <span style={{ fontSize: 10, color: MIC_COLOR, fontWeight: 600 }}>
            {micStatus === 'ok' ? 'Mic OK' : micStatus === 'denied' ? 'Mic blocked' : micStatus === 'checking' ? 'Checking…' : 'No mic'}
          </span>
          {recording && (
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: DOT_COLORS[wordColor], display: 'inline-block', animation: 'micPulse 0.8s ease-in-out infinite', boxShadow: `0 0 6px ${DOT_COLORS[wordColor]}`, marginLeft: 2 }} />
          )}
        </div>

        {/* Rick tip button */}
        <button onClick={() => { playClick(); setShowRick(v => !v) }}
          style={{ position: 'absolute', bottom: 14, left: 14, background: showRick ? 'rgba(59,158,255,0.3)' : 'rgba(10,20,35,0.85)', border: '1px solid #3b9eff', borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 600, color: '#3b9eff', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
          💡 Rick
        </button>

        {/* Rick tip overlay */}
        {showRick && (
          <div style={{ position: 'absolute', bottom: 46, left: 12, width: 235, background: 'rgba(6,12,22,0.97)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 14, padding: '10px 12px', backdropFilter: 'blur(16px)', boxShadow: '0 0 24px rgba(245,158,11,0.15)' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(245,158,11,0.5),transparent)', borderRadius:'14px 14px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/rick.jpg" alt="Rick" style={{ width:30, height:30, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', display:'block' }}
                  onError={e => { const el = e.currentTarget; el.style.display='none'; (el.nextSibling as HTMLElement).style.display='flex' }}
                />
                <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#0a2a4a,#1a5fa8)', display:'none', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff' }}>R</div>
                <div style={{ position:'absolute', inset:-1.5, borderRadius:'50%', border:'1.5px solid transparent', background:'linear-gradient(#020810,#020810) padding-box, linear-gradient(135deg,#f59e0b,#b45309) border-box' }} />
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fcd34d', letterSpacing: 1 }}>RICK</span>
                <span style={{ fontSize: 9, color: '#7aa8cc', marginLeft: 5 }}>Mentor Tip</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#c8dff5', lineHeight: 1.6, margin: 0 }}>{scene.rickTip}</p>
          </div>
        )}
      </div>

      {/* Interaction panel 45% */}
      <div style={{ flex: 1, background: 'rgba(8,15,26,0.98)', borderTop: '1px solid #1e3a5f', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, paddingRight: 10 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>{scene.title}</h2>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#3b9eff', fontWeight: 600 }}>{scene.sopReference}</p>
          </div>
          {phase === 'recording' && <Timer seconds={timeLeft} total={TIMER_SECONDS} onExpire={handleTimerExpire} running={timerRunning} />}
        </div>

        {/* Mic denied warning */}
        {micStatus === 'denied' && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 10, padding: '8px 12px' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#fca5a5' }}>🚫 Microphone access blocked. Please allow it in your browser settings to continue.</p>
          </div>
        )}

        {/* Guest speech */}
        <div style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid #1a3050', borderRadius: 10, padding: '10px 13px' }}>
          <p style={{ margin: 0, fontSize: 13, color: phase === 'loading-audio' ? '#3b5a7a' : '#c8dff5', lineHeight: 1.55, fontStyle: 'italic' }}>
            {phase === 'loading-audio' ? 'Loading guest audio…' : `"${scene.guestAudio}"`}
          </p>
        </div>

        {phase === 'loading-audio' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#7aa8cc', fontSize: 13 }}>
            <div style={{ width: 18, height: 18, border: '2px solid #3b9eff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Preparing scene…
          </div>
        )}

        {phase === 'playing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f59e0b', fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'micPulse 1s ease-in-out infinite' }} />
            Guest is speaking…
          </div>
        )}

        {phase === 'recording' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Live transcript */}
            {liveTranscript ? (
              <div style={{ background: `${DOT_COLORS[wordColor]}10`, border: `1px solid ${DOT_COLORS[wordColor]}40`, borderRadius: 10, padding: '8px 12px', minHeight: 40 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#e2e8f0', lineHeight: 1.5, fontStyle: 'italic' }}>"{liveTranscript}"</p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 13, fontWeight: 600 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'micPulse 1s ease-in-out infinite' }} />
                🎙 Speak your response now
              </div>
            )}
            <button onClick={handleSend}
              style={{ padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#ef4444,#b91c1c)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 0 20px rgba(239,68,68,0.3)' }}>
              📤 Send Response
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
            {result.transcript && (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e3a5f', borderRadius: 10, padding: '8px 12px' }}>
                <p style={{ margin: '0 0 2px', fontSize: 10, color: '#3b9eff', fontWeight: 700, letterSpacing: 1 }}>YOU SAID:</p>
                <p style={{ margin: 0, fontSize: 12, color: '#c8dff5', lineHeight: 1.5, fontStyle: 'italic' }}>"{result.transcript}"</p>
              </div>
            )}

            {/* Play back recorded audio */}
            {result.audioUrl && (
              <audio controls src={result.audioUrl} style={{ width: '100%', height: 32, filter: 'invert(0.8) hue-rotate(180deg)' }} />
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, background: 'rgba(10,20,35,0.8)', border: `1px solid ${scoreColor(result.score)}`, borderRadius: 10, padding: '6px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: scoreColor(result.score) }}>{result.score}/10</div>
                <div style={{ fontSize: 10, color: '#7aa8cc' }}>Score</div>
              </div>
              <div style={{ flex: 1, background: result.passed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${result.passed ? '#22c55e' : '#ef4444'}`, borderRadius: 10, padding: '6px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: result.passed ? '#22c55e' : '#ef4444' }}>{result.passed ? '✓' : '✗'}</div>
                <div style={{ fontSize: 10, color: '#7aa8cc' }}>{result.passed ? 'Passed' : 'Needs work'}</div>
              </div>
              <button onClick={() => {
                  playClick()
                  if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
                  const next = !showFeedback
                  setShowFeedback(next)
                  showFeedbackRef.current = next
                }}
                style={{ flex: 1, border: '1px solid #1e3a5f', borderRadius: 10, background: showFeedback ? 'rgba(59,158,255,0.15)' : 'transparent', color: '#3b9eff', fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: '6px 4px' }}>
                📋 Feedback
              </button>
            </div>

            {showFeedback && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.feedback && (
                  <div style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid #1e3a5f', borderRadius: 10, padding: '8px 12px' }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#c8dff5', lineHeight: 1.5 }}>{result.feedback}</p>
                  </div>
                )}
                {result.betterPhrase && (
                  <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid #166534', borderRadius: 10, padding: '8px 12px' }}>
                    <p style={{ margin: 0, fontSize: 11, color: '#86efac', lineHeight: 1.5 }}><strong style={{ color: '#22c55e' }}>Better: </strong>"{result.betterPhrase}"</p>
                  </div>
                )}
                <button onClick={() => { playClick(); handleManualAdvance() }}
                  style={{ padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#3b9eff,#1a5fa8)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Next Scene →
                </button>
              </div>
            )}

            {!showFeedback && (
              <p style={{ margin: 0, fontSize: 12, color: '#3b5a7a', textAlign: 'center' }}>
                Advancing in 3s… or tap 📋 Feedback
              </p>
            )}
          </div>
        )}

        <button onClick={onPartialReport} style={{ background: 'none', border: 'none', color: '#243a52', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0, alignSelf: 'center', marginTop: 'auto' }}>
          View partial report
        </button>
      </div>
    </div>
  )
}
