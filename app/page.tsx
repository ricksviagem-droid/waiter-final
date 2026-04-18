'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import RickPhoto from '@/components/RickPhoto'

const MG  = '#00ff88'   // matrix green
const MG2 = '#00cc6a'   // darker green

type Spark = { id: number; x: number; y: number; color: string; angle: number }

function playClick(freq = 660) {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination); o.type = 'sine'; o.frequency.value = freq
    g.gain.setValueAtTime(0, ctx.currentTime)
    g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14)
    o.start(); o.stop(ctx.currentTime + 0.14)
  } catch {}
}

const ShieldLogo = () => (
  <svg width="26" height="30" viewBox="0 0 52 60" fill="none" overflow="visible">
    <defs>
      <filter id="mglow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00ff88" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#00ff88" stopOpacity="0.02"/>
      </linearGradient>
    </defs>
    <path d="M26 2L50 11V29C50 44 39 53 26 57C13 53 2 44 2 29V11L26 2Z"
      fill="url(#sg)" stroke="#00ff88" strokeWidth="1.5" filter="url(#mglow)"/>
    <path d="M26 10L42 17V29C42 38 35 45 26 48C17 45 10 38 10 29V17L26 10Z"
      fill="none" stroke="#00ff88" strokeWidth="0.8" opacity="0.4"/>
    <circle cx="26" cy="29" r="5.5" fill="none" stroke="#00ff88" strokeWidth="1.2" opacity="0.65"/>
    <circle cx="26" cy="29" r="2.2" fill="#00ff88" filter="url(#mglow)"/>
    <line x1="26" y1="13" x2="26" y2="23.5" stroke="#00ff88" strokeWidth="1" opacity="0.5"/>
    <line x1="26" y1="34.5" x2="26" y2="46" stroke="#00ff88" strokeWidth="1" opacity="0.5"/>
    <line x1="11" y1="29" x2="20.5" y2="29" stroke="#00ff88" strokeWidth="1" opacity="0.5"/>
    <line x1="31.5" y1="29" x2="41" y2="29" stroke="#00ff88" strokeWidth="1" opacity="0.5"/>
  </svg>
)

const MODULES = [
  { id:'shift',       label:'FIELD SIM',     name:'Field Scenarios',     desc:'Real workplace simulations with Rick — service, guests, emergencies.',   icon:'⚔️',  color:'#00ff88', href:'/shift',       badge:null,    meta:'9 scenes · ~20 min · AI scoring', freq:660 },
  { id:'level-scan',  label:'SKILL CHECK',   name:'Level Scan',          desc:'Gamified CEFR assessment — Listening, Speaking, Reading & Writing.',     icon:'🎯',  color:'#818cf8', href:'/level-scan',  badge:'NEW',   meta:'4 sections · ~15 min · CEFR',    freq:880 },
  { id:'interview',   label:'INTERVIEW SIM', name:'Interview Simulator', desc:'10 video questions, full AI evaluation and HR-ready report.',             icon:'💼',  color:'#38bdf8', href:'/interview',   badge:null,    meta:'10 questions · video · HR report',freq:770 },
  { id:'training',    label:'AI COACH',      name:'Training Chat',       desc:'One-on-one coaching with Rick — grammar, vocabulary, real scenarios.',    icon:'📚',  color:'#fb923c', href:'/training',    badge:null,    meta:'Unlimited · real-time · feedback',freq:550 },
  { id:'daily-drill', label:'DAILY DRILL',   name:'Daily Drill',         desc:'5-minute daily practice. Build your streak and lock in the language.',    icon:'🔥',  color:'#f472b6', href:'/daily-drill', badge:'DAILY', meta:'5 questions · 5 min · streak',   freq:700 },
  { id:'work-abroad', label:'WORK ABROAD',   name:'Dubai & Beyond',      desc:'Salaries, lifestyle and how to get hired in luxury hotels abroad.',       icon:'✈️',  color:'#fbbf24', href:'/work-abroad', badge:null,    meta:'Dubai · Qatar · London',         freq:600 },
  { id:'menu-master', label:'MENU MASTER',   name:'Menu Master',         desc:'Upload your food or drink bible — AI turns it into a memorisation game.', icon:'📋',  color:'#2dd4bf', href:'/menu-master', badge:'B2B',   meta:'PDF · Quiz · Score · Reveal',    freq:750 },
  { id:'resume',      label:'RESUME AI',     name:'Professional Resume', desc:'Build or upgrade your hospitality CV — AI writes it in perfect English.',   icon:'📄',  color:'#a78bfa', href:'/resume',      badge:'NEW',   meta:'Generate · Improve · Download',  freq:820 },
]

export default function LandingPage() {
  const router = useRouter()
  const [sparks, setSparks] = useState<Spark[]>([])
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [booted, setBooted] = useState(false)
  const [streak, setStreak] = useState(0)
  const idRef = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 60)
    try {
      const s = localStorage.getItem('onduty_drill_streak')
      if (s) setStreak(parseInt(s) || 0)
    } catch {}
    return () => clearTimeout(t)
  }, [])

  function spawnSparks(x: number, y: number, color: string) {
    const arr: Spark[] = Array.from({ length: 6 }, (_, i) => ({
      id: ++idRef.current, x, y, color, angle: (i / 6) * 360,
    }))
    setSparks(prev => [...prev, ...arr])
    setTimeout(() => setSparks(prev => prev.filter(s => !arr.find(a => a.id === s.id))), 600)
  }

  function handleNav(e: React.MouseEvent, mod: typeof MODULES[0]) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    spawnSparks(e.clientX - rect.left, e.clientY - rect.top, mod.color)
    playClick(mod.freq)
    setTimeout(() => router.push(mod.href), 180)
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes sparkFly { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)} }
        @keyframes streakPop { 0%{transform:scale(0.8)}60%{transform:scale(1.15)}100%{transform:scale(1)} }
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; background:#000; }
        ::-webkit-scrollbar { width:2px; }
        ::-webkit-scrollbar-thumb { background:rgba(0,255,136,0.15); border-radius:2px; }
      `}</style>

      <div style={{
        minHeight:'100dvh',
        background:'#000',
        fontFamily:'var(--font-geist-sans,Arial,sans-serif)',
        opacity: booted ? 1 : 0, transition:'opacity 0.3s ease',
        position:'relative',
      }}>
        {/* Matrix dot grid */}
        <div style={{
          position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
          backgroundImage:'radial-gradient(circle, rgba(0,255,136,0.07) 1px, transparent 1px)',
          backgroundSize:'28px 28px',
        }} />
        {/* Scanlines */}
        <div style={{
          position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
          background:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)',
        }} />

        <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:430, margin:'0 auto', paddingBottom:40 }}>

          {/* ── Top bar ── */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'20px 20px 0', animation:'fadeUp 0.3s ease both' }}>
            <ShieldLogo />
            <div>
              <div style={{ fontSize:17, fontWeight:900, color:'#e0ffee', letterSpacing:6, lineHeight:1.1, textShadow:`0 0 24px ${MG}44` }}>ON DUTY</div>
              <div style={{ fontSize:6.5, color:`${MG}66`, letterSpacing:3, fontFamily:'monospace', fontWeight:600 }}>
                SYSTEM ONLINE
                <span style={{ animation:'cursorBlink 1s step-end infinite', marginLeft:2 }}>_</span>
              </div>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
              {streak > 0 && (
                <span style={{ fontSize:12, color:'#f472b6', fontWeight:800, animation:'streakPop 0.4s ease both' }}>🔥 {streak}</span>
              )}
              <span style={{ fontSize:7, color:`${MG}55`, border:`1px solid ${MG}20`, borderRadius:3, padding:'2px 7px', fontWeight:700, letterSpacing:1, fontFamily:'monospace' }}>v2.0</span>
            </div>
          </div>

          {/* ── Hero ── */}
          <div style={{ padding:'26px 20px 0', animation:'fadeUp 0.4s 0.06s ease both' }}>
            <div style={{ marginBottom:8 }}>
              <span style={{ fontSize:8, color:MG, fontWeight:700, letterSpacing:3, fontFamily:'monospace' }}>// PROFESSIONAL ENGLISH TRAINING</span>
            </div>
            <h1 style={{ fontSize:38, fontWeight:900, color:'#e0ffee', lineHeight:1.0, margin:'0 0 12px', letterSpacing:-0.5 }}>
              Get fit for<br />
              <span style={{ color:MG, textShadow:`0 0 40px ${MG}66` }}>duty.</span>
            </h1>
            <p style={{ fontSize:13, color:'#4a6657', lineHeight:1.7, margin:'0 0 20px' }}>
              Real English training for hospitality professionals. Simulations, interview prep, CEFR assessment and real career tools — all in one place.
            </p>

            {/* Rick instructor card */}
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              background:'rgba(0,255,136,0.025)',
              border:`1px solid rgba(0,255,136,0.1)`,
              borderLeft:`2px solid rgba(0,255,136,0.4)`,
              borderRadius:12, padding:'12px 15px', marginBottom:8,
              position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,${MG}40,transparent)` }} />
              <RickPhoto size={44} imgStyle={{ border:`1.5px solid rgba(0,255,136,0.35)` }} fallbackStyle={{ background:'rgba(0,255,136,0.08)', color:MG }} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:800, color:'#e0ffee' }}>Rick</span>
                  <span style={{ fontSize:7, color:MG, background:'rgba(0,255,136,0.1)', border:`1px solid rgba(0,255,136,0.25)`, borderRadius:4, padding:'1px 6px', fontWeight:700, letterSpacing:1 }}>ONLINE</span>
                </div>
                <div style={{ fontSize:11, color:'#3a5548' }}>AI Instructor · Available 24/7</div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:24, fontWeight:900, color:'#e0ffee', lineHeight:1, textShadow:`0 0 20px ${MG}44` }}>8</div>
                <div style={{ fontSize:7, color:'#2a4438', fontWeight:700, letterSpacing:2 }}>MODULES</div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display:'flex', gap:5 }}>
              {[['🎯','CEFR Certified'],['🤖','GPT-4.1 AI'],['📱','Mobile First']].map(([icon, label]) => (
                <div key={label as string} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:4, background:'rgba(0,255,136,0.02)', border:`1px solid rgba(0,255,136,0.07)`, borderRadius:8, padding:'7px 4px' }}>
                  <span style={{ fontSize:11 }}>{icon}</span>
                  <span style={{ fontSize:8, color:'#3a5548', fontWeight:700, letterSpacing:0.5 }}>{label as string}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section label ── */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'26px 20px 12px', animation:'fadeUp 0.4s 0.1s ease both' }}>
            <span style={{ fontSize:8, fontWeight:700, color:`${MG}50`, letterSpacing:3, fontFamily:'monospace', whiteSpace:'nowrap' }}>[ TRAINING MODULES ]</span>
            <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg,rgba(0,255,136,0.18),transparent)` }} />
          </div>

          {/* ── Module cards ── */}
          <div style={{ padding:'0 12px', display:'flex', flexDirection:'column', gap:5 }}>
            {MODULES.map((mod, i) => {
              const active = activeCard === mod.id
              return (
                <div
                  key={mod.id}
                  onClick={e => handleNav(e, mod)}
                  onMouseEnter={() => { setActiveCard(mod.id); playClick(mod.freq + 160) }}
                  onMouseLeave={() => setActiveCard(null)}
                  style={{
                    position:'relative', overflow:'hidden',
                    background: active ? 'rgba(8,12,10,0.95)' : 'rgba(4,6,5,0.9)',
                    border:`1px solid ${active ? mod.color + '28' : 'rgba(0,255,136,0.06)'}`,
                    borderLeft:`2px solid ${active ? mod.color : mod.color + '40'}`,
                    borderRadius:10, padding:'13px 14px',
                    cursor:'pointer', transition:'all 0.14s ease',
                    transform: active ? 'translateX(2px)' : 'none',
                    boxShadow: active ? `0 0 24px ${mod.color}0e, inset 0 0 40px ${mod.color}04` : 'none',
                    animation:`fadeUp 0.35s ${i * 0.04 + 0.14}s ease both`,
                  }}
                >
                  {active && <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,${mod.color}50,transparent)` }} />}

                  <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                    <div style={{
                      width:40, height:40, borderRadius:9, flexShrink:0,
                      background:'rgba(0,0,0,0.6)',
                      border:`1px solid ${active ? mod.color + '35' : mod.color + '15'}`,
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:17,
                      boxShadow: active ? `0 0 16px ${mod.color}28` : 'none',
                      transition:'all 0.14s',
                    }}>
                      {mod.icon}
                    </div>

                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
                        <span style={{ fontSize:8, fontWeight:700, color: active ? mod.color : `${mod.color}88`, letterSpacing:2, fontFamily:'monospace' }}>{mod.label}</span>
                        {mod.badge && (
                          <span style={{ fontSize:6.5, fontWeight:800, color:mod.color, background:`${mod.color}12`, border:`1px solid ${mod.color}28`, borderRadius:3, padding:'1px 5px', letterSpacing:1 }}>{mod.badge}</span>
                        )}
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color: active ? '#e0ffee' : '#8aaa99', marginBottom:3 }}>{mod.name}</div>
                      <div style={{ fontSize:11, color:'#3a5045', lineHeight:1.45, marginBottom:6 }}>{mod.desc}</div>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {mod.meta.split(' · ').map(m => (
                          <span key={m} style={{ fontSize:8, color:`${mod.color}60`, background:'rgba(0,0,0,0.4)', border:`1px solid ${mod.color}14`, borderRadius:3, padding:'2px 6px', fontWeight:600 }}>{m}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ fontSize:14, color:mod.color, opacity: active ? 0.9 : 0.18, transition:'opacity 0.14s', flexShrink:0, fontFamily:'monospace' }}>›</div>
                  </div>

                  {sparks.map(s => (
                    <div key={s.id} style={{
                      position:'absolute', left:s.x, top:s.y,
                      width:3, height:3, borderRadius:'50%', background:s.color,
                      pointerEvents:'none',
                      // @ts-expect-error CSS vars
                      '--dx':`${Math.cos(s.angle * Math.PI / 180) * 28}px`,
                      '--dy':`${Math.sin(s.angle * Math.PI / 180) * 28}px`,
                      animation:'sparkFly 0.5s ease-out forwards',
                    }} />
                  ))}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{ padding:'20px 20px 0', textAlign:'center', animation:'fadeUp 0.4s 0.45s ease both' }}>
            <p style={{ fontSize:8.5, color:'rgba(0,255,136,0.18)', letterSpacing:2, fontFamily:'monospace' }}>
              // hold to translate · ai powered · ON DUTY v2.0
            </p>
          </div>

        </div>
      </div>

      {/* ensure MG2 ref used */}
      {MG2 && null}
    </>
  )
}
