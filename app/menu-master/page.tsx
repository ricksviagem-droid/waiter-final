'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { MenuQuestion } from '@/app/api/menu-master/generate/route'

const T = '#2dd4bf'
const TB = 'rgba(45,212,191,0.22)'
const TBG = 'rgba(45,212,191,0.07)'

type Phase = 'upload' | 'generating' | 'quiz' | 'result'

function playSound(type: 'correct' | 'wrong' | 'click') {
  try {
    const ctx = new AudioContext()
    const notes: Record<string, [number, number][]> = {
      correct: [[523, 0], [659, 0.12], [784, 0.24]],
      wrong:   [[300, 0], [220, 0.14]],
      click:   [[750, 0]],
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

const EXAMPLE_MENU = `STARTERS
Burrata & Heirloom Tomatoes — £14
Fresh burrata, heritage tomatoes, basil oil, aged balsamic. Contains: dairy. Vegan option available.

Tuna Tartare — £18
Hand-cut yellowfin tuna, avocado, sesame, soy, pickled ginger, crispy wontons. Contains: fish, sesame, soy, gluten.

MAINS
Pan-Seared Sea Bass — £32
Fillet of sea bass, lemon butter sauce, wilted spinach, saffron potato. Contains: fish, dairy.

Wagyu Beef Fillet (200g) — £68
A5 Wagyu, truffle jus, pommes purée, asparagus, bone marrow butter. Contains: dairy.

DESSERTS
Chocolate Fondant — £11
Dark 72% Valrhona chocolate, vanilla ice cream, salted caramel. Contains: gluten, dairy, eggs.

WINES BY THE GLASS
Chablis Premier Cru 2021 — £16 | Pairs with: seafood, salads
Barolo Riserva 2018 — £22 | Pairs with: red meat, aged cheese`

export default function MenuMasterPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('upload')
  const [menuText, setMenuText] = useState('')
  const [menuName, setMenuName] = useState('')
  const [questions, setQuestions] = useState<MenuQuestion[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [extracting, setExtracting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const q = questions[qIdx]
  const total = questions.length
  const isLast = qIdx === total - 1

  async function generate() {
    if (menuText.trim().length < 30) { setErrorMsg('Please add more menu content (at least a few dishes).'); return }
    setErrorMsg(''); setPhase('generating')
    try {
      const res = await fetch('/api/menu-master/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuText }),
      })
      const data = await res.json()
      if (data.error || !data.questions?.length) throw new Error(data.error || 'No questions generated')
      setQuestions(data.questions)
      setQIdx(0); setSelected(null); setConfirmed(false); setScore(0); setCorrect(0)
      setPhase('quiz')
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Failed to generate quiz. Please try again.')
      setPhase('upload')
    }
  }

  const TEXT_EXTS = /\.(txt|md|csv|tsv|json|xml|rtf|html?)$/i

  async function loadFile(file: File) {
    const name = file.name.replace(/\.[^.]+$/, '')
    if (!menuName) setMenuName(name)

    // Plain text: read client-side
    if (TEXT_EXTS.test(file.name) || file.type.startsWith('text/')) {
      const reader = new FileReader()
      reader.onload = e => setMenuText((e.target?.result as string) || '')
      reader.readAsText(file)
      return
    }

    // PDF, images, DOCX: server-side extraction via OpenAI
    setExtracting(true)
    setErrorMsg('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/menu-master/extract', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMenuText(data.text || '')
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Failed to read file')
    } finally {
      setExtracting(false)
    }
  }

  function confirm() {
    if (selected === null || confirmed || !q) return
    const isCorrect = selected === q.correct
    playSound(isCorrect ? 'correct' : 'wrong')
    setConfirmed(true)
    if (isCorrect) { setScore(s => s + q.points); setCorrect(c => c + 1) }
  }

  function next() {
    if (isLast) { setPhase('result') } else {
      setQIdx(i => i + 1); setSelected(null); setConfirmed(false)
    }
  }

  function restart() {
    setQIdx(0); setSelected(null); setConfirmed(false)
    setScore(0); setCorrect(0); setPhase('quiz')
  }

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const grade = pct === 100 ? '🏆 MENU MASTERED' : pct >= 80 ? '⭐ EXCELLENT' : pct >= 60 ? '✓ GOOD' : pct >= 40 ? '📖 KEEP STUDYING' : '🔄 REVIEW NEEDED'
  const gradeColor = pct >= 80 ? T : pct >= 60 ? '#00dc82' : pct >= 40 ? '#f59e0b' : '#f87171'

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#0a2a2a; border-radius:3px; }
      `}</style>

      <div style={{ minHeight:'100dvh', background:'linear-gradient(160deg,#04100f 0%,#061414 50%,#04100f 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-geist-sans,Arial,sans-serif)' }}>
        <div style={{ width:'100%', maxWidth:430, height:'100dvh', maxHeight:900, background:'#060e0d', display:'flex', flexDirection:'column', border:`1px solid ${TB}`, overflow:'hidden' }}>

          {/* Header */}
          <div style={{ background:'rgba(4,10,10,0.98)', borderBottom:`1px solid ${TB}`, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <button onClick={() => router.push('/')} style={{ background:'transparent', border:'none', color:'#2a4a4a', cursor:'pointer', fontSize:18, padding:0, lineHeight:1 }}>←</button>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:800, color:'#d4f0ec' }}>📋 Menu Master <span style={{ fontSize:8, color:T, background:TBG, border:`1px solid ${TB}`, borderRadius:4, padding:'1px 6px', marginLeft:4 }}>B2B</span></div>
              <div style={{ fontSize:10, color:'#2a4a4a' }}>Upload menu → AI generates your quiz</div>
            </div>
            {phase === 'quiz' && <span style={{ fontSize:11, color:'#2a4a4a' }}>{qIdx + 1}/{total}</span>}
          </div>

          {/* Progress */}
          {phase === 'quiz' && (
            <div style={{ height:3, background:'rgba(45,212,191,0.08)', flexShrink:0 }}>
              <div style={{ height:3, background:`linear-gradient(90deg,${T},#06b6d4)`, width:`${((qIdx + (confirmed ? 1 : 0)) / total) * 100}%`, transition:'width 0.4s ease' }} />
            </div>
          )}

          {/* ── UPLOAD ── */}
          {phase === 'upload' && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'18px 16px', gap:14, overflowY:'auto', animation:'fadeIn 0.4s ease' }}>
              <div style={{ background:TBG, border:`1px solid ${TB}`, borderRadius:14, padding:'14px', textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
                <div style={{ fontSize:15, fontWeight:800, color:'#d4f0ec', marginBottom:4 }}>Menu Master</div>
                <div style={{ fontSize:12, color:'#2a5a55', lineHeight:1.6 }}>
                  Paste your food bible, drink bible or wine list below. The AI will generate a quiz to help your team memorise every detail.
                </div>
              </div>

              {/* Menu name */}
              <div>
                <div style={{ fontSize:10, color:T, fontWeight:700, letterSpacing:2, marginBottom:6 }}>MENU NAME (optional)</div>
                <input
                  value={menuName} onChange={e => setMenuName(e.target.value)}
                  placeholder="e.g. Summer 2025 Food Bible"
                  style={{ width:'100%', background:'rgba(45,212,191,0.04)', border:`1px solid ${TB}`, borderRadius:10, padding:'10px 12px', fontSize:13, color:'#d4f0ec', outline:'none', fontFamily:'inherit' }}
                />
              </div>

              {/* Text area */}
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <div style={{ fontSize:10, color:T, fontWeight:700, letterSpacing:2 }}>MENU CONTENT</div>
                  <button onClick={() => setMenuText(EXAMPLE_MENU)}
                    style={{ fontSize:10, color:'#2a5a55', background:'transparent', border:'none', cursor:'pointer', textDecoration:'underline' }}>
                    Load example
                  </button>
                </div>
                <textarea
                  value={menuText} onChange={e => setMenuText(e.target.value)}
                  placeholder="Paste your full menu here — dish names, ingredients, prices, descriptions, allergens, wine list…"
                  rows={10}
                  style={{ width:'100%', background:'rgba(45,212,191,0.03)', border:`1px solid ${menuText.length > 50 ? T : TB}`, borderRadius:12, padding:'12px', fontSize:12, color:'#c4e8e4', resize:'vertical', fontFamily:'inherit', lineHeight:1.65, outline:'none', transition:'border-color 0.2s' }}
                />
                <div style={{ fontSize:10, color:'#2a4a4a', marginTop:4 }}>{menuText.trim().split(/\s+/).filter(Boolean).length} words · {menuText.length} characters</div>
              </div>

              {/* File upload */}
              <div>
                <input ref={fileRef} type="file"
                  accept=".txt,.md,.csv,.tsv,.json,.xml,.rtf,.pdf,.doc,.docx,.odt,.png,.jpg,.jpeg,.webp,.gif"
                  style={{ display:'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = '' }} />
                <button onClick={() => fileRef.current?.click()} disabled={extracting}
                  style={{ width:'100%', padding:'11px', borderRadius:10, border:`1px dashed ${extracting ? T : TB}`, background: extracting ? `${T}08` : 'transparent', color: extracting ? T : '#4a8a84', fontSize:12, cursor: extracting ? 'default' : 'pointer', fontWeight:600, transition:'all 0.2s' }}>
                  {extracting ? '⏳ Reading file...' : '📁 Upload PDF, image, DOCX, TXT, CSV…'}
                </button>
                <div style={{ fontSize:9, color:'#1a3a38', textAlign:'center', marginTop:5 }}>
                  Supported: PDF · DOCX · PNG/JPG · TXT · CSV · MD and more
                </div>
              </div>

              {errorMsg && (
                <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:10, padding:'10px 12px', fontSize:12, color:'#f87171' }}>{errorMsg}</div>
              )}

              <button onClick={generate} disabled={menuText.trim().length < 30 || extracting}
                style={{ width:'100%', padding:'15px', borderRadius:14, border:'none', background: menuText.trim().length >= 30 ? `linear-gradient(135deg,${T},#06b6d4)` : TBG, color: menuText.trim().length >= 30 ? '#04100f' : '#1a4a4a', fontSize:14, fontWeight:900, cursor: menuText.trim().length >= 30 ? 'pointer' : 'default', letterSpacing:2, boxShadow: menuText.trim().length >= 30 ? `0 0 24px rgba(45,212,191,0.3)` : 'none', transition:'all 0.2s' }}>
                GENERATE QUIZ →
              </button>

              <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10, padding:'10px 12px' }}>
                <div style={{ fontSize:10, color:'#2a4a4a', fontWeight:700, marginBottom:6 }}>WHAT GETS GENERATED</div>
                {['15 MCQ questions from your menu', 'Ingredients, allergens, prices, descriptions', 'Correct answer revealed after each response', 'Score + performance grade at the end'].map(i => (
                  <div key={i} style={{ fontSize:11, color:'#2a5a55', marginBottom:3 }}>✓ {i}</div>
                ))}
              </div>
            </div>
          )}

          {/* ── GENERATING ── */}
          {phase === 'generating' && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:32, animation:'fadeIn 0.3s ease' }}>
              <div style={{ position:'relative', width:72, height:72 }}>
                <div style={{ width:72, height:72, border:`3px solid ${T}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                <div style={{ position:'absolute', inset:10, border:'2px solid rgba(45,212,191,0.3)', borderBottomColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite reverse' }} />
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>📋</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:15, fontWeight:700, color:'#d4f0ec', marginBottom:6 }}>Reading your menu…</div>
                <div style={{ fontSize:12, color:'#2a5a55', marginBottom:4 }}>AI is generating 15 quiz questions</div>
                <div style={{ fontSize:11, color:'#1a3a3a' }}>This takes about 10–20 seconds</div>
              </div>
            </div>
          )}

          {/* ── QUIZ ── */}
          {phase === 'quiz' && q && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'16px', gap:12, overflowY:'auto', animation:'fadeIn 0.3s ease' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:9, color:T, fontWeight:700, letterSpacing:2, background:TBG, border:`1px solid ${TB}`, borderRadius:4, padding:'2px 7px' }}>{q.category?.toUpperCase() || 'MENU'}</span>
                <span style={{ fontSize:10, color:'#1a4a4a' }}>+{q.points} pts</span>
                <span style={{ marginLeft:'auto', fontSize:10, color:'#1a4a4a' }}>{score} pts total</span>
              </div>

              <div style={{ background:TBG, border:`1px solid ${TB}`, borderRadius:14, padding:'15px' }}>
                <p style={{ fontSize:14, fontWeight:700, color:'#d4f0ec', lineHeight:1.65, margin:0 }}>{q.question}</p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                {q.options.map((opt, i) => {
                  let bg = 'rgba(4,16,15,0.8)', border = 'rgba(255,255,255,0.07)', color = '#6a8a88'
                  if (selected === i && !confirmed) { bg = TBG; border = T; color = '#d4f0ec' }
                  if (confirmed) {
                    if (i === q.correct) { bg = 'rgba(0,220,130,0.1)'; border = '#00dc82'; color = '#00dc82' }
                    else if (i === selected && i !== q.correct) { bg = 'rgba(248,113,113,0.1)'; border = '#f87171'; color = '#f87171' }
                  }
                  return (
                    <button key={i} onClick={() => { if (!confirmed) { setSelected(i); playSound('click') } }}
                      style={{ padding:'12px 14px', borderRadius:11, border:`1px solid ${border}`, background:bg, color, fontSize:12, cursor: confirmed ? 'default' : 'pointer', textAlign:'left', fontWeight: selected === i ? 700 : 400, transition:'all 0.15s', lineHeight:1.5 }}>
                      <span style={{ fontWeight:800, marginRight:8, fontSize:11 }}>{['A','B','C','D'][i]}.</span>{opt}
                    </button>
                  )
                })}
              </div>

              {!confirmed ? (
                <button onClick={confirm} disabled={selected === null}
                  style={{ padding:'14px', borderRadius:12, border:'none', background: selected !== null ? `linear-gradient(135deg,${T},#06b6d4)` : TBG, color: selected !== null ? '#04100f' : '#1a4a4a', fontSize:13, fontWeight:800, cursor: selected !== null ? 'pointer' : 'default', letterSpacing:1, marginTop:4 }}>
                  CONFIRM ANSWER
                </button>
              ) : (
                <div style={{ animation:'fadeIn 0.3s ease' }}>
                  <div style={{ background: selected === q.correct ? 'rgba(0,220,130,0.07)' : 'rgba(248,113,113,0.07)', border:`1px solid ${selected === q.correct ? 'rgba(0,220,130,0.25)' : 'rgba(248,113,113,0.25)'}`, borderRadius:12, padding:'13px', marginBottom:10 }}>
                    <div style={{ fontSize:10, fontWeight:800, color: selected === q.correct ? '#00dc82' : '#f87171', marginBottom:6, letterSpacing:1 }}>
                      {selected === q.correct ? '✓ CORRECT' : '✗ INCORRECT'}
                    </div>
                    <p style={{ fontSize:12, color:'#6a9a98', lineHeight:1.65, margin:0 }}>{q.reveal}</p>
                  </div>
                  <button onClick={next}
                    style={{ width:'100%', padding:'13px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${T},#06b6d4)`, color:'#04100f', fontSize:13, fontWeight:800, cursor:'pointer', letterSpacing:1 }}>
                    {isLast ? 'SEE RESULTS →' : 'NEXT QUESTION →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── RESULT ── */}
          {phase === 'result' && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'28px 24px', gap:18, overflowY:'auto', animation:'fadeIn 0.5s ease', textAlign:'center' }}>
              <div style={{ fontSize:52, animation:'pop 0.5s ease' }}>{pct === 100 ? '🏆' : pct >= 80 ? '⭐' : pct >= 60 ? '✅' : '📖'}</div>

              <div>
                <div style={{ fontSize:11, color:T, fontWeight:700, letterSpacing:3, marginBottom:8 }}>QUIZ COMPLETE{menuName ? ` — ${menuName.toUpperCase()}` : ''}</div>
                <div style={{ fontSize:24, fontWeight:900, color:gradeColor, letterSpacing:0.5, marginBottom:4, animation:'pop 0.4s 0.1s ease both', opacity:0 }}>{grade}</div>
                <div style={{ fontSize:13, color:'#2a5a55' }}>{correct}/{total} correct · {score} points</div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, width:'100%' }}>
                {[
                  { label:'CORRECT', value:`${correct}/${total}`, color:T },
                  { label:'SCORE', value:`${pct}%`, color: pct >= 80 ? T : pct >= 60 ? '#00dc82' : '#f59e0b' },
                  { label:'POINTS', value:String(score), color:'#00dc82' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background:TBG, border:`1px solid ${TB}`, borderRadius:12, padding:'12px 6px' }}>
                    <div style={{ fontSize:18, fontWeight:900, color }}>{value}</div>
                    <div style={{ fontSize:9, color:'#1a4a4a', fontWeight:700, marginTop:2 }}>{label}</div>
                  </div>
                ))}
              </div>

              {pct < 80 && (
                <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:12, padding:'12px', width:'100%' }}>
                  <div style={{ fontSize:11, color:T, fontWeight:700, marginBottom:4 }}>💡 Keep practising</div>
                  <div style={{ fontSize:12, color:'#2a5a55' }}>Score below 80%? Retake the quiz until you know every dish by heart.</div>
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:8, width:'100%' }}>
                <button onClick={restart}
                  style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${T},#06b6d4)`, color:'#04100f', fontSize:13, fontWeight:900, cursor:'pointer', letterSpacing:1 }}>
                  RETAKE QUIZ
                </button>
                <button onClick={() => { setPhase('upload'); setMenuText(''); setMenuName('') }}
                  style={{ width:'100%', padding:'13px', borderRadius:12, border:`1px solid ${TB}`, background:'transparent', color:'#2a5a55', fontSize:12, cursor:'pointer', fontWeight:700 }}>
                  Upload a new menu
                </button>
                <button onClick={() => router.push('/')}
                  style={{ padding:'11px', borderRadius:10, border:'1px solid rgba(255,255,255,0.05)', background:'transparent', color:'#2a4a4a', fontSize:11, cursor:'pointer' }}>
                  Back to ON DUTY
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
