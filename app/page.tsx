'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

const G  = '#00dc82'
const GB = 'rgba(0,220,130,0.18)'
const BG = '#09090b'

type Spark = { id: number; x: number; y: number; color: string; angle: number }

function playClick(freq = 660) {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination); o.type = 'sine'; o.frequency.value = freq
    g.gain.setValueAtTime(0, ctx.currentTime)
    g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
    o.start(); o.stop(ctx.currentTime + 0.22)
  } catch {}
}

const ShieldLogo = () => (
  <svg width="52" height="58" viewBox="0 0 52 58" fill="none">
    <defs>
      <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <path d="M26 3L49 12V28C49 42 38 52 26 56C14 52 3 42 3 28V12L26 3Z"
      fill="rgba(0,220,130,0.07)" stroke="#00dc82" strokeWidth="1.5" filter="url(#glow)"/>
    <line x1="26" y1="12" x2="26" y2="44" stroke="#00dc82" strokeWidth="1" opacity="0.5"/>
    <line x1="10" y1="28" x2="42" y2="28" stroke="#00dc82" strokeWidth="1" opacity="0.5"/>
    <circle cx="26" cy="28" r="5" fill="none" stroke="#00dc82" strokeWidth="1.5"/>
    <circle cx="26" cy="28" r="2" fill="#00dc82"/>
  </svg>
)

const MODULES = [
  {
    id: 'shift',
    label: 'FIELD SIM',
    name: 'Field Scenarios',
    desc: 'Real workplace simulations with Rick — hospitality, service, guest handling.',
    icon: '⚔️',
    color: '#00dc82',
    border: 'rgba(0,220,130,0.25)',
    bg: 'rgba(0,220,130,0.05)',
    href: '/shift',
    badge: null,
    freq: 660,
  },
  {
    id: 'level-scan',
    label: 'SKILL CHECK',
    name: 'Level Scan',
    desc: 'Gamified CEFR assessment — Listening, Speaking, Reading & Writing. Find your rank.',
    icon: '🎯',
    color: '#818cf8',
    border: 'rgba(129,140,248,0.25)',
    bg: 'rgba(129,140,248,0.05)',
    href: '/level-scan',
    badge: 'NEW',
    freq: 880,
  },
  {
    id: 'interview',
    label: 'INTERVIEW SIM',
    name: 'Interview Simulator',
    desc: 'AI-powered job interview practice — 10 questions, video answers, full HR report.',
    icon: '💼',
    color: '#38bdf8',
    border: 'rgba(56,189,248,0.25)',
    bg: 'rgba(56,189,248,0.05)',
    href: '/interview',
    badge: null,
    freq: 770,
  },
  {
    id: 'training',
    label: 'TRAINING',
    name: 'AI Coach',
    desc: 'One-on-one chat coaching with Rick — vocabulary, grammar, real-life scenarios.',
    icon: '📚',
    color: '#fb923c',
    border: 'rgba(251,146,60,0.25)',
    bg: 'rgba(251,146,60,0.05)',
    href: '/training',
    badge: null,
    freq: 550,
  },
]

export default function LandingPage() {
  const router = useRouter()
  const [sparks, setSparks] = useState<Spark[]>([])
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [booted, setBooted] = useState(false)
  const idRef = useRef(0)
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 100)
    return () => clearTimeout(t)
  }, [])

  function spawnSparks(x: number, y: number, color: string) {
    const arr: Spark[] = Array.from({ length: 8 }, (_, i) => ({
      id: ++idRef.current, x, y, color, angle: (i / 8) * 360,
    }))
    setSparks(prev => [...prev, ...arr])
    setTimeout(() => setSparks(prev => prev.filter(s => !arr.find(a => a.id === s.id))), 600)
  }

  function handleNav(e: React.MouseEvent, mod: typeof MODULES[0]) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    spawnSparks(e.clientX - rect.left, e.clientY - rect.top, mod.color)
    playClick(mod.freq)
    setTimeout(() => router.push(mod.href), 200)
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes sparkFly { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)} }
        @keyframes scanLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(500%)} }
        @keyframes pulse { 0%,100%{opacity:0.6}50%{opacity:1} }
        @keyframes glow { 0%,100%{box-shadow:0 0 10px rgba(0,220,130,0.2)} 50%{box-shadow:0 0 24px rgba(0,220,130,0.5)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#1a2a1a; border-radius:3px; }
      `}</style>

      <div style={{
        minHeight: '100dvh', background: BG, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: 'var(--font-geist-sans,Arial,sans-serif)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(#00dc82 1px, transparent 1px), linear-gradient(90deg, #00dc82 1px, transparent 1px)',
          backgroundSize: '40px 40px', pointerEvents: 'none',
        }} />

        {/* Scan line animation */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(0,220,130,0.15), transparent)',
          animation: 'scanLine 4s linear infinite', pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%', maxWidth: 430, minHeight: '100dvh',
          display: 'flex', flexDirection: 'column', padding: '0 0 32px',
          opacity: booted ? 1 : 0, transition: 'opacity 0.4s ease',
        }}>

          {/* Header */}
          <div style={{
            padding: '48px 24px 32px', textAlign: 'center',
            animation: 'fadeUp 0.5s ease both',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <ShieldLogo />
              <div>
                <h1 style={{ fontSize: 36, fontWeight: 900, color: '#e8edf2', letterSpacing: 6, margin: 0 }}>
                  ON DUTY
                </h1>
                <p style={{ fontSize: 11, color: G, letterSpacing: 3, marginTop: 4, fontWeight: 600 }}>
                  REAL ENGLISH · REAL SIMULATIONS
                </p>
              </div>
              <p style={{ fontSize: 13, color: '#4a6a55', fontStyle: 'italic', margin: 0 }}>
                "Get fit for duty."
              </p>
            </div>
          </div>

          {/* Status bar */}
          <div style={{ padding: '0 24px 24px', animation: 'fadeUp 0.5s 0.1s ease both', opacity: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'rgba(0,220,130,0.06)', border: '1px solid rgba(0,220,130,0.18)',
              borderRadius: 20, padding: '7px 18px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: G, animation: 'pulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
              <span style={{ fontSize: 10, color: G, fontWeight: 700, letterSpacing: 2 }}>SYSTEM ONLINE · 4 MODULES ACTIVE</span>
            </div>
          </div>

          {/* Module cards */}
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {MODULES.map((mod, i) => (
              <div
                key={mod.id}
                onClick={e => handleNav(e, mod)}
                onMouseEnter={() => { setActiveCard(mod.id); playClick(mod.freq + 200) }}
                onMouseLeave={() => setActiveCard(null)}
                style={{
                  position: 'relative', overflow: 'hidden',
                  background: activeCard === mod.id ? mod.bg : 'rgba(15,19,24,0.9)',
                  border: `1px solid ${activeCard === mod.id ? mod.border : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 18, padding: '18px 20px',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  transform: activeCard === mod.id ? 'translateX(4px)' : 'none',
                  animation: `fadeUp 0.4s ${i * 0.08 + 0.2}s ease both`, opacity: 0,
                }}
              >
                {/* Color accent top line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: mod.color, opacity: activeCard === mod.id ? 1 : 0.4, transition: 'opacity 0.2s' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Icon */}
                  <div style={{
                    width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                    background: `${mod.bg}`, border: `1px solid ${mod.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    boxShadow: activeCard === mod.id ? `0 0 16px ${mod.color}40` : 'none',
                    transition: 'box-shadow 0.2s',
                  }}>
                    {mod.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: mod.color, letterSpacing: 2 }}>{mod.label}</span>
                      {mod.badge && (
                        <span style={{ fontSize: 8, fontWeight: 800, color: mod.color, background: `${mod.bg}`, border: `1px solid ${mod.border}`, borderRadius: 4, padding: '1px 6px', letterSpacing: 1 }}>{mod.badge}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#e8edf2', marginBottom: 3 }}>{mod.name}</div>
                    <div style={{ fontSize: 11, color: '#4a5a52', lineHeight: 1.5 }}>{mod.desc}</div>
                  </div>

                  {/* Arrow */}
                  <div style={{ fontSize: 16, color: mod.color, opacity: activeCard === mod.id ? 1 : 0.3, transition: 'opacity 0.2s', flexShrink: 0 }}>→</div>
                </div>

                {/* Spark particles */}
                {sparks.map(s => (
                  <div key={s.id} style={{
                    position: 'absolute', left: s.x, top: s.y,
                    width: 5, height: 5, borderRadius: '50%', background: s.color,
                    pointerEvents: 'none',
                    // @ts-expect-error CSS vars
                    '--dx': `${Math.cos(s.angle * Math.PI / 180) * 40}px`,
                    '--dy': `${Math.sin(s.angle * Math.PI / 180) * 40}px`,
                    animation: 'sparkFly 0.5s ease-out forwards',
                  }} />
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: '28px 24px 0', textAlign: 'center', animation: 'fadeUp 0.4s 0.6s ease both', opacity: 0 }}>
            <p style={{ fontSize: 10, color: '#2a3a2a', letterSpacing: 1 }}>
              Hold any text to translate to Portuguese · AI powered · All simulations in English
            </p>
            <p style={{ fontSize: 9, color: '#1a2a1a', marginTop: 6, letterSpacing: 2 }}>ON DUTY v2.0</p>
          </div>
        </div>
      </div>

      {audioCtxRef.current && null}
    </>
  )
}
