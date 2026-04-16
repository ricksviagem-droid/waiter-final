'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

type Burst = { id: number; x: number; y: number }
const STAR_COLORS = ['#3b9eff', '#f59e0b', '#22c55e', '#fff', '#a78bfa', '#fb7185']
const N = 10

function playChime(type: 'shift' | 'chat') {
  try {
    const ctx = new AudioContext()
    const freqs = type === 'shift' ? [880, 1100] : [660, 880]
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'; osc.frequency.value = f
      const t = ctx.currentTime + i * 0.09
      gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.16, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
      osc.start(t); osc.stop(t + 0.28)
    })
  } catch {}
}

const Logo = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldRing" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fcd34d"/><stop offset="0.5" stopColor="#f59e0b"/><stop offset="1" stopColor="#b45309"/>
      </linearGradient>
      <linearGradient id="bgFill" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#071830"/><stop offset="1" stopColor="#0a2240"/>
      </linearGradient>
    </defs>
    <circle cx="36" cy="36" r="35" fill="url(#bgFill)"/>
    <circle cx="36" cy="36" r="34" stroke="url(#goldRing)" strokeWidth="1.5" fill="none"/>
    <circle cx="36" cy="36" r="28" stroke="url(#goldRing)" strokeWidth="0.5" fill="none" opacity="0.4"/>
    {/* Fork */}
    <line x1="27" y1="17" x2="27" y2="27" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="31" y1="17" x2="31" y2="27" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M27 27 Q27 33 29 34 L29 55" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    <path d="M27 17 Q25 22 25 27 Q25 33 29 34" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <path d="M31 27 Q33 33 29 34" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    {/* Knife */}
    <path d="M43 17 Q47 24 47 33 Q47 36 43 37 L43 55" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
  </svg>
)

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
        @keyframes fadeIn { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        @keyframes twinkle { 0%,100%{opacity:0.1}50%{opacity:0.65} }
        @keyframes floatUp { 0%{transform:translateY(0);opacity:0.5}100%{transform:translateY(-100vh);opacity:0} }
        @keyframes badgePulse { 0%,100%{box-shadow:0 0 8px rgba(245,158,11,0.5)}50%{box-shadow:0 0 24px rgba(245,158,11,0.9),0 0 48px rgba(245,158,11,0.35)} }
        @keyframes starWave { 0%,100%{transform:scale(1) rotate(0deg);opacity:0.7}50%{transform:scale(1.35) rotate(5deg);opacity:1} }
        @keyframes sparkOut { 0%{transform:translate(0,0) scale(1.5);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes rickGlow { 0%,100%{box-shadow:0 0 0 2px rgba(245,158,11,0.4)}50%{box-shadow:0 0 0 4px rgba(245,158,11,0.8),0 0 20px rgba(245,158,11,0.3)} }
        * { box-sizing:border-box;margin:0;padding:0 }
        html,body { height:100% }
      `}</style>

      {/* Particle bursts */}
      {bursts.map(b => (
        <div key={b.id} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999 }}>
          {Array.from({ length: N }, (_, i) => {
            const angle = (i / N) * 360
            const rad = (angle * Math.PI) / 180
            const dist = 38 + Math.random() * 30
            const color = STAR_COLORS[i % STAR_COLORS.length]
            const size = 4 + Math.random() * 4
            return (
              <div key={i} style={{
                position: 'absolute',
                left: b.x - size / 2, top: b.y - size / 2,
                width: size, height: size,
                borderRadius: i % 3 === 0 ? '2px' : '50%',
                background: color,
                boxShadow: `0 0 6px ${color}`,
                ...({ '--tx': `${Math.cos(rad) * dist}px`, '--ty': `${Math.sin(rad) * dist}px` } as React.CSSProperties),
                animation: 'sparkOut 0.7s ease-out forwards',
                animationDelay: `${i * 0.015}s`,
              } as React.CSSProperties} />
            )
          })}
        </div>
      ))}

      <div style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse at 30% 40%, #071830 0%, #020810 55%, #050d1a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
        padding: '24px 20px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Stars */}
        {Array.from({ length: 55 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 17.3) % 100}%`, top: `${(i * 23.7) % 100}%`,
            width: (i % 3) + 1, height: (i % 3) + 1, borderRadius: '50%',
            background: i % 5 === 0 ? '#f59e0b' : i % 4 === 0 ? '#3b9eff' : '#fff',
            pointerEvents: 'none',
            animation: `twinkle ${2 + i % 4}s ease-in-out infinite, floatUp ${18 + i % 12}s linear infinite`,
            animationDelay: `${(i * 0.37) % 18}s`,
          }} />
        ))}

        <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 22, animation: 'fadeIn 0.6s ease', position: 'relative', zIndex: 1 }}>

          {/* ── Logo / Header ── */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ filter: 'drop-shadow(0 0 28px rgba(245,158,11,0.5))' }}>
              <Logo />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: 4, lineHeight: 1, textShadow: '0 0 40px rgba(59,158,255,0.25)' }}>
                CAREER ANALYTICS
              </h1>
              <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.6),transparent)', margin: '8px 0' }} />
              <p style={{ fontSize: 10, color: '#7aa8cc', fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' }}>
                Professional Waiter · English · Hospitality AI
              </p>
              <p style={{ fontSize: 12, color: '#f59e0b', fontWeight: 500, fontStyle: 'italic', marginTop: 6, opacity: 0.85 }}>
                "Speak English. Serve 5 Stars."
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0,1,2,3,4].map(i => (
                <span key={i} style={{ fontSize: 14, color: '#f59e0b', filter: 'drop-shadow(0 0 5px #f59e0b)', animation: 'starWave 1.8s ease-in-out infinite', animationDelay: `${i * 0.18}s`, display: 'inline-block' }}>★</span>
              ))}
            </div>
          </div>

          {/* ── SHIFT PRO ── */}
          <button
            onClick={e => { triggerBurst(e, 'shift'); setTimeout(() => router.push('/shift'), 220) }}
            style={{
              width: '100%', padding: '24px 22px', borderRadius: 20,
              background: 'linear-gradient(145deg,#061c38 0%,#0b3262 60%,#071c38 100%)',
              border: '1px solid rgba(59,158,255,0.45)',
              cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 40px rgba(59,158,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.transform = 'scale(1.025)'; b.style.boxShadow = '0 4px 60px rgba(59,158,255,0.28), inset 0 1px 0 rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.transform = 'scale(1)'; b.style.boxShadow = '0 4px 40px rgba(59,158,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)' }}
          >
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(59,158,255,0.7),transparent)' }} />
            <div style={{ position:'absolute', top:13, right:13, background:'linear-gradient(135deg,#f59e0b,#b45309)', borderRadius:8, padding:'4px 13px', fontSize:10, fontWeight:900, color:'#fff', letterSpacing:2, animation:'badgePulse 2.2s ease-in-out infinite' }}>PRO</div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
              <span style={{ fontSize:34, filter:'drop-shadow(0 0 10px rgba(59,158,255,0.7))' }}>⚡</span>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:'#fff', letterSpacing:1 }}>Career Simulator</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                  <span style={{ fontSize:10, color:'#3b9eff', fontWeight:700, letterSpacing:2 }}>FORBES 5-STAR</span>
                  <span style={{ fontSize:9, background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.4)', borderRadius:4, padding:'1px 5px', color:'#fcd34d', fontWeight:700, letterSpacing:1 }}>★★★★★</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize:13, color:'#7aa8cc', lineHeight:1.65, marginBottom:6 }}>
              Aprenda inglês profissional de hospitalidade num turno real Forbes 5★. Fale com guests, responda ao Inspector, receba coaching do Rick Tutor.
            </p>
            <p style={{ fontSize:11, color:'#3b9eff', fontStyle:'italic', marginBottom:12, opacity:0.8 }}>Train like Forbes. Speak like a native.</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {['18 Cenas','45s Timer','English AI','PDF Report','Rick Tutor'].map(t => (
                <span key={t} style={{ fontSize:10, fontWeight:700, color:'#3b9eff', background:'rgba(59,158,255,0.1)', border:'1px solid rgba(59,158,255,0.3)', borderRadius:10, padding:'3px 9px' }}>{t}</span>
              ))}
            </div>
          </button>

          {/* ── Training Chat ── */}
          <button
            onClick={e => { triggerBurst(e, 'chat'); setTimeout(() => router.push('/training'), 220) }}
            style={{
              width: '100%', padding: '24px 22px', borderRadius: 20,
              background: 'linear-gradient(145deg,#06180e 0%,#0d2e18 60%,#06180e 100%)',
              border: '1px solid rgba(34,197,94,0.38)',
              cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 40px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.transform = 'scale(1.025)'; b.style.boxShadow = '0 4px 55px rgba(34,197,94,0.22), inset 0 1px 0 rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.transform = 'scale(1)'; b.style.boxShadow = '0 4px 40px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.04)' }}
          >
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(34,197,94,0.6),transparent)' }} />
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
              <span style={{ fontSize:34, filter:'drop-shadow(0 0 10px rgba(34,197,94,0.6))' }}>💬</span>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:'#fff', letterSpacing:1 }}>Training Chat</div>
                <div style={{ fontSize:10, color:'#22c55e', fontWeight:700, letterSpacing:3, marginTop:3 }}>LUXURY WAITER AI</div>
              </div>
            </div>
            <p style={{ fontSize:13, color:'#7aa8cc', lineHeight:1.65, marginBottom:14 }}>
              Converse com um guest AI em tempo real. Pratique respostas, receba feedback e melhore seu inglês de hospitalidade.
            </p>
            <div style={{ display:'flex', gap:6 }}>
              {['Chat IA','Feedback','Pontuação','Medalhas'].map(t => (
                <span key={t} style={{ fontSize:10, fontWeight:700, color:'#22c55e', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:10, padding:'3px 9px' }}>{t}</span>
              ))}
            </div>
          </button>

          {/* ── Rick Mentor Card ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            background: 'linear-gradient(135deg,rgba(10,20,35,0.95),rgba(6,12,24,0.95))',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 18, padding: '16px 18px',
            boxShadow: '0 0 30px rgba(245,158,11,0.06)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent)' }} />
            {/* Rick photo */}
            <div style={{ position:'relative', flexShrink:0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/rick.jpg"
                alt="Rick"
                style={{ width:62, height:62, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', display:'block' }}
                onError={e => {
                  const el = e.currentTarget
                  el.style.display = 'none'
                  const fb = el.nextSibling as HTMLElement
                  if (fb) fb.style.display = 'flex'
                }}
              />
              <div style={{ width:62, height:62, borderRadius:'50%', background:'linear-gradient(135deg,#0a2a4a,#1a5fa8)', display:'none', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#fff' }}>R</div>
              <div style={{ position:'absolute', inset:-2, borderRadius:'50%', border:'2px solid transparent', background:'linear-gradient(#020810,#020810) padding-box, linear-gradient(135deg,#f59e0b,#fcd34d,#b45309) border-box', animation:'rickGlow 2.5s ease-in-out infinite' }} />
              {/* Online dot */}
              <div style={{ position:'absolute', bottom:2, right:2, width:12, height:12, borderRadius:'50%', background:'#22c55e', border:'2px solid #020810', boxShadow:'0 0 6px #22c55e' }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
                <span style={{ fontSize:14, fontWeight:800, color:'#fff' }}>Rick</span>
                <span style={{ fontSize:9, fontWeight:700, color:'#f59e0b', background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:6, padding:'2px 6px', letterSpacing:1 }}>MENTOR</span>
              </div>
              <p style={{ fontSize:11, color:'#7aa8cc', lineHeight:1.5, margin:0 }}>
                Forbes 5★ hospitality mentor. Avalia cada cena, corrige seu inglês e te dá feedback de voz personalizado.
              </p>
            </div>
          </div>

          <p style={{ textAlign:'center', fontSize:10, color:'#1c3550', letterSpacing:2 }}>CAREER ANALYTICS AI · HOSPITALITY EDITION</p>
        </div>
      </div>
    </>
  )
}
