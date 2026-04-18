'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

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
  <svg width="36" height="40" viewBox="-6 -6 64 70" fill="none" overflow="visible">
    <defs>
      <filter id="sglow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M26 3L49 12V28C49 42 38 52 26 56C14 52 3 42 3 28V12L26 3Z"
      fill="rgba(0,220,130,0.1)" stroke="#00dc82" strokeWidth="1.5" filter="url(#sglow)"/>
    <line x1="26" y1="12" x2="26" y2="44" stroke="#00dc82" strokeWidth="1" opacity="0.5"/>
    <line x1="10" y1="28" x2="42" y2="28" stroke="#00dc82" strokeWidth="1" opacity="0.5"/>
    <circle cx="26" cy="28" r="5" fill="none" stroke="#00dc82" strokeWidth="1.5"/>
    <circle cx="26" cy="28" r="2.5" fill="#00dc82"/>
  </svg>
)

const MODULES = [
  {
    id: 'shift',
    label: 'FIELD SIM',
    name: 'Field Scenarios',
    desc: 'Real workplace simulations with Rick',
    icon: '⚔️',
    color: '#00dc82',
    border: 'rgba(0,220,130,0.3)',
    glow: 'rgba(0,220,130,0.15)',
    href: '/shift',
    badge: null,
    freq: 660,
  },
  {
    id: 'level-scan',
    label: 'SKILL CHECK',
    name: 'Level Scan',
    desc: 'Gamified CEFR: find your rank',
    icon: '🎯',
    color: '#818cf8',
    border: 'rgba(129,140,248,0.3)',
    glow: 'rgba(129,140,248,0.15)',
    href: '/level-scan',
    badge: 'NEW',
    freq: 880,
  },
  {
    id: 'interview',
    label: 'INTERVIEW SIM',
    name: 'Interview Sim',
    desc: 'Video answers + full HR report',
    icon: '💼',
    color: '#38bdf8',
    border: 'rgba(56,189,248,0.3)',
    glow: 'rgba(56,189,248,0.15)',
    href: '/interview',
    badge: null,
    freq: 770,
  },
  {
    id: 'training',
    label: 'TRAINING',
    name: 'AI Coach',
    desc: 'Chat coaching with Rick',
    icon: '📚',
    color: '#fb923c',
    border: 'rgba(251,146,60,0.3)',
    glow: 'rgba(251,146,60,0.15)',
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

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 80)
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes sparkFly { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)} }
        @keyframes pulse { 0%,100%{opacity:0.5}50%{opacity:1} }
        @keyframes cardGlow { 0%,100%{opacity:0} 50%{opacity:1} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#1a2a1a; border-radius:3px; }
      `}</style>

      <div style={{
        minHeight: '100dvh', background: BG,
        fontFamily: 'var(--font-geist-sans,Arial,sans-serif)',
        opacity: booted ? 1 : 0, transition: 'opacity 0.3s ease',
      }}>
        <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', padding: '0 0 32px', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div style={{ padding: '40px 20px 8px', animation: 'fadeUp 0.4s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <ShieldLogo />
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 900, color: '#e8edf2', letterSpacing: 5, margin: 0, lineHeight: 1 }}>
                  ON DUTY
                </h1>
                <p style={{ fontSize: 10, color: '#00dc82', letterSpacing: 3, marginTop: 3, fontWeight: 700 }}>
                  REAL ENGLISH · REAL SIMULATIONS
                </p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#3a5a45', fontStyle: 'italic', marginLeft: 48 }}>
              "Get fit for duty."
            </p>
          </div>

          {/* Online pill */}
          <div style={{ padding: '16px 20px 20px', animation: 'fadeUp 0.4s 0.08s ease both', opacity: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,220,130,0.07)', border: '1px solid rgba(0,220,130,0.18)', borderRadius: 20, padding: '5px 14px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00dc82', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
              <span style={{ fontSize: 9, color: '#00dc82', fontWeight: 700, letterSpacing: 2 }}>4 MODULES ACTIVE</span>
            </div>
          </div>

          {/* Netflix 2×2 grid */}
          <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {MODULES.map((mod, i) => (
              <div
                key={mod.id}
                onClick={e => handleNav(e, mod)}
                onMouseEnter={() => { setActiveCard(mod.id); playClick(mod.freq + 180) }}
                onMouseLeave={() => setActiveCard(null)}
                style={{
                  position: 'relative', overflow: 'hidden',
                  height: 188, borderRadius: 16, cursor: 'pointer',
                  background: activeCard === mod.id
                    ? `linear-gradient(160deg, ${mod.glow} 0%, #0f0f14 55%, #0a0a0c 100%)`
                    : `linear-gradient(160deg, rgba(255,255,255,0.03) 0%, #0e0e12 60%, #09090b 100%)`,
                  border: `1px solid ${activeCard === mod.id ? mod.border : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.2s ease',
                  transform: activeCard === mod.id ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: activeCard === mod.id ? `0 8px 28px ${mod.glow}` : 'none',
                  animation: `fadeUp 0.4s ${i * 0.07 + 0.15}s ease both`, opacity: 0,
                }}
              >
                {/* Top color bar */}
                <div style={{ height: 3, background: mod.color, opacity: activeCard === mod.id ? 1 : 0.5, transition: 'opacity 0.2s' }} />

                <div style={{ padding: '12px 12px 14px', height: 'calc(100% - 3px)', display: 'flex', flexDirection: 'column' }}>
                  {/* Label row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 'auto' }}>
                    <span style={{ fontSize: 8, fontWeight: 800, color: mod.color, letterSpacing: 2 }}>{mod.label}</span>
                    {mod.badge && (
                      <span style={{ fontSize: 7, fontWeight: 800, color: mod.color, background: `${mod.glow}`, border: `1px solid ${mod.border}`, borderRadius: 3, padding: '1px 5px', letterSpacing: 1 }}>{mod.badge}</span>
                    )}
                  </div>

                  {/* Big icon */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42 }}>
                    {mod.icon}
                  </div>

                  {/* Bottom text */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#e8edf2', marginBottom: 3, letterSpacing: 0.3 }}>{mod.name}</div>
                    <div style={{ fontSize: 10, color: '#4a5a52', lineHeight: 1.4 }}>{mod.desc}</div>
                  </div>
                </div>

                {/* Spark particles */}
                {sparks.map(s => (
                  <div key={s.id} style={{
                    position: 'absolute', left: s.x, top: s.y,
                    width: 5, height: 5, borderRadius: '50%', background: s.color,
                    pointerEvents: 'none',
                    // @ts-expect-error CSS vars
                    '--dx': `${Math.cos(s.angle * Math.PI / 180) * 38}px`,
                    '--dy': `${Math.sin(s.angle * Math.PI / 180) * 38}px`,
                    animation: 'sparkFly 0.5s ease-out forwards',
                  }} />
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: '24px 20px 0', textAlign: 'center', animation: 'fadeUp 0.4s 0.5s ease both', opacity: 0 }}>
            <p style={{ fontSize: 10, color: '#1e2e1e', letterSpacing: 1 }}>
              Hold text to translate · AI powered · ON DUTY v2.0
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
