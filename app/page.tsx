'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

type Burst = { id: number; x: number; y: number }

const STAR_COLORS = ['#3b9eff', '#f59e0b', '#22c55e', '#fff', '#a78bfa', '#fb7185']
const BURST_COUNT = 10

function playChime(type: 'shift' | 'chat') {
  try {
    const ctx = new AudioContext()
    const freq1 = type === 'shift' ? 880 : 660
    const freq2 = type === 'shift' ? 1100 : 880
    ;[freq1, freq2].forEach((f, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08)
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.08 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.25)
      osc.start(ctx.currentTime + i * 0.08)
      osc.stop(ctx.currentTime + i * 0.08 + 0.25)
    })
  } catch {}
}

export default function Home() {
  const router = useRouter()
  const [bursts, setBursts] = useState<Burst[]>([])

  const triggerBurst = useCallback((e: React.MouseEvent, type: 'shift' | 'chat') => {
    playChime(type)
    const id = Date.now() + Math.random()
    setBursts(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 750)
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes twinkle { 0%,100% { opacity:0.15; } 50% { opacity:0.7; } }
        @keyframes floatUp { 0% { transform:translateY(0) scale(1); opacity:0.6; } 100% { transform:translateY(-100vh) scale(0.5); opacity:0; } }
        @keyframes badgePulse { 0%,100% { box-shadow:0 0 8px rgba(245,158,11,0.5); } 50% { box-shadow:0 0 22px rgba(245,158,11,0.9),0 0 44px rgba(245,158,11,0.4); } }
        @keyframes starWave { 0%,100% { transform:scale(1); opacity:0.7; } 50% { transform:scale(1.4); opacity:1; } }
        @keyframes sparkOut {
          0%   { transform:translate(0,0) scale(1.4); opacity:1; }
          100% { transform:translate(var(--tx),var(--ty)) scale(0); opacity:0; }
        }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; }
      `}</style>

      {/* Burst particles */}
      {bursts.map(b => (
        <div key={b.id} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999 }}>
          {Array.from({ length: BURST_COUNT }, (_, i) => {
            const angle = (i / BURST_COUNT) * 360
            const rad = (angle * Math.PI) / 180
            const dist = 36 + Math.random() * 28
            const tx = Math.cos(rad) * dist
            const ty = Math.sin(rad) * dist
            const color = STAR_COLORS[i % STAR_COLORS.length]
            const size = 4 + Math.random() * 4
            return (
              <div key={i} style={{
                position: 'absolute',
                left: b.x - size / 2,
                top: b.y - size / 2,
                width: size,
                height: size,
                borderRadius: i % 3 === 0 ? '0' : '50%',
                background: color,
                boxShadow: `0 0 6px ${color}`,
                ...({ '--tx': `${tx}px`, '--ty': `${ty}px` } as React.CSSProperties),
                animation: `sparkOut 0.7s ease-out forwards`,
                animationDelay: `${i * 0.015}s`,
              } as React.CSSProperties} />
            )
          })}
        </div>
      ))}

      <div style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse at 20% 50%, #071428 0%, #020810 50%, #040c18 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background stars */}
        {Array.from({ length: 55 }, (_, i) => {
          const x = (i * 17.3) % 100
          const y = (i * 23.7) % 100
          const size = (i % 3) + 1
          const dur = 2 + (i % 4)
          const floatDur = 18 + (i % 12)
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: i % 5 === 0 ? '#f59e0b' : i % 4 === 0 ? '#3b9eff' : '#fff',
              pointerEvents: 'none',
              animation: `twinkle ${dur}s ease-in-out infinite, floatUp ${floatDur}s linear infinite`,
              animationDelay: `${(i * 0.37) % floatDur}s, ${(i * 0.37) % floatDur}s`,
            }} />
          )
        })}

        <div style={{
          width: '100%', maxWidth: 400,
          display: 'flex', flexDirection: 'column', gap: 26,
          animation: 'fadeIn 0.6s ease',
          position: 'relative', zIndex: 1,
        }}>

          {/* Logo */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 54, marginBottom: 10, filter: 'drop-shadow(0 0 24px rgba(59,158,255,0.5))' }}>🍽️</div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: 3, textShadow: '0 0 30px rgba(59,158,255,0.3)' }}>Career Analytics</h1>
            <p style={{ fontSize: 11, color: '#3b9eff', fontWeight: 700, letterSpacing: 4, marginTop: 6, textTransform: 'uppercase' }}>Hospitality Training · AI</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
              {[0,1,2,3,4].map(i => (
                <span key={i} style={{
                  fontSize: 16,
                  color: '#f59e0b',
                  filter: 'drop-shadow(0 0 6px #f59e0b)',
                  animation: `starWave 1.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.18}s`,
                  display: 'inline-block',
                }}>★</span>
              ))}
            </div>
          </div>

          {/* SHIFT — PRO */}
          <button
            onClick={e => { triggerBurst(e, 'shift'); setTimeout(() => router.push('/shift'), 220) }}
            style={{
              width: '100%', padding: '26px 22px', borderRadius: 22,
              background: 'linear-gradient(135deg,#061c35 0%,#0b3060 100%)',
              border: '1px solid rgba(59,158,255,0.55)',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 0 50px rgba(59,158,255,0.14), inset 0 1px 0 rgba(255,255,255,0.06)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const b = e.currentTarget
              b.style.transform = 'scale(1.025)'
              b.style.boxShadow = '0 0 65px rgba(59,158,255,0.28), inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
            onMouseLeave={e => {
              const b = e.currentTarget
              b.style.transform = 'scale(1)'
              b.style.boxShadow = '0 0 50px rgba(59,158,255,0.14), inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          >
            {/* PRO badge */}
            <div style={{
              position: 'absolute', top: 13, right: 13,
              background: 'linear-gradient(135deg,#f59e0b,#b45309)',
              borderRadius: 8, padding: '4px 13px',
              fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: 2,
              animation: 'badgePulse 2s ease-in-out infinite',
            }}>PRO</div>
            {/* Top shimmer */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(59,158,255,0.6),transparent)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 36, filter: 'drop-shadow(0 0 10px rgba(59,158,255,0.6))' }}>⚡</div>
              <div>
                <div style={{ fontSize: 21, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>SHIFT Simulator</div>
                <div style={{ fontSize: 11, color: '#3b9eff', fontWeight: 700, letterSpacing: 3, marginTop: 2 }}>FORBES 5-STAR EXPERIENCE</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#7aa8cc', lineHeight: 1.65, marginBottom: 14 }}>
              18 cenas de um turno real. Fale com os guests, responda ao Inspector, receba avaliação Forbes + relatório Rick Tutor.
            </p>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {['18 Cenas', '45s Timer', 'Voz IA', 'PDF Report', 'Rick Tutor'].map(tag => (
                <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: '#3b9eff', background: 'rgba(59,158,255,0.1)', border: '1px solid rgba(59,158,255,0.3)', borderRadius: 10, padding: '3px 9px' }}>{tag}</span>
              ))}
            </div>
          </button>

          {/* Training Chat */}
          <button
            onClick={e => { triggerBurst(e, 'chat'); setTimeout(() => router.push('/training'), 220) }}
            style={{
              width: '100%', padding: '26px 22px', borderRadius: 22,
              background: 'linear-gradient(135deg,#06180d 0%,#0c2d17 100%)',
              border: '1px solid rgba(34,197,94,0.45)',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 0 40px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const b = e.currentTarget
              b.style.transform = 'scale(1.025)'
              b.style.boxShadow = '0 0 55px rgba(34,197,94,0.22), inset 0 1px 0 rgba(255,255,255,0.04)'
            }}
            onMouseLeave={e => {
              const b = e.currentTarget
              b.style.transform = 'scale(1)'
              b.style.boxShadow = '0 0 40px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.04)'
            }}
          >
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(34,197,94,0.5),transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 36, filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.5))' }}>💬</div>
              <div>
                <div style={{ fontSize: 21, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>Training Chat</div>
                <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, letterSpacing: 3, marginTop: 2 }}>LUXURY WAITER AI</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#7aa8cc', lineHeight: 1.65, marginBottom: 14 }}>
              Converse com um guest AI em tempo real. Pratique respostas, receba feedback por turno e melhore seu inglês de hospitalidade.
            </p>
            <div style={{ display: 'flex', gap: 7 }}>
              {['Chat IA', 'Feedback', 'Pontuação', 'Medalhas'].map(tag => (
                <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '3px 9px' }}>{tag}</span>
              ))}
            </div>
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#1c3550' }}>Career Analytics AI · Hospitality Edition</p>
        </div>
      </div>
    </>
  )
}
