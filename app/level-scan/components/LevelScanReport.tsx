'use client'

import { useEffect, useState } from 'react'
import { CEFR_LEVELS, type ScanResult } from '@/lib/level-scan/data'
import { useRouter } from 'next/navigation'

const P  = '#818cf8'
const PB = 'rgba(129,140,248,0.22)'
const PBG = 'rgba(129,140,248,0.07)'
const G  = '#00dc82'

function playLevelUp() {
  try {
    const ctx = new AudioContext()
    const notes = [523, 659, 784, 1047, 1319]
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination); o.type = 'sine'; o.frequency.value = freq
      const t = ctx.currentTime + i * 0.12
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.14, t + 0.04)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      o.start(t); o.stop(t + 0.4)
    })
  } catch {}
}

interface Props { result: ScanResult; onRestart: () => void }

export default function LevelScanReport({ result, onRestart }: Props) {
  const router = useRouter()
  const [revealed, setRevealed] = useState(false)
  const lvl = CEFR_LEVELS[result.cefr as keyof typeof CEFR_LEVELS]

  useEffect(() => {
    const t = setTimeout(() => { setRevealed(true); playLevelUp() }, 400)
    return () => clearTimeout(t)
  }, [])

  const scoreColor = (s: number) => s >= 75 ? G : s >= 50 ? '#f59e0b' : '#f87171'

  const sections = [
    { label: 'Listening', score: result.listeningScore, icon: '🎧' },
    { label: 'Speaking',  score: result.speakingScore,  icon: '🎙' },
    { label: 'Reading',   score: result.readingScore,   icon: '📖' },
    { label: 'Writing',   score: result.writingScore,   icon: '✍️' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Level reveal hero */}
      <div style={{
        padding: '32px 24px 24px', textAlign: 'center', flexShrink: 0,
        background: `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(15,15,20,0.98) 100%)`,
        borderBottom: '1px solid ' + PB, position: 'relative', overflow: 'hidden',
      }}>
        {/* Scan line animation */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${lvl?.color ?? P},transparent)`, animation: 'scanLine 3s linear infinite', pointerEvents: 'none' }} />

        <div style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: lvl?.color ?? P, letterSpacing: 4, lineHeight: 1, textShadow: `0 0 40px ${lvl?.color ?? P}80` }}>
            {result.cefr}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: lvl?.color ?? P, letterSpacing: 4, marginTop: 6 }}>
            {result.levelName}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#e8edf2' }}>{result.overallScore}</div>
            <div style={{ fontSize: 9, color: '#4a4a7a', letterSpacing: 1 }}>OVERALL SCORE</div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: '#6a6a8a', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>"{lvl?.desc}"</p>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Section scores */}
        <div style={{ background: PBG, border: '1px solid ' + PB, borderRadius: 14, padding: '14px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: P, letterSpacing: 2, marginBottom: 12 }}>SECTION SCORES</div>
          {sections.map(({ label, score, icon }) => (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#a8a8c8' }}>{icon} {label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(score) }}>{score}/100</span>
              </div>
              <div style={{ height: 5, background: 'rgba(129,140,248,0.1)', borderRadius: 3 }}>
                <div style={{ height: 5, borderRadius: 3, width: `${score}%`, background: `linear-gradient(90deg,${scoreColor(score)},${scoreColor(score)}99)`, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <div style={{ background: PBG, border: '1px solid ' + PB, borderRadius: 12, padding: '14px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: P, letterSpacing: 2, marginBottom: 8 }}>ASSESSMENT</div>
          <p style={{ fontSize: 13, color: '#a8a8c8', lineHeight: 1.7, margin: 0 }}>{result.verdict}</p>
        </div>

        {/* Strengths */}
        <div style={{ background: 'rgba(0,220,130,0.05)', border: '1px solid rgba(0,220,130,0.2)', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 8 }}>STRENGTHS</div>
          {result.strengths.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
              <span style={{ color: G }}>✓</span>
              <span style={{ fontSize: 12, color: '#a8c8b8', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Improvements */}
        <div style={{ background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.2)', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#fb923c', letterSpacing: 2, marginBottom: 8 }}>IMPROVEMENTS</div>
          {result.improvements.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
              <span style={{ color: '#fb923c' }}>→</span>
              <span style={{ fontSize: 12, color: '#c8a878', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Study plan */}
        <div style={{ background: PBG, border: '1px solid ' + PB, borderRadius: 12, padding: '14px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: P, letterSpacing: 2, marginBottom: 8 }}>YOUR STUDY PLAN</div>
          <p style={{ fontSize: 12, color: '#8a8aaa', lineHeight: 1.7, margin: 0 }}>{result.studyPlan}</p>
        </div>

        {/* CTA buttons */}
        <button onClick={() => router.push('/shift')}
          style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,#00dc82,#059669)`, color: '#09090b', fontSize: 13, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>
          ⚔️ PRACTICE IN FIELD SIM
        </button>

        <button onClick={onRestart}
          style={{ width: '100%', padding: '13px', borderRadius: 12, border: '1px solid ' + PB, background: 'transparent', color: '#4a4a7a', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          ↺ Retake Skill Check
        </button>

        <button onClick={() => router.push('/')}
          style={{ width: '100%', padding: '10px', borderRadius: 12, border: 'none', background: 'transparent', color: '#3a3a5a', fontSize: 12, cursor: 'pointer' }}>
          ← Back to ON DUTY
        </button>
      </div>
    </div>
  )
}
