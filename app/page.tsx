'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

// Premium palette: warm black + antique gold
const G = '#c9a84c'       // antique gold
const GL = '#e8d090'      // champagne
const GB = 'rgba(201,168,76,0.22)'  // gold border
const BG = '#07050b'      // deep warm black

type Burst = { id: number; x: number; y: number }
const SPARKS = ['#c9a84c','#e8d090','#f4f0e8','#a07830','#fff8e0']
const N = 12

function playChime(type: 'gold' | 'green') {
  try {
    const ctx = new AudioContext()
    const f1 = type === 'gold' ? 880 : 660
    const f2 = type === 'gold' ? 1108 : 830
    ;[f1, f2].forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination); o.type = 'sine'; o.frequency.value = f
      const t = ctx.currentTime + i * 0.1
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.14, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.32)
      o.start(t); o.stop(t + 0.32)
    })
  } catch {}
}

const Logo = () => (
  <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="76" y2="76" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e8d090"/><stop offset="0.5" stopColor="#c9a84c"/><stop offset="1" stopColor="#8b6914"/>
      </linearGradient>
      <radialGradient id="bg" cx="50%" cy="40%">
        <stop offset="0%" stopColor="#161010"/><stop offset="100%" stopColor="#0a0708"/>
      </radialGradient>
    </defs>
    <circle cx="38" cy="38" r="37" fill="url(#bg)"/>
    <circle cx="38" cy="38" r="36" stroke="url(#lg)" strokeWidth="1.5" fill="none"/>
    <circle cx="38" cy="38" r="29" stroke="url(#lg)" strokeWidth="0.5" fill="none" opacity="0.35"/>
    {/* Fork */}
    <line x1="28" y1="17" x2="28" y2="27" stroke={GL} strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="32" y1="17" x2="32" y2="27" stroke={GL} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M28 27 Q28 33 30 34.5 L30 58" stroke={G} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    <path d="M28 17 Q26 22 26 27 Q26 33 30 34.5" stroke={GL} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <path d="M32 27 Q34 33 30 34.5" stroke={GL} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    {/* Knife */}
    <path d="M45 17 Q49 24 49 33 Q49 37 45 38 L45 58" stroke={G} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    {/* Center dot */}
    <circle cx="38" cy="38" r="1.5" fill={G} opacity="0.4"/>
  </svg>
)

export default function Home() {
  const router = useRouter()
  const [bursts, setBursts] = useState<Burst[]>([])

  const triggerBurst = useCallback((e: React.MouseEvent, type: 'gold' | 'green') => {
    playChime(type)
    const id = Date.now() + Math.random()
    setBursts(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 800)
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes glimmer { 0%,100%{opacity:0.08}50%{opacity:0.55} }
        @keyframes drift { 0%{transform:translateY(0) scale(1);opacity:0.4}100%{transform:translateY(-100vh) scale(0.6);opacity:0} }
        @keyframes badgeAura { 0%,100%{box-shadow:0 0 8px rgba(201,168,76,0.4)}50%{box-shadow:0 0 22px rgba(201,168,76,0.85),0 0 44px rgba(201,168,76,0.3)} }
        @keyframes starPulse { 0%,100%{transform:scale(1);opacity:0.65}50%{transform:scale(1.4);opacity:1} }
        @keyframes sparkOut { 0%{transform:translate(0,0) scale(1.6);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes goldRing { 0%,100%{box-shadow:0 0 0 2px rgba(201,168,76,0.35)}50%{box-shadow:0 0 0 4px rgba(201,168,76,0.7),0 0 18px rgba(201,168,76,0.25)} }
        * { box-sizing:border-box;margin:0;padding:0 }
        html,body { height:100% }
      `}</style>

      {/* Spark bursts */}
      {bursts.map(b => (
        <div key={b.id} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999 }}>
          {Array.from({ length: N }, (_, i) => {
            const angle = (i / N) * 360
            const rad = (angle * Math.PI) / 180
            const dist = 40 + Math.random() * 28
            const color = SPARKS[i % SPARKS.length]
            const size = 3 + Math.random() * 5
            return (
              <div key={i} style={{
                position:'absolute', left:b.x-size/2, top:b.y-size/2,
                width:size, height:size,
                borderRadius: i % 4 === 0 ? '1px' : '50%',
                background:color, boxShadow:`0 0 5px ${color}`,
                ...({ '--tx':`${Math.cos(rad)*dist}px`,'--ty':`${Math.sin(rad)*dist}px` } as React.CSSProperties),
                animation:'sparkOut 0.72s ease-out forwards',
                animationDelay:`${i*0.012}s`,
              } as React.CSSProperties}/>
            )
          })}
        </div>
      ))}

      <div style={{
        minHeight:'100dvh',
        background:`radial-gradient(ellipse at 35% 45%, #120e08 0%, ${BG} 55%, #09060d 100%)`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'var(--font-geist-sans, Arial, sans-serif)',
        padding:'24px 20px', position:'relative', overflow:'hidden',
      }}>
        {/* Floating dust particles */}
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} style={{
            position:'absolute',
            left:`${(i*17.3)%100}%`, top:`${(i*23.7)%100}%`,
            width:(i%3)+1, height:(i%3)+1, borderRadius:'50%',
            background: i%5===0 ? G : i%4===0 ? GL : '#fff8e0',
            opacity: 0.12,
            pointerEvents:'none',
            animation:`glimmer ${2.5+i%3.5}s ease-in-out infinite, drift ${20+i%10}s linear infinite`,
            animationDelay:`${(i*0.4)%20}s`,
          }}/>
        ))}

        <div style={{ width:'100%', maxWidth:400, display:'flex', flexDirection:'column', gap:20, animation:'fadeUp 0.65s ease', position:'relative', zIndex:1 }}>

          {/* ── Header ── */}
          <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
            <div style={{ filter:`drop-shadow(0 0 28px rgba(201,168,76,0.55))` }}>
              <Logo/>
            </div>
            <div>
              <h1 style={{ fontSize:25, fontWeight:900, color:'#f4f0e8', letterSpacing:4, lineHeight:1, margin:0 }}>
                CAREER ANALYTICS
              </h1>
              <div style={{ width:'100%', height:'1px', background:`linear-gradient(90deg,transparent,${G},transparent)`, margin:'10px 0' }}/>
              <p style={{ fontSize:9, color:'#9a8868', fontWeight:600, letterSpacing:5, textTransform:'uppercase', margin:0 }}>
                Professional Waiter · English · Hospitality AI
              </p>
            </div>
            <p style={{ fontSize:13, color:GL, fontWeight:400, fontStyle:'italic', opacity:0.8, margin:0 }}>
              "Speak English. Serve 5 Stars."
            </p>
            <div style={{ display:'flex', gap:7 }}>
              {[0,1,2,3,4].map(i => (
                <span key={i} style={{ fontSize:15, color:G, filter:`drop-shadow(0 0 4px ${G})`, animation:'starPulse 2s ease-in-out infinite', animationDelay:`${i*0.2}s`, display:'inline-block' }}>★</span>
              ))}
            </div>
          </div>

          {/* ── Career Simulator (PRO) ── */}
          <button
            onClick={e => { triggerBurst(e,'gold'); setTimeout(()=>router.push('/shift'),230) }}
            style={{
              width:'100%', padding:'24px 22px', borderRadius:20, cursor:'pointer',
              textAlign:'left', position:'relative', overflow:'hidden',
              background:'linear-gradient(155deg,#0f0a04 0%,#1a1408 50%,#0d0904 100%)',
              border:`1px solid rgba(201,168,76,0.35)`,
              boxShadow:`0 4px 40px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.08)`,
              transition:'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e=>{ const b=e.currentTarget; b.style.transform='scale(1.025)'; b.style.boxShadow=`0 4px 55px rgba(201,168,76,0.22), inset 0 1px 0 rgba(201,168,76,0.1)` }}
            onMouseLeave={e=>{ const b=e.currentTarget; b.style.transform='scale(1)'; b.style.boxShadow=`0 4px 40px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.08)` }}
          >
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:`linear-gradient(90deg,transparent,${G},transparent)` }}/>
            <div style={{ position:'absolute', top:13, right:13, background:`linear-gradient(135deg,${G},#8b6914)`, borderRadius:7, padding:'4px 12px', fontSize:10, fontWeight:900, color:'#07050b', letterSpacing:2, animation:'badgeAura 2.5s ease-in-out infinite' }}>PRO</div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
              <span style={{ fontSize:32, filter:`drop-shadow(0 0 10px ${G})` }}>⚡</span>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:'#f4f0e8', letterSpacing:1 }}>Career Simulator</div>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:3 }}>
                  <span style={{ fontSize:9, color:G, fontWeight:700, letterSpacing:2 }}>FORBES 5-STAR</span>
                  <span style={{ fontSize:8, color:GL, background:`rgba(201,168,76,0.12)`, border:`1px solid rgba(201,168,76,0.3)`, borderRadius:4, padding:'1px 5px', fontWeight:700, letterSpacing:1 }}>★★★★★</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize:13, color:'#9a8868', lineHeight:1.68, marginBottom:6 }}>
              Aprenda inglês profissional de hospitalidade num turno real Forbes 5★. Fale com guests, responda ao Inspector, coaching Rick Tutor.
            </p>
            <p style={{ fontSize:11, color:G, fontStyle:'italic', opacity:0.75, marginBottom:12 }}>Train like Forbes. Speak like a native.</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {['18 Cenas','45s Timer','English AI','PDF Report','Rick Tutor'].map(t=>(
                <span key={t} style={{ fontSize:10, fontWeight:700, color:G, background:`rgba(201,168,76,0.08)`, border:`1px solid rgba(201,168,76,0.25)`, borderRadius:10, padding:'3px 9px' }}>{t}</span>
              ))}
            </div>
          </button>

          {/* ── Training Chat ── */}
          <button
            onClick={e => { triggerBurst(e,'gold'); setTimeout(()=>router.push('/training'),230) }}
            style={{
              width:'100%', padding:'24px 22px', borderRadius:20, cursor:'pointer',
              textAlign:'left', position:'relative', overflow:'hidden',
              background:'linear-gradient(155deg,#0c0a06 0%,#141008 50%,#0c0a06 100%)',
              border:`1px solid rgba(201,168,76,0.28)`,
              boxShadow:`0 4px 35px rgba(201,168,76,0.07), inset 0 1px 0 rgba(201,168,76,0.05)`,
              transition:'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e=>{ const b=e.currentTarget; b.style.transform='scale(1.025)'; b.style.boxShadow=`0 4px 50px rgba(201,168,76,0.18), inset 0 1px 0 rgba(201,168,76,0.08)` }}
            onMouseLeave={e=>{ const b=e.currentTarget; b.style.transform='scale(1)'; b.style.boxShadow=`0 4px 35px rgba(201,168,76,0.07), inset 0 1px 0 rgba(201,168,76,0.05)` }}
          >
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:`linear-gradient(90deg,transparent,rgba(201,168,76,0.45),transparent)` }}/>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
              <span style={{ fontSize:32, filter:`drop-shadow(0 0 8px rgba(201,168,76,0.5))` }}>💬</span>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:'#f4f0e8', letterSpacing:1 }}>Training Chat</div>
                <div style={{ fontSize:9, color:G, fontWeight:700, letterSpacing:3, marginTop:3 }}>LUXURY WAITER AI</div>
              </div>
            </div>
            <p style={{ fontSize:13, color:'#9a8868', lineHeight:1.68, marginBottom:14 }}>
              Converse com um guest AI em tempo real. Pratique respostas, receba feedback e melhore seu inglês de hospitalidade.
            </p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {['Chat IA','Feedback','Pontuação','Medalhas'].map(t=>(
                <span key={t} style={{ fontSize:10, fontWeight:700, color:G, background:`rgba(201,168,76,0.08)`, border:`1px solid rgba(201,168,76,0.22)`, borderRadius:10, padding:'3px 9px' }}>{t}</span>
              ))}
            </div>
          </button>

          {/* ── Rick Mentor Card ── */}
          <div style={{
            display:'flex', alignItems:'center', gap:16,
            background:'linear-gradient(135deg,#0e0b06,#08060a)',
            border:`1px solid rgba(201,168,76,0.22)`,
            borderRadius:18, padding:'16px 18px',
            boxShadow:'0 0 30px rgba(201,168,76,0.05)',
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:`linear-gradient(90deg,transparent,${G},transparent)` }}/>
            <div style={{ position:'relative', flexShrink:0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/scenes/rick.jpeg" alt="Rick"
                style={{ width:60, height:60, borderRadius:'50%', objectFit:'cover', objectPosition:'50% 30%', display:'block' }}
                onError={e=>{ const el=e.currentTarget; el.style.display='none'; (el.nextSibling as HTMLElement).style.display='flex' }}
              />
              <div style={{ width:60, height:60, borderRadius:'50%', background:`linear-gradient(135deg,#1a1005,#2a1e08)`, display:'none', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:G }}>R</div>
              <div style={{ position:'absolute', inset:-2, borderRadius:'50%', border:'2px solid transparent', background:`linear-gradient(#08060a,#08060a) padding-box, linear-gradient(135deg,${GL},${G},#8b6914) border-box`, animation:'goldRing 2.8s ease-in-out infinite' }}/>
              <div style={{ position:'absolute', bottom:2, right:2, width:11, height:11, borderRadius:'50%', background:'#5a9e6e', border:'2px solid #07050b', boxShadow:'0 0 5px #5a9e6e' }}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4 }}>
                <span style={{ fontSize:14, fontWeight:800, color:'#f4f0e8' }}>Rick</span>
                <span style={{ fontSize:9, fontWeight:700, color:'#07050b', background:`linear-gradient(135deg,${G},#8b6914)`, borderRadius:5, padding:'2px 7px', letterSpacing:1 }}>MENTOR</span>
              </div>
              <p style={{ fontSize:11, color:'#6b5840', lineHeight:1.55, margin:0 }}>
                Forbes 5★ hospitality mentor. Avalia cada cena, corrige seu inglês e te dá feedback de voz personalizado.
              </p>
            </div>
          </div>

          <p style={{ textAlign:'center', fontSize:9, color:'#2e2418', letterSpacing:3, textTransform:'uppercase' }}>Career Analytics AI · Hospitality Edition</p>
        </div>
      </div>
    </>
  )
}
