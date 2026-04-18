'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import RickPhoto from '@/components/RickPhoto'

const BG = '#09090b'
const G  = '#00dc82'

type Spark = { id: number; x: number; y: number; color: string; angle: number }

function playClick(freq = 660) {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination); o.type = 'sine'; o.frequency.value = freq
    g.gain.setValueAtTime(0, ctx.currentTime)
    g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
    o.start(); o.stop(ctx.currentTime + 0.18)
  } catch {}
}

const ShieldLogo = () => (
  <svg width="28" height="32" viewBox="-6 -6 64 70" fill="none" overflow="visible">
    <defs>
      <filter id="sglow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M26 3L49 12V28C49 42 38 52 26 56C14 52 3 42 3 28V12L26 3Z"
      fill="rgba(0,220,130,0.1)" stroke="#00dc82" strokeWidth="1.5" filter="url(#sglow)"/>
    <line x1="26" y1="12" x2="26" y2="44" stroke="#00dc82" strokeWidth="1" opacity="0.4"/>
    <line x1="10" y1="28" x2="42" y2="28" stroke="#00dc82" strokeWidth="1" opacity="0.4"/>
    <circle cx="26" cy="28" r="5" fill="none" stroke="#00dc82" strokeWidth="1.5"/>
    <circle cx="26" cy="28" r="2.5" fill="#00dc82"/>
  </svg>
)

const MODULES = [
  { id:'shift',       label:'FIELD SIM',      name:'Field Scenarios',      desc:'Real workplace simulations with Rick — service, guests, emergencies.',  icon:'⚔️',  color:'#00dc82', href:'/shift',        badge:null,    meta:'9 scenes · ~20 min · AI scoring', freq:660 },
  { id:'level-scan',  label:'SKILL CHECK',    name:'Level Scan',           desc:'Gamified CEFR assessment — Listening, Speaking, Reading & Writing.',    icon:'🎯',  color:'#818cf8', href:'/level-scan',   badge:'NEW',   meta:'4 sections · ~15 min · CEFR',    freq:880 },
  { id:'interview',   label:'INTERVIEW SIM',  name:'Interview Simulator',  desc:'10 video questions, full AI evaluation and HR-ready report.',            icon:'💼',  color:'#38bdf8', href:'/interview',    badge:null,    meta:'10 questions · video · HR report',freq:770 },
  { id:'training',    label:'AI COACH',       name:'Training Chat',        desc:'One-on-one coaching with Rick — grammar, vocabulary, real scenarios.',   icon:'📚',  color:'#fb923c', href:'/training',     badge:null,    meta:'Unlimited · real-time · feedback',freq:550 },
  { id:'daily-drill', label:'DAILY DRILL',    name:'Daily Drill',          desc:'5-minute daily practice. Build your streak and lock in the language.',   icon:'🔥',  color:'#f472b6', href:'/daily-drill',  badge:'DAILY', meta:'5 questions · 5 min · streak',   freq:700 },
  { id:'work-abroad', label:'WORK ABROAD',    name:'Dubai & Beyond',       desc:'Salaries, lifestyle and how to get hired in luxury hotels abroad.',      icon:'✈️',  color:'#fbbf24', href:'/work-abroad',  badge:null,    meta:'Dubai · Qatar · London',         freq:600 },
  { id:'menu-master', label:'MENU MASTER',    name:'Menu Master',          desc:'Upload your food or drink bible — AI turns it into a memorisation game.',icon:'📋',  color:'#2dd4bf', href:'/menu-master',  badge:'B2B',   meta:'Upload · Quiz · Score · Reveal', freq:750 },
]

export default function LandingPage() {
  const router = useRouter()
  const [sparks, setSparks] = useState<Spark[]>([])
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [booted, setBooted] = useState(false)
  const [streak, setStreak] = useState(0)
  const idRef = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 80)
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes sparkFly { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)} }
        @keyframes pulse { 0%,100%{opacity:0.4}50%{opacity:1} }
        @keyframes streakPop { 0%{transform:scale(0.8)}60%{transform:scale(1.15)}100%{transform:scale(1)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#1a2a1a; border-radius:3px; }
      `}</style>

      <div style={{
        minHeight:'100dvh', background:BG,
        fontFamily:'var(--font-geist-sans,Arial,sans-serif)',
        opacity: booted ? 1 : 0, transition:'opacity 0.3s ease',
        position:'relative',
      }}>
        {/* Dot grid */}
        <div style={{
          position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
          backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize:'24px 24px',
        }} />

        <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:430, margin:'0 auto', paddingBottom:40 }}>

          {/* ── Top bar ── */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'22px 20px 0', animation:'fadeUp 0.3s ease both' }}>
            <ShieldLogo />
            <span style={{ fontSize:20, fontWeight:900, color:'#e8edf2', letterSpacing:5 }}>ON DUTY</span>
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
              {streak > 0 && (
                <span style={{ fontSize:12, color:'#f472b6', fontWeight:800, animation:'streakPop 0.4s ease both' }}>
                  🔥 {streak}
                </span>
              )}
              <span style={{ fontSize:8, color:'#2a3a2a', border:'1px solid #1e2e1e', borderRadius:4, padding:'2px 7px', fontWeight:700, letterSpacing:1 }}>v2.0</span>
            </div>
          </div>

          {/* ── Hero ── */}
          <div style={{ padding:'28px 20px 0', animation:'fadeUp 0.4s 0.05s ease both', opacity:0 }}>
            <div style={{ marginBottom:6 }}>
              <span style={{ fontSize:9, color:G, fontWeight:700, letterSpacing:3 }}>PROFESSIONAL ENGLISH TRAINING</span>
            </div>
            <h1 style={{ fontSize:36, fontWeight:900, color:'#e8edf2', lineHeight:1.05, margin:'0 0 14px', letterSpacing:-0.5 }}>
              Get fit for<br /><span style={{ color:G }}>duty.</span>
            </h1>
            <p style={{ fontSize:13, color:'#3a4a3a', lineHeight:1.7, margin:'0 0 22px' }}>
              Real English training for hospitality professionals. Simulations, interview prep, CEFR assessment and real career tools — all in one place.
            </p>

            {/* Rick instructor card */}
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              background:'rgba(255,255,255,0.025)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:14, padding:'13px 15px', marginBottom:8,
              position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${G}35,transparent)` }} />
              <RickPhoto size={42} imgStyle={{ border:'2px solid rgba(0,220,130,0.25)' }} fallbackStyle={{ background:'rgba(0,220,130,0.1)', color:G }} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:800, color:'#e8edf2' }}>Rick</span>
                  <span style={{ fontSize:8, color:G, background:'rgba(0,220,130,0.1)', border:'1px solid rgba(0,220,130,0.2)', borderRadius:4, padding:'1px 6px', fontWeight:700 }}>ONLINE</span>
                </div>
                <div style={{ fontSize:11, color:'#304a30' }}>AI Instructor · Available 24/7</div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:22, fontWeight:900, color:'#e8edf2', lineHeight:1 }}>7</div>
                <div style={{ fontSize:8, color:'#2a3a2a', fontWeight:700, letterSpacing:1 }}>MODULES</div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display:'flex', gap:6, marginBottom:4 }}>
              {[['🎯','CEFR Certified'],['🤖','GPT-4.1 AI'],['📱','Mobile First']].map(([icon, label]) => (
                <div key={label as string} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:4, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:8, padding:'6px 4px' }}>
                  <span style={{ fontSize:11 }}>{icon}</span>
                  <span style={{ fontSize:8, color:'#2a3a2a', fontWeight:700, letterSpacing:0.5 }}>{label as string}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section label ── */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'24px 20px 12px', animation:'fadeUp 0.4s 0.1s ease both', opacity:0 }}>
            <span style={{ fontSize:9, fontWeight:700, color:'#2a3a2a', letterSpacing:2, whiteSpace:'nowrap' }}>TRAINING MODULES</span>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.04)' }} />
          </div>

          {/* ── Module cards ── */}
          <div style={{ padding:'0 12px', display:'flex', flexDirection:'column', gap:7 }}>
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
                    background: active ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                    border:'1px solid rgba(255,255,255,0.06)',
                    borderLeft:`3px solid ${active ? mod.color : mod.color + '55'}`,
                    borderRadius:14, padding:'14px 15px',
                    cursor:'pointer', transition:'all 0.18s ease',
                    transform: active ? 'translateY(-1px)' : 'none',
                    boxShadow: active ? `0 6px 24px ${mod.color}15, 0 0 0 1px ${mod.color}08` : 'none',
                    animation:`fadeUp 0.4s ${i * 0.04 + 0.15}s ease both`, opacity:0,
                  }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    {/* Icon badge */}
                    <div style={{
                      width:42, height:42, borderRadius:11, flexShrink:0,
                      background:`${mod.color}10`,
                      border:`1px solid ${mod.color}22`,
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
                      boxShadow: active ? `0 0 14px ${mod.color}28` : 'none',
                      transition:'box-shadow 0.18s',
                    }}>
                      {mod.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
                        <span style={{ fontSize:8, fontWeight:800, color:mod.color, letterSpacing:2 }}>{mod.label}</span>
                        {mod.badge && (
                          <span style={{ fontSize:7, fontWeight:800, color:mod.color, background:`${mod.color}15`, border:`1px solid ${mod.color}28`, borderRadius:3, padding:'1px 5px', letterSpacing:1 }}>{mod.badge}</span>
                        )}
                      </div>
                      <div style={{ fontSize:13, fontWeight:800, color:'#e8edf2', marginBottom:3 }}>{mod.name}</div>
                      <div style={{ fontSize:11, color:'#324232', lineHeight:1.45, marginBottom:6 }}>{mod.desc}</div>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {mod.meta.split(' · ').map(m => (
                          <span key={m} style={{ fontSize:9, color:`${mod.color}70`, background:`${mod.color}0c`, border:`1px solid ${mod.color}16`, borderRadius:4, padding:'2px 6px', fontWeight:600 }}>{m}</span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div style={{ fontSize:14, color:mod.color, opacity: active ? 0.9 : 0.18, transition:'opacity 0.18s', flexShrink:0 }}>→</div>
                  </div>

                  {/* Sparks */}
                  {sparks.map(s => (
                    <div key={s.id} style={{
                      position:'absolute', left:s.x, top:s.y,
                      width:4, height:4, borderRadius:'50%', background:s.color,
                      pointerEvents:'none',
                      // @ts-expect-error CSS vars
                      '--dx':`${Math.cos(s.angle * Math.PI / 180) * 32}px`,
                      '--dy':`${Math.sin(s.angle * Math.PI / 180) * 32}px`,
                      animation:'sparkFly 0.5s ease-out forwards',
                    }} />
                  ))}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{ padding:'22px 20px 0', textAlign:'center', animation:'fadeUp 0.4s 0.45s ease both', opacity:0 }}>
            <p style={{ fontSize:10, color:'#1a2a1a', letterSpacing:1 }}>
              Hold any text to translate · AI powered · ON DUTY v2.0
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
