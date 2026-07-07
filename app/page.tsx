'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import RickPhoto from '@/components/RickPhoto'

// Deep Navy design tokens
const NAV   = '#071828'
const BLUE  = '#3B82F6'
const BLUE2 = '#60A5FA'
const SURF  = '#0D2337'
const BORD  = '#1A3A52'
const TEXT  = '#F0F4F8'
const MUTED = '#7BA3C4'

type Spark = { id: number; x: number; y: number; color: string; angle: number }

function playClick(freq = 660) {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination); o.type = 'sine'; o.frequency.value = freq
    g.gain.setValueAtTime(0, ctx.currentTime)
    g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    o.start(); o.stop(ctx.currentTime + 0.12)
  } catch {}
}

const MODULES = [
  { id:'shift',       label:'FIELD SIM',     name:'Field Scenarios',     desc:'Real workplace simulations with Rick — service, guests, emergencies.',   icon:'⚔️',  color:BLUE,    href:'/shift',       badge:null,    meta:'9 scenes · ~20 min · AI scoring', freq:660 },
  { id:'level-scan',  label:'SKILL CHECK',   name:'Level Scan',          desc:'Gamified CEFR assessment — Listening, Speaking, Reading & Writing.',     icon:'🎯',  color:'#818cf8', href:'/level-scan',  badge:'NEW',   meta:'4 sections · ~15 min · CEFR',    freq:880 },
  { id:'interview',   label:'INTERVIEW SIM', name:'Interview Simulator', desc:'10 video questions, full AI evaluation and HR-ready report.',             icon:'💼',  color:'#38bdf8', href:'/interview',   badge:null,    meta:'10 questions · video · HR report',freq:770 },
  { id:'training',    label:'AI COACH',      name:'Training Chat',       desc:'One-on-one coaching with Rick — grammar, vocabulary, real scenarios.',    icon:'📚',  color:'#fb923c', href:'/training',    badge:null,    meta:'Unlimited · real-time · feedback',freq:550 },
  { id:'daily-drill', label:'DAILY DRILL',   name:'Daily Drill',         desc:'5-minute daily practice. Build your streak and lock in the language.',    icon:'🔥',  color:'#f472b6', href:'/daily-drill', badge:'DAILY', meta:'5 questions · 5 min · streak',   freq:700 },
  { id:'work-abroad', label:'WORK ABROAD',   name:'Dubai & Beyond',      desc:'Salaries, lifestyle and how to get hired in luxury hotels abroad.',       icon:'✈️',  color:'#fbbf24', href:'/work-abroad', badge:null,    meta:'Dubai · Qatar · London',         freq:600 },
  { id:'menu-master', label:'MENU MASTER',   name:'Menu Master',         desc:'Upload your food or drink bible — AI turns it into a memorisation game.', icon:'📋',  color:'#2dd4bf', href:'/menu-master', badge:'B2B',   meta:'PDF · Quiz · Score · Reveal',    freq:750 },
  { id:'resume',      label:'RESUME AI',     name:'Professional Resume', desc:'Build or upgrade your hospitality CV — AI writes it in perfect English.',   icon:'📄',  color:'#a78bfa', href:'/resume',      badge:'NEW',   meta:'Generate · Improve · Download',  freq:820 },
  { id:'pos',         label:'POS SIMULATOR', name:'MICROS Simulator',    desc:'Real POS training — open tables, enter orders, comments, hold & fire.',      icon:'🖥️',  color:'#f59e0b', href:'/pos',         badge:'GAME',  meta:'8 orders · timer · scoring',     freq:580 },
  { id:'safe-spend',  label:'BUDGET',        name:'Safe to Spend',       desc:'Know exactly how much you can spend — income, expenses and savings plan.',      icon:'💚',  color:'#4ade80', href:'/safe-to-spend', badge:'NEW',  meta:'Calculator · Tips · 50/30/20',   freq:640 },
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes sparkFly { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)} }
        @keyframes streakPop { 0%{transform:scale(0.8)}60%{transform:scale(1.15)}100%{transform:scale(1)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; background:${NAV}; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:${BORD}; border-radius:3px; }
      `}</style>

      <div style={{
        minHeight: '100dvh',
        background: NAV,
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
        opacity: booted ? 1 : 0, transition: 'opacity 0.3s ease',
        position: 'relative',
      }}>
        {/* Subtle radial glow top-right */}
        <div style={{
          position: 'fixed', top: -120, right: -120,
          width: 500, height: 500, borderRadius: '50%',
          background: `radial-gradient(circle, ${BLUE}18 0%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 0,
        }} />
        {/* Subtle radial glow bottom-left */}
        <div style={{
          position: 'fixed', bottom: -80, left: -80,
          width: 360, height: 360, borderRadius: '50%',
          background: `radial-gradient(circle, ${BLUE}0C 0%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, margin: '0 auto', paddingBottom: 40 }}>

          {/* ── Top bar ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '22px 20px 0', animation: 'fadeUp 0.3s ease both' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: BLUE,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 20px ${BLUE}44`,
              }}>
                <span style={{ color: '#fff', fontSize: 16, fontWeight: 900, lineHeight: 1 }}>W</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginLeft: 8 }}>waiter</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: BLUE }}>ai</span>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              {streak > 0 && (
                <span style={{ fontSize: 12, color: '#f472b6', fontWeight: 800, animation: 'streakPop 0.4s ease both' }}>🔥 {streak}</span>
              )}
              <span style={{
                fontSize: 10, color: BLUE2, background: `${BLUE}18`, border: `1px solid ${BORD}`,
                borderRadius: 6, padding: '3px 10px', fontWeight: 700, letterSpacing: 0.5,
              }}>v2.0</span>
            </div>
          </div>

          {/* ── Hero ── */}
          <div style={{ padding: '28px 20px 0', animation: 'fadeUp 0.4s 0.06s ease both' }}>
            {/* Badge */}
            <div style={{ marginBottom: 20 }}>
              <span style={{
                background: `${BLUE}18`, color: BLUE2,
                fontSize: 11, fontWeight: 600, letterSpacing: 1,
                textTransform: 'uppercase', padding: '5px 14px',
                borderRadius: 20, border: `1px solid ${BLUE}33`,
              }}>
                ✦ Professional English Training for Hospitality
              </span>
            </div>

            <h1 style={{ fontSize: 36, fontWeight: 800, color: TEXT, lineHeight: 1.1, margin: '0 0 14px', letterSpacing: -0.5 }}>
              Your team.<br />
              <span style={{ color: BLUE }}>Perfectly prepared.</span>
            </h1>
            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: '0 0 22px' }}>
              From menu knowledge to POS mastery — train smarter, serve better, and keep every guest coming back.
            </p>

            {/* Instructor card */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: SURF,
              border: `1px solid ${BORD}`,
              borderLeft: `3px solid ${BLUE}`,
              borderRadius: 12, padding: '13px 15px', marginBottom: 10,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,${BLUE}40,transparent)` }} />
              <RickPhoto size={44} imgStyle={{ border: `2px solid ${BLUE}44` }} fallbackStyle={{ background: `${BLUE}18`, color: BLUE }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Rick</span>
                  <span style={{
                    fontSize: 9, color: '#4ade80', background: 'rgba(74,222,128,0.1)',
                    border: '1px solid rgba(74,222,128,0.25)', borderRadius: 4,
                    padding: '1px 7px', fontWeight: 700,
                  }}>● ONLINE</span>
                </div>
                <div style={{ fontSize: 11, color: MUTED }}>AI Instructor · Available 24/7</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: TEXT, lineHeight: 1 }}>10</div>
                <div style={{ fontSize: 9, color: MUTED, fontWeight: 600, letterSpacing: 1 }}>MODULES</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[['🎯', 'CEFR Certified'], ['🤖', 'GPT-4.1 AI'], ['📱', 'Mobile First']].map(([icon, label]) => (
                <div key={label as string} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  background: SURF, border: `1px solid ${BORD}`,
                  borderRadius: 8, padding: '8px 4px',
                }}>
                  <span style={{ fontSize: 12 }}>{icon}</span>
                  <span style={{ fontSize: 9, color: MUTED, fontWeight: 600 }}>{label as string}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section label ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '28px 20px 12px', animation: 'fadeUp 0.4s 0.1s ease both' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: 2, whiteSpace: 'nowrap' }}>TRAINING MODULES</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${BORD},transparent)` }} />
          </div>

          {/* ── Module cards ── */}
          <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {MODULES.map((mod, i) => {
              const active = activeCard === mod.id
              return (
                <div
                  key={mod.id}
                  onClick={e => handleNav(e, mod)}
                  onMouseEnter={() => { setActiveCard(mod.id); playClick(mod.freq + 160) }}
                  onMouseLeave={() => setActiveCard(null)}
                  style={{
                    position: 'relative', overflow: 'hidden',
                    background: active ? `${SURF}` : `${NAV}`,
                    border: `1px solid ${active ? mod.color + '40' : BORD}`,
                    borderLeft: `3px solid ${active ? mod.color : mod.color + '55'}`,
                    borderRadius: 12, padding: '13px 14px',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    transform: active ? 'translateX(2px)' : 'none',
                    boxShadow: active ? `0 4px 24px ${mod.color}14` : 'none',
                    animation: `fadeUp 0.35s ${i * 0.04 + 0.14}s ease both`,
                  }}
                >
                  {active && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,${mod.color}50,transparent)` }} />}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                      background: `${mod.color}12`,
                      border: `1px solid ${active ? mod.color + '40' : mod.color + '20'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                      transition: 'all 0.15s',
                    }}>
                      {mod.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: active ? mod.color : MUTED, letterSpacing: 1.5 }}>{mod.label}</span>
                        {mod.badge && (
                          <span style={{ fontSize: 8, fontWeight: 800, color: mod.color, background: `${mod.color}15`, border: `1px solid ${mod.color}30`, borderRadius: 4, padding: '1px 6px', letterSpacing: 0.5 }}>{mod.badge}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: active ? TEXT : '#C5D8EC', marginBottom: 3 }}>{mod.name}</div>
                      <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.45, marginBottom: 6 }}>{mod.desc}</div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {mod.meta.split(' · ').map(m => (
                          <span key={m} style={{ fontSize: 9, color: MUTED, background: SURF, border: `1px solid ${BORD}`, borderRadius: 4, padding: '2px 7px', fontWeight: 500 }}>{m}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ fontSize: 18, color: active ? mod.color : BORD, transition: 'color 0.15s', flexShrink: 0 }}>›</div>
                  </div>

                  {sparks.map(s => (
                    <div key={s.id} style={{
                      position: 'absolute', left: s.x, top: s.y,
                      width: 4, height: 4, borderRadius: '50%', background: s.color,
                      pointerEvents: 'none',
                      // @ts-expect-error CSS vars
                      '--dx': `${Math.cos(s.angle * Math.PI / 180) * 28}px`,
                      '--dy': `${Math.sin(s.angle * Math.PI / 180) * 28}px`,
                      animation: 'sparkFly 0.5s ease-out forwards',
                    }} />
                  ))}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '24px 20px 0', textAlign: 'center', animation: 'fadeUp 0.4s 0.45s ease both' }}>
            <p style={{ fontSize: 11, color: BORD, letterSpacing: 1 }}>
              waiter<span style={{ color: BLUE }}>ai</span> · powered by GPT-4.1 · v2.0
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
