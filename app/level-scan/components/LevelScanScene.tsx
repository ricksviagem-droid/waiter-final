'use client'

import { useState, useRef, useEffect } from 'react'
import {
  LISTENING_QUESTIONS, SPEAKING_QUESTIONS, READING_QUESTIONS, WRITING_QUESTIONS,
  TOTAL_XP, CEFR_LEVELS,
  type ScanAnswer, type SpeakingAnswer, type WritingAnswer, type ScanResult,
} from '@/lib/level-scan/data'

const P = '#818cf8'
const PB = 'rgba(129,140,248,0.22)'
const PBG = 'rgba(129,140,248,0.07)'
const G = '#00dc82'

type Section = 'intro' | 'listening' | 'speaking' | 'reading' | 'writing' | 'calculating'

function playSound(type: 'correct' | 'wrong' | 'click' | 'levelup') {
  try {
    const ctx = new AudioContext()
    const configs: Record<string, [number, number, number][]> = {
      correct: [[523, 0.1, 0], [659, 0.08, 0.12], [784, 0.06, 0.24]],
      wrong:   [[300, 0.1, 0], [220, 0.08, 0.15]],
      click:   [[660, 0.06, 0]],
      levelup: [[523, 0.1, 0], [659, 0.1, 0.1], [784, 0.1, 0.2], [1047, 0.12, 0.35]],
    }
    configs[type].forEach(([freq, gain, delay]) => {
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.type = type === 'wrong' ? 'sawtooth' : 'sine'
      o.frequency.value = freq
      const t = ctx.currentTime + delay
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(gain, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
      o.start(t); o.stop(t + 0.3)
    })
  } catch {}
}

interface Props { onComplete: (result: ScanResult) => void }

export default function LevelScanScene({ onComplete }: Props) {
  const [section, setSection] = useState<Section>('intro')
  const [xp, setXp] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null)

  // Speaking state
  const [timeLeft, setTimeLeft] = useState(60)
  const [recording, setRecording] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')

  // Writing state
  const [writingText, setWritingText] = useState('')

  // Audio for listening
  const [audioReady, setAudioReady] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)

  const mcqAnswers = useRef<ScanAnswer[]>([])
  const speakingAnswers = useRef<SpeakingAnswer[]>([])
  const writingAnswers = useRef<WritingAnswer[]>([])

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const speechRef = useRef<any>(null)
  const transcriptRef = useRef('')
  const sentRef = useRef(false)
  const didInit = useRef(false)

  const xpPct = Math.min((xp / TOTAL_XP) * 100, 100)

  // ── LISTENING ──────────────────────────────────────────────
  const lq = LISTENING_QUESTIONS[qIdx] ?? null

  async function playListeningAudio() {
    if (!lq || audioPlaying) return
    setAudioPlaying(true)
    try {
      const res = await fetch('/api/shift/tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lq.audioText, speaker: 'rick' }),
      })
      if (res.ok) {
        const blob = await res.blob()
        const audio = new Audio(URL.createObjectURL(blob))
        audio.onended = () => { setAudioPlaying(false); setAudioReady(true) }
        audio.onerror = () => { setAudioPlaying(false); setAudioReady(true) }
        audio.play().catch(() => { setAudioPlaying(false); setAudioReady(true) })
      } else {
        setAudioPlaying(false); setAudioReady(true)
      }
    } catch { setAudioPlaying(false); setAudioReady(true) }
  }

  useEffect(() => {
    if (section === 'listening') {
      setSelected(null); setConfirmed(false); setAudioReady(false); setAudioPlaying(false); setFlash(null)
      setTimeout(() => playListeningAudio(), 400)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, qIdx])

  function confirmListening() {
    if (selected === null || !lq) return
    const isCorrect = selected === lq.correct
    playSound(isCorrect ? 'correct' : 'wrong')
    setFlash(isCorrect ? 'correct' : 'wrong')
    setConfirmed(true)
    mcqAnswers.current.push({ type: 'listening', questionId: lq.id, selected, correct: lq.correct, correct_bool: isCorrect })
    if (isCorrect) setXp(prev => prev + lq.xp)
    setTimeout(() => {
      setFlash(null)
      if (qIdx + 1 < LISTENING_QUESTIONS.length) {
        setQIdx(i => i + 1)
      } else {
        setQIdx(0); setSection('speaking')
      }
    }, 1000)
  }

  // ── SPEAKING ───────────────────────────────────────────────
  const sq = SPEAKING_QUESTIONS[qIdx] ?? null

  useEffect(() => {
    if (section !== 'speaking') return
    if (didInit.current) return
    didInit.current = true

    async function openCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true })
        streamRef.current = stream
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.muted = true; videoRef.current.play().catch(() => {}) }
        setCameraReady(true)
      } catch { setCameraReady(false) }
    }
    openCamera()
    return () => { didInit.current = false }
  }, [section])

  function startSpeakingRecord() {
    if (!streamRef.current || !sq) return
    sentRef.current = false
    chunksRef.current = []
    setTimeLeft(sq.timeSeconds)
    setLiveTranscript(''); transcriptRef.current = ''

    const recorder = new MediaRecorder(streamRef.current)
    recorderRef.current = recorder
    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      speakingAnswers.current.push({ questionId: sq.id, transcript: transcriptRef.current })
      setXp(prev => prev + sq.xp)
      setRecording(false)
      if (qIdx + 1 < SPEAKING_QUESTIONS.length) {
        setQIdx(i => i + 1)
      } else {
        streamRef.current?.getTracks().forEach(t => t.stop())
        setQIdx(0); setSection('reading')
      }
    }
    recorder.start()
    setRecording(true)

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SR) {
      const recog = new SR()
      recog.continuous = true; recog.interimResults = true; recog.lang = 'en-US'
      recog.onresult = (e: any) => {
        const t = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join(' ')
        transcriptRef.current = t; setLiveTranscript(t)
      }
      recog.onerror = () => {}
      recog.start(); speechRef.current = recog
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); submitSpeaking(); return 0 }
        return t - 1
      })
    }, 1000)
  }

  function submitSpeaking() {
    if (sentRef.current) return; sentRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    try { speechRef.current?.stop() } catch {}
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  // ── READING ────────────────────────────────────────────────
  const rq = READING_QUESTIONS[qIdx] ?? null

  useEffect(() => {
    if (section === 'reading') { setSelected(null); setConfirmed(false); setFlash(null) }
  }, [section, qIdx])

  function confirmReading() {
    if (selected === null || !rq) return
    const isCorrect = selected === rq.correct
    playSound(isCorrect ? 'correct' : 'wrong')
    setFlash(isCorrect ? 'correct' : 'wrong')
    setConfirmed(true)
    mcqAnswers.current.push({ type: 'reading', questionId: rq.id, selected, correct: rq.correct, correct_bool: isCorrect })
    if (isCorrect) setXp(prev => prev + rq.xp)
    setTimeout(() => {
      setFlash(null)
      if (qIdx + 1 < READING_QUESTIONS.length) {
        setQIdx(i => i + 1)
      } else {
        setQIdx(0); setSection('writing')
      }
    }, 1000)
  }

  // ── WRITING ────────────────────────────────────────────────
  const wq = WRITING_QUESTIONS[qIdx] ?? null

  function submitWriting() {
    if (!wq || writingText.trim().length < 5) return
    writingAnswers.current.push({ questionId: wq.id, text: writingText.trim() })
    setXp(prev => prev + wq.xp)
    setWritingText('')
    if (qIdx + 1 < WRITING_QUESTIONS.length) {
      setQIdx(i => i + 1)
    } else {
      setSection('calculating'); runEvaluation()
    }
  }

  async function runEvaluation() {
    try {
      const res = await fetch('/api/level-scan/evaluate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mcqAnswers: mcqAnswers.current,
          speakingAnswers: speakingAnswers.current,
          writingAnswers: writingAnswers.current,
        }),
      })
      const data = await res.json()
      playSound('levelup')
      onComplete(data.result)
    } catch {
      onComplete({
        cefr: 'B1', levelName: 'CONNECTOR', overallScore: 60,
        listeningScore: 65, speakingScore: 55, readingScore: 65, writingScore: 55,
        verdict: 'Good effort. Keep practising with real simulations.',
        strengths: ['Completed all sections', 'Showed initiative', 'Attempted speaking'],
        improvements: ['Expand vocabulary', 'Practice listening daily', 'Focus on grammar'],
        studyPlan: '1. Listen to English podcasts 15 min/day. 2. Use Field Sim for real practice. 3. Write one short paragraph daily.',
      })
    }
  }

  const timerColor = timeLeft > 30 ? P : timeLeft > 10 ? '#f59e0b' : '#f87171'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', animation: 'fadeIn 0.3s ease' }}>

      {/* Header + XP bar */}
      <div style={{ padding: '12px 16px 10px', background: 'rgba(15,15,20,0.98)', borderBottom: '1px solid ' + PB, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: P, letterSpacing: 2 }}>SKILL CHECK</span>
            <span style={{ fontSize: 9, color: '#3a3a5a', letterSpacing: 1 }}>
              {section === 'intro' ? '' : section === 'listening' ? `LISTENING ${qIdx + 1}/${LISTENING_QUESTIONS.length}` : section === 'speaking' ? `SPEAKING ${qIdx + 1}/${SPEAKING_QUESTIONS.length}` : section === 'reading' ? `READING ${qIdx + 1}/${READING_QUESTIONS.length}` : section === 'writing' ? `WRITING ${qIdx + 1}/${WRITING_QUESTIONS.length}` : 'ANALYSING'}
            </span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: G }}>{xp} XP</span>
        </div>
        <div style={{ height: 4, background: 'rgba(129,140,248,0.1)', borderRadius: 2 }}>
          <div style={{ height: 4, borderRadius: 2, width: `${xpPct}%`, background: `linear-gradient(90deg,${P},${G})`, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: `fadeUp 0.3s ease`, position: 'relative' }}>

        {/* Flash overlay */}
        {flash && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', animation: `${flash === 'correct' ? 'correctFlash' : 'wrongFlash'} 0.6s ease` }} />
        )}

        {/* ── INTRO ── */}
        {section === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 24px', gap: 20, overflowY: 'auto' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#e8edf2', letterSpacing: 2, marginBottom: 8 }}>SKILL CHECK</h1>
              <p style={{ fontSize: 13, color: P, fontStyle: 'italic' }}>"Find your true English level."</p>
            </div>
            <div style={{ background: PBG, border: '1px solid ' + PB, borderRadius: 14, padding: '16px', width: '100%' }}>
              <div style={{ fontSize: 10, color: P, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>YOUR MISSION</div>
              {[
                ['🎧', `${LISTENING_QUESTIONS.length} Listening`, 'Hear real English, answer MCQ'],
                ['🎙', `${SPEAKING_QUESTIONS.length} Speaking`, 'Record your answers in English'],
                ['📖', `${READING_QUESTIONS.length} Reading`, 'Read passages, test comprehension'],
                ['✍️', `${WRITING_QUESTIONS.length} Writing`, 'Write short professional responses'],
              ].map(([icon, label, desc]) => (
                <div key={label as string} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#e8edf2' }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#4a4a7a' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ width: '100%', background: PBG, border: '1px solid ' + PB, borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: P, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>CEFR LEVELS</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.entries(CEFR_LEVELS).map(([code, lvl]) => (
                  <div key={code} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '5px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: lvl.color }}>{code}</div>
                    <div style={{ fontSize: 9, color: '#3a3a5a' }}>{lvl.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => { playSound('click'); setSection('listening') }}
              style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${P},#6366f1)`, color: '#fff', fontSize: 14, fontWeight: 900, cursor: 'pointer', letterSpacing: 2, boxShadow: `0 0 28px rgba(129,140,248,0.35)` }}>
              BEGIN SCAN
            </button>
          </div>
        )}

        {/* ── LISTENING ── */}
        {section === 'listening' && lq && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', gap: 14, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: PBG, border: '1px solid ' + PB, borderRadius: 12, padding: '12px 14px' }}>
              <span style={{ fontSize: 20 }}>🎧</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: P, fontWeight: 700, letterSpacing: 1, marginBottom: 3 }}>LISTENING</div>
                <div style={{ fontSize: 11, color: '#4a4a7a' }}>
                  {audioPlaying ? '🔊 Audio playing…' : audioReady ? '✓ Audio played — now answer' : 'Loading audio…'}
                </div>
              </div>
              <button onClick={() => { setAudioReady(false); playListeningAudio() }}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid ' + PB, background: 'transparent', color: P, fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>
                {audioPlaying ? '…' : '↺ Replay'}
              </button>
            </div>
            <div style={{ background: PBG, border: '1px solid ' + PB, borderRadius: 12, padding: '14px' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#e8edf2', lineHeight: 1.6, margin: 0 }}>{lq.question}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lq.options.map((opt, i) => {
                let bg = 'rgba(15,15,20,0.8)', border = 'rgba(255,255,255,0.08)', color = '#8a8aaa'
                if (selected === i && !confirmed) { bg = PBG; border = P; color = '#e8edf2' }
                if (confirmed) {
                  if (i === lq.correct) { bg = 'rgba(0,220,130,0.1)'; border = G; color = G }
                  else if (i === selected && selected !== lq.correct) { bg = 'rgba(248,113,113,0.1)'; border = '#f87171'; color = '#f87171' }
                }
                return (
                  <button key={i} onClick={() => { if (!confirmed) { setSelected(i); playSound('click') } }}
                    style={{ padding: '13px 16px', borderRadius: 12, border: `1px solid ${border}`, background: bg, color, fontSize: 13, cursor: confirmed ? 'default' : 'pointer', textAlign: 'left', fontWeight: selected === i ? 700 : 400, transition: 'all 0.15s' }}>
                    <span style={{ fontWeight: 800, marginRight: 8 }}>{['A','B','C','D'][i]}.</span>{opt}
                  </button>
                )
              })}
            </div>
            {!confirmed && (
              <button onClick={confirmListening} disabled={selected === null}
                style={{ padding: '14px', borderRadius: 12, border: 'none', background: selected !== null ? `linear-gradient(135deg,${P},#6366f1)` : 'rgba(129,140,248,0.1)', color: selected !== null ? '#fff' : '#3a3a5a', fontSize: 13, fontWeight: 800, cursor: selected !== null ? 'pointer' : 'default', letterSpacing: 1, marginTop: 4 }}>
                CONFIRM ANSWER · +{lq.xp} XP
              </button>
            )}
          </div>
        )}

        {/* ── SPEAKING ── */}
        {section === 'speaking' && sq && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Camera */}
            <div style={{ flex: 1, position: 'relative', background: '#06060a', overflow: 'hidden' }}>
              <video ref={videoRef} autoPlay muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: cameraReady ? 'block' : 'none' }} />
              {!cameraReady && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, border: `2px solid ${P}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ fontSize: 12, color: '#4a4a7a' }}>Opening camera…</span>
                </div>
              )}
              {recording && (
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.7)', borderRadius: 20, padding: '4px 10px' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f87171', display: 'inline-block', animation: 'pulse 0.8s ease-in-out infinite' }} />
                  <span style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700 }}>REC</span>
                </div>
              )}
              {recording && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.7)', borderRadius: 20, padding: '4px 12px' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: timerColor }}>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
                </div>
              )}
            </div>
            {/* Bottom */}
            <div style={{ background: 'rgba(15,15,20,0.98)', borderTop: '1px solid ' + PB, padding: '14px 16px', flexShrink: 0 }}>
              <div style={{ fontSize: 9, color: P, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>SPEAKING {qIdx + 1}/{SPEAKING_QUESTIONS.length}</div>
              <p style={{ fontSize: 13, color: '#c8cedc', lineHeight: 1.65, marginBottom: 10 }}>{sq.prompt}</p>
              <p style={{ fontSize: 11, color: '#3a3a5a', marginBottom: 10, fontStyle: 'italic' }}>Hint: {sq.hint}</p>
              {recording && liveTranscript && (
                <div style={{ background: PBG, border: '1px solid ' + PB, borderRadius: 8, padding: '7px 10px', marginBottom: 10 }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#5a5a8a', fontStyle: 'italic' }}>"{liveTranscript}"</p>
                </div>
              )}
              {!recording && (
                <button onClick={() => { playSound('click'); startSpeakingRecord() }}
                  style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${P},#6366f1)`, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171', flexShrink: 0 }} />
                  RECORD ANSWER · +{sq.xp} XP
                </button>
              )}
              {recording && (
                <button onClick={submitSpeaking}
                  style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#5a5a7a,#3a3a5a)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>
                  ✓ SUBMIT ANSWER
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── READING ── */}
        {section === 'reading' && rq && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', gap: 14, overflowY: 'auto' }}>
            <div style={{ fontSize: 9, color: P, fontWeight: 700, letterSpacing: 2 }}>📖 READING {qIdx + 1}/{READING_QUESTIONS.length}</div>
            <div style={{ background: PBG, border: '1px solid ' + PB, borderRadius: 12, padding: '14px' }}>
              <p style={{ fontSize: 12, color: '#8a8aaa', lineHeight: 1.8, margin: 0 }}>{rq.passage}</p>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#e8edf2', lineHeight: 1.6, margin: 0 }}>{rq.question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rq.options.map((opt, i) => {
                let bg = 'rgba(15,15,20,0.8)', border = 'rgba(255,255,255,0.08)', color = '#8a8aaa'
                if (selected === i && !confirmed) { bg = PBG; border = P; color = '#e8edf2' }
                if (confirmed) {
                  if (i === rq.correct) { bg = 'rgba(0,220,130,0.1)'; border = G; color = G }
                  else if (i === selected && selected !== rq.correct) { bg = 'rgba(248,113,113,0.1)'; border = '#f87171'; color = '#f87171' }
                }
                return (
                  <button key={i} onClick={() => { if (!confirmed) { setSelected(i); playSound('click') } }}
                    style={{ padding: '13px 16px', borderRadius: 12, border: `1px solid ${border}`, background: bg, color, fontSize: 13, cursor: confirmed ? 'default' : 'pointer', textAlign: 'left', fontWeight: selected === i ? 700 : 400, transition: 'all 0.15s' }}>
                    <span style={{ fontWeight: 800, marginRight: 8 }}>{['A','B','C','D'][i]}.</span>{opt}
                  </button>
                )
              })}
            </div>
            {!confirmed && (
              <button onClick={confirmReading} disabled={selected === null}
                style={{ padding: '14px', borderRadius: 12, border: 'none', background: selected !== null ? `linear-gradient(135deg,${P},#6366f1)` : 'rgba(129,140,248,0.1)', color: selected !== null ? '#fff' : '#3a3a5a', fontSize: 13, fontWeight: 800, cursor: selected !== null ? 'pointer' : 'default', letterSpacing: 1, marginTop: 4 }}>
                CONFIRM · +{rq.xp} XP
              </button>
            )}
          </div>
        )}

        {/* ── WRITING ── */}
        {section === 'writing' && wq && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', gap: 14, overflowY: 'auto' }}>
            <div style={{ fontSize: 9, color: P, fontWeight: 700, letterSpacing: 2 }}>✍️ WRITING {qIdx + 1}/{WRITING_QUESTIONS.length}</div>
            <div style={{ background: PBG, border: '1px solid ' + PB, borderRadius: 12, padding: '14px' }}>
              <p style={{ fontSize: 13, color: '#c8cedc', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{wq.prompt}</p>
            </div>
            <textarea
              value={writingText} onChange={e => setWritingText(e.target.value)}
              placeholder={wq.placeholder}
              rows={5}
              style={{ background: 'rgba(15,15,20,0.9)', border: '1px solid ' + PB, borderRadius: 12, padding: '14px', fontSize: 13, color: '#e8edf2', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6, outline: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#3a3a5a' }}>{writingText.trim().split(/\s+/).filter(Boolean).length} words</span>
              <button onClick={submitWriting} disabled={writingText.trim().length < 5}
                style={{ padding: '13px 24px', borderRadius: 12, border: 'none', background: writingText.trim().length >= 5 ? `linear-gradient(135deg,${P},#6366f1)` : 'rgba(129,140,248,0.1)', color: writingText.trim().length >= 5 ? '#fff' : '#3a3a5a', fontSize: 13, fontWeight: 800, cursor: writingText.trim().length >= 5 ? 'pointer' : 'default', letterSpacing: 1 }}>
                SUBMIT · +{wq.xp} XP
              </button>
            </div>
          </div>
        )}

        {/* ── CALCULATING ── */}
        {section === 'calculating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 32 }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <div style={{ width: 80, height: 80, border: `3px solid ${P}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <div style={{ position: 'absolute', inset: 10, border: `2px solid ${G}`, borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite reverse' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#e8edf2', marginBottom: 6 }}>Scanning your level…</p>
              <p style={{ fontSize: 11, color: '#4a4a7a' }}>AI is evaluating all your answers</p>
            </div>
            <div style={{ background: PBG, border: '1px solid ' + PB, borderRadius: 12, padding: '14px 20px', textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: 11, color: P, fontWeight: 700, marginBottom: 6 }}>TOTAL XP EARNED</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: G }}>{xp}</div>
              <div style={{ fontSize: 10, color: '#3a3a5a' }}>out of {TOTAL_XP} possible</div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
