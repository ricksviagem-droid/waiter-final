'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getDailyQuestions, getTodayKey, type DrillQuestion } from '@/lib/daily-drill/data'

const P = '#f472b6'
const PB = 'rgba(244,114,182,0.22)'
const PBG = 'rgba(244,114,182,0.07)'
const G = '#00dc82'

type Phase = 'intro' | 'drill' | 'result'

function playSound(type: 'correct' | 'wrong' | 'click') {
  try {
    const ctx = new AudioContext()
    const notes: Record<string, [number, number][]> = {
      correct: [[523, 0], [659, 0.12], [784, 0.24]],
      wrong:   [[280, 0], [220, 0.15]],
      click:   [[660, 0]],
    }
    notes[type].forEach(([freq, delay]) => {
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.type = type === 'wrong' ? 'sawtooth' : 'sine'
      o.frequency.value = freq
      const t = ctx.currentTime + delay
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.08, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
      o.start(t); o.stop(t + 0.28)
    })
  } catch {}
}

export default function DailyDrillPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [questions] = useState<DrillQuestion[]>(() => getDailyQuestions())
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [xp, setXp] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [alreadyDone, setAlreadyDone] = useState(false)

  useEffect(() => {
    try {
      const todayKey = getTodayKey()
      const lastKey = localStorage.getItem('onduty_drill_lastday')
      const savedStreak = parseInt(localStorage.getItem('onduty_drill_streak') || '0')
      setStreak(savedStreak)
      if (lastKey === todayKey) setAlreadyDone(true)
    } catch {}
  }, [])

  const q = questions[qIdx]
  const isLast = qIdx === questions.length - 1

  function confirm() {
    if (selected === null || confirmed) return
    const isCorrect = selected === q.correct
    playSound(isCorrect ? 'correct' : 'wrong')
    setConfirmed(true)
    if (isCorrect) { setXp(p => p + q.xp); setCorrect(c => c + 1) }
  }

  function next() {
    if (isLast) {
      finishDrill()
    } else {
      setQIdx(i => i + 1)
      setSelected(null)
      setConfirmed(false)
    }
  }

  function finishDrill() {
    try {
      const todayKey = getTodayKey()
      const lastKey = localStorage.getItem('onduty_drill_lastday')
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
      const yKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`
      const newStreak = lastKey === yKey ? streak + 1 : 1
      localStorage.setItem('onduty_drill_streak', String(newStreak))
      localStorage.setItem('onduty_drill_lastday', todayKey)
      setStreak(newStreak)
    } catch {}
    setPhase('result')
  }

  const grade = correct === 5 ? 'PERFECT' : correct >= 4 ? 'EXCELLENT' : correct >= 3 ? 'GOOD' : correct >= 2 ? 'KEEP GOING' : 'PRACTICE MORE'
  const gradeColor = correct === 5 ? G : correct >= 3 ? P : '#f59e0b'

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#2a1a2a; border-radius:3px; }
      `}</style>

      <div style={{ minHeight:'100dvh', background:'linear-gradient(160deg,#0c080f 0%,#100810 50%,#0c080f 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-geist-sans,Arial,sans-serif)' }}>
        <div style={{ width:'100%', maxWidth:430, height:'100dvh', maxHeight:900, background:'#0f0a14', display:'flex', flexDirection:'column', border:`1px solid ${PB}`, overflow:'hidden' }}>

          {/* Header */}
          <div style={{ background:'rgba(10,6,14,0.98)', borderBottom:`1px solid ${PB}`, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <button onClick={() => router.push('/')} style={{ background:'transparent', border:'none', color:'#4a3a5a', cursor:'pointer', fontSize:18, padding:0, lineHeight:1 }}>←</button>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'#e8edf2' }}>Daily Drill <span style={{ fontSize:9, color:P, background:PBG, border:`1px solid ${PB}`, borderRadius:4, padding:'1px 6px', marginLeft:4 }}>DAILY</span></div>
                <div style={{ fontSize:10, color:'#4a3a5a' }}>5-minute English training</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              {streak > 0 && <span style={{ fontSize:13, fontWeight:800, color:P }}>🔥 {streak}</span>}
              {phase === 'drill' && <span style={{ fontSize:11, color:'#4a3a5a' }}>{qIdx + 1}/5</span>}
            </div>
          </div>

          {/* Progress bar */}
          {phase === 'drill' && (
            <div style={{ height:3, background:'rgba(244,114,182,0.1)', flexShrink:0 }}>
              <div style={{ height:3, background:`linear-gradient(90deg,${P},#a855f7)`, width:`${((qIdx + (confirmed ? 1 : 0)) / 5) * 100}%`, transition:'width 0.4s ease' }} />
            </div>
          )}

          {/* ── INTRO ── */}
          {phase === 'intro' && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'28px 24px', gap:20, overflowY:'auto', animation:'fadeIn 0.4s ease' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:52, marginBottom:12, animation:'pop 0.5s ease' }}>🔥</div>
                <h1 style={{ fontSize:26, fontWeight:900, color:'#e8edf2', letterSpacing:1, marginBottom:8 }}>Daily Drill</h1>
                <p style={{ fontSize:13, color:P, fontStyle:'italic', marginBottom:0 }}>"5 minutes. Every day. That\'s how you improve."</p>
              </div>

              {streak > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(244,114,182,0.07)', border:`1px solid ${PB}`, borderRadius:14, padding:'12px 16px', width:'100%', animation:'pop 0.4s 0.1s ease both', opacity:0 }}>
                  <span style={{ fontSize:24 }}>🔥</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:P }}>{streak} Day Streak</div>
                    <div style={{ fontSize:11, color:'#4a3a5a' }}>Keep it going — come back tomorrow</div>
                  </div>
                </div>
              )}

              {alreadyDone && (
                <div style={{ background:'rgba(0,220,130,0.07)', border:'1px solid rgba(0,220,130,0.2)', borderRadius:12, padding:'12px 16px', width:'100%', textAlign:'center' }}>
                  <div style={{ fontSize:13, color:G, fontWeight:700 }}>✓ Today\'s drill completed</div>
                  <div style={{ fontSize:11, color:'#304a30', marginTop:3 }}>Come back tomorrow for a new set</div>
                </div>
              )}

              <div style={{ background:PBG, border:`1px solid ${PB}`, borderRadius:14, padding:'14px 16px', width:'100%' }}>
                <div style={{ fontSize:10, color:P, fontWeight:700, letterSpacing:2, marginBottom:10 }}>TODAY\'S SESSION</div>
                {[['❓','5 questions','Hospitality English'],['⏱','~5 minutes','No time pressure'],['💡','Answer revealed','Learn from every question'],['🔥','+100 XP','Keep your streak alive']].map(([icon, label, sub]) => (
                  <div key={label as string} style={{ display:'flex', gap:10, marginBottom:8, alignItems:'center' }}>
                    <span style={{ fontSize:14, flexShrink:0 }}>{icon}</span>
                    <div>
                      <span style={{ fontSize:12, fontWeight:700, color:'#e8edf2' }}>{label}</span>
                      <span style={{ fontSize:11, color:'#4a3a5a', marginLeft:6 }}>{sub as string}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { playSound('click'); setPhase('drill') }}
                style={{ width:'100%', padding:'15px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${P},#a855f7)`, color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', letterSpacing:2, boxShadow:`0 0 28px rgba(244,114,182,0.35)` }}>
                {alreadyDone ? 'PRACTICE AGAIN' : 'START DRILL'}
              </button>
            </div>
          )}

          {/* ── DRILL ── */}
          {phase === 'drill' && q && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'18px 16px', gap:14, overflowY:'auto', animation:'fadeIn 0.3s ease' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:9, color:P, fontWeight:700, letterSpacing:2, background:PBG, border:`1px solid ${PB}`, borderRadius:4, padding:'2px 7px' }}>{q.category.toUpperCase()}</span>
                <span style={{ fontSize:10, color:'#2a1a2a' }}>+{q.xp} XP</span>
              </div>

              <div style={{ background:PBG, border:`1px solid ${PB}`, borderRadius:14, padding:'16px' }}>
                <p style={{ fontSize:15, fontWeight:700, color:'#e8edf2', lineHeight:1.6, margin:0 }}>{q.question}</p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {q.options.map((opt, i) => {
                  let bg = 'rgba(15,10,20,0.8)', border = 'rgba(255,255,255,0.07)', color = '#8a7a9a'
                  if (selected === i && !confirmed) { bg = PBG; border = P; color = '#e8edf2' }
                  if (confirmed) {
                    if (i === q.correct) { bg = 'rgba(0,220,130,0.1)'; border = G; color = G }
                    else if (i === selected && i !== q.correct) { bg = 'rgba(248,113,113,0.1)'; border = '#f87171'; color = '#f87171' }
                  }
                  return (
                    <button key={i} onClick={() => { if (!confirmed) { setSelected(i); playSound('click') } }}
                      style={{ padding:'13px 15px', borderRadius:12, border:`1px solid ${border}`, background:bg, color, fontSize:12, cursor: confirmed ? 'default' : 'pointer', textAlign:'left', fontWeight: selected === i ? 700 : 400, transition:'all 0.15s', lineHeight:1.5 }}>
                      <span style={{ fontWeight:800, marginRight:8, fontSize:11 }}>{['A','B','C','D'][i]}.</span>{opt}
                    </button>
                  )
                })}
              </div>

              {!confirmed ? (
                <button onClick={confirm} disabled={selected === null}
                  style={{ padding:'14px', borderRadius:12, border:'none', background: selected !== null ? `linear-gradient(135deg,${P},#a855f7)` : 'rgba(244,114,182,0.08)', color: selected !== null ? '#fff' : '#3a2a4a', fontSize:13, fontWeight:800, cursor: selected !== null ? 'pointer' : 'default', letterSpacing:1 }}>
                  CONFIRM ANSWER
                </button>
              ) : (
                <div style={{ animation:'fadeIn 0.3s ease' }}>
                  <div style={{ background: selected === q.correct ? 'rgba(0,220,130,0.07)' : 'rgba(248,113,113,0.07)', border:`1px solid ${selected === q.correct ? 'rgba(0,220,130,0.25)' : 'rgba(248,113,113,0.25)'}`, borderRadius:12, padding:'14px', marginBottom:10 }}>
                    <div style={{ fontSize:11, fontWeight:800, color: selected === q.correct ? G : '#f87171', marginBottom:6, letterSpacing:1 }}>
                      {selected === q.correct ? '✓ CORRECT' : '✗ INCORRECT'}
                    </div>
                    <p style={{ fontSize:12, color:'#a89ab8', lineHeight:1.65, margin:0 }}>{q.reveal}</p>
                  </div>
                  <button onClick={next}
                    style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${P},#a855f7)`, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', letterSpacing:1 }}>
                    {isLast ? 'SEE RESULTS →' : 'NEXT QUESTION →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── RESULT ── */}
          {phase === 'result' && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'28px 24px', gap:18, overflowY:'auto', animation:'fadeIn 0.5s ease', textAlign:'center' }}>
              <div style={{ fontSize:52, animation:'pop 0.5s ease' }}>{correct === 5 ? '🏆' : correct >= 3 ? '⭐' : '💪'}</div>

              <div>
                <div style={{ fontSize:11, color:P, fontWeight:700, letterSpacing:3, marginBottom:8 }}>DRILL COMPLETE</div>
                <div style={{ fontSize:28, fontWeight:900, color:gradeColor, letterSpacing:1, marginBottom:4, animation:'pop 0.4s 0.1s ease both', opacity:0 }}>{grade}</div>
                <div style={{ fontSize:13, color:'#4a3a5a' }}>{correct}/5 correct · {xp} XP earned</div>
              </div>

              <div style={{ display:'flex', gap:12, width:'100%' }}>
                <div style={{ flex:1, background:PBG, border:`1px solid ${PB}`, borderRadius:12, padding:'14px', textAlign:'center' }}>
                  <div style={{ fontSize:26, fontWeight:900, color:P }}>{correct}/5</div>
                  <div style={{ fontSize:10, color:'#4a3a5a', fontWeight:700, marginTop:2 }}>CORRECT</div>
                </div>
                <div style={{ flex:1, background:'rgba(0,220,130,0.07)', border:'1px solid rgba(0,220,130,0.2)', borderRadius:12, padding:'14px', textAlign:'center' }}>
                  <div style={{ fontSize:26, fontWeight:900, color:G }}>{xp}</div>
                  <div style={{ fontSize:10, color:'#2a4a2a', fontWeight:700, marginTop:2 }}>XP EARNED</div>
                </div>
                <div style={{ flex:1, background:'rgba(244,114,182,0.07)', border:`1px solid ${PB}`, borderRadius:12, padding:'14px', textAlign:'center' }}>
                  <div style={{ fontSize:26, fontWeight:900, color:P }}>🔥{streak}</div>
                  <div style={{ fontSize:10, color:'#4a3a5a', fontWeight:700, marginTop:2 }}>STREAK</div>
                </div>
              </div>

              <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:8 }}>
                <button onClick={() => router.push('/')}
                  style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${P},#a855f7)`, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', letterSpacing:2 }}>
                  BACK TO ON DUTY
                </button>
                <button onClick={() => { setPhase('drill'); setQIdx(0); setSelected(null); setConfirmed(false); setXp(0); setCorrect(0) }}
                  style={{ width:'100%', padding:'13px', borderRadius:12, border:`1px solid ${PB}`, background:'transparent', color:'#4a3a5a', fontSize:12, cursor:'pointer' }}>
                  Practice again
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
