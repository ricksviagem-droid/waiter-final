'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SCENARIOS, DEMO_MENU, ALL_ITEMS, generateScenarios, type PosScenario, type PosMenuItem } from '@/lib/pos/data'

// ── Colors ──────────────────────────────────────────────────────────────────
const A  = '#f59e0b'
const BG = '#0a0c09'

// ── Sounds ───────────────────────────────────────────────────────────────────
function playPOS(type: 'open'|'add'|'error'|'comment'|'hold'|'fire'|'send') {
  try {
    const ctx = new AudioContext()
    const g = ctx.createGain()
    g.connect(ctx.destination)
    const notes: Record<string,[number,number,number][]> = {
      open:    [[880,0,0.06],[1100,0.1,0.06]],
      add:     [[660,0,0.05]],
      error:   [[220,0,0.1],[160,0.15,0.1]],
      comment: [[750,0,0.04],[950,0.1,0.04]],
      hold:    [[400,0,0.06],[300,0.12,0.06]],
      fire:    [[440,0,0.05],[660,0.09,0.05],[880,0.18,0.07]],
      send:    [[523,0,0.06],[659,0.12,0.06],[784,0.24,0.07]],
    }
    notes[type].forEach(([freq,delay,vol])=>{
      const o=ctx.createOscillator(); const gn=ctx.createGain()
      o.connect(gn); gn.connect(ctx.destination)
      o.type='sine'; o.frequency.value=freq
      const t=ctx.currentTime+delay
      gn.gain.setValueAtTime(0,t)
      gn.gain.linearRampToValueAtTime(vol,t+0.02)
      gn.gain.exponentialRampToValueAtTime(0.001,t+0.25)
      o.start(t); o.stop(t+0.25)
    })
    void g
  } catch {}
}
const CAT_COLORS: Record<string,string> = {
  starter:'#22c55e', main:'#3b82f6', dessert:'#f97316', drink:'#a855f7'
}

// ── Types ────────────────────────────────────────────────────────────────────
type GamePhase = 'menu-setup' | 'intro' | 'table' | 'ordering' | 'comment' | 'fire-timer' | 'validate' | 'final'
type Category  = 'starter'|'main'|'dessert'|'drink'

interface EnteredItem {
  itemId: string; name: string; seat: number
  category: Category; comment: string; commentType: 'food'|'drink'|null; held: boolean
}

interface ScenarioResult {
  scenarioId: string; earned: number; max: number; timeLeft: number
  itemResults: Array<{ label:string; ok:boolean }>
}

// ── Keyboard layout ──────────────────────────────────────────────────────────
const KB_ROWS = ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM']
const PRESETS = [
  'RARE','MED RARE','MEDIUM','MED WELL','WELL DONE',
  'NO DAIRY','NO GLUTEN','NUT ALLERGY','NO TRUFFLE','NO SAUCE',
  'BÉARNAISE','PEPPERCORN','WITH FRIES','WITH SALAD',
  'BIRTHDAY','ANNIVERSARY',
]

// ── Validation ───────────────────────────────────────────────────────────────
function validate(scenario: PosScenario, entered: EnteredItem[], holdUsed: boolean, itemPool: PosMenuItem[] = ALL_ITEMS): ScenarioResult {
  const results: Array<{ label:string; ok:boolean }> = []
  let earned = 0
  const perItem = Math.floor(scenario.basePoints / Math.max(scenario.requiredItems.length, 1))

  for (const req of scenario.requiredItems) {
    const item = itemPool.find(i => i.id === req.itemId) || { name: req.itemId, id: req.itemId, short: req.itemId, category: 'main' as const }
    const found = entered.find(e => e.itemId === req.itemId && e.seat === req.seat)

    if (!found) {
      results.push({ label:`${item.name} (Seat ${req.seat})`, ok:false })
      continue
    }

    let ok = true
    results.push({ label:`${item.name} (Seat ${req.seat})`, ok:true })
    earned += perItem

    if (req.commentKeyword) {
      const hasComment = found.comment.toLowerCase().includes(req.commentKeyword.toLowerCase())
      results.push({ label:`Comment: "${req.commentKeyword.toUpperCase()}"`, ok:hasComment })
      if (hasComment) earned += Math.floor(perItem * 0.5)
      else ok = false
    }

    if (req.held && !found.held) {
      results.push({ label:`Hold course (Seat ${req.seat})`, ok:false })
      ok = false
    } else if (req.held) {
      results.push({ label:`Hold course (Seat ${req.seat})`, ok:true })
      earned += Math.floor(perItem * 0.3)
    }
    void ok
  }

  if (scenario.needsHold) {
    results.push({ label:'HOLD COURSE used', ok:holdUsed })
    if (holdUsed) earned += Math.floor(scenario.basePoints * 0.2)
  }

  return { scenarioId:scenario.id, earned, max:scenario.basePoints * 2, timeLeft:0, itemResults:results }
}

export default function POSPage() {
  const router = useRouter()

  // Menu state
  const [activeMenu, setActiveMenu]           = useState<Record<string, PosMenuItem[]>>(DEMO_MENU)
  const [activeScenarios, setActiveScenarios] = useState<PosScenario[]>(SCENARIOS)
  const [allItems, setAllItems]               = useState<PosMenuItem[]>(ALL_ITEMS)

  // Game state
  const [phase, setPhase]   = useState<GamePhase>('menu-setup')
  const [scenIdx, setScenIdx] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [results, setResults] = useState<ScenarioResult[]>([])

  // Timer
  const [timeLeft, setTimeLeft] = useState(120)
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null)

  // Fire-course timer
  const [fireTimerCount, setFireTimerCount] = useState(0)
  const fireTimerRef = useRef<ReturnType<typeof setInterval>|null>(null)

  // Table select
  const [tableInput, setTableInput] = useState('')
  const [tableError, setTableError] = useState(false)

  // POS state
  const [cat, setCat]     = useState<Category>('main')
  const [seat, setSeat]   = useState(1)
  const [items, setItems] = useState<EnteredItem[]>([])
  const [holdActive, setHoldActive] = useState(false)
  const [holdUsed, setHoldUsed]     = useState(false)
  const [fireUsed, setFireUsed]     = useState(false)

  // Comment overlay
  const [commentType, setCommentType] = useState<'food'|'drink'|null>(null)
  const [commentText, setCommentText] = useState('')
  const [commentItemIdx, setCommentItemIdx] = useState<number|null>(null)

  // Validate overlay
  const [lastResult, setLastResult] = useState<ScenarioResult|null>(null)

  const scenario = activeScenarios[scenIdx] || SCENARIOS[0]

  // ── Timer ──────────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const startTimer = useCallback((secs: number) => {
    stopTimer()
    setTimeLeft(secs)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { stopTimer(); return 0 }
        return t - 1
      })
    }, 1000)
  }, [stopTimer])

  useEffect(() => () => {
    stopTimer()
    if (fireTimerRef.current) clearInterval(fireTimerRef.current)
  }, [stopTimer])

  // ── Actions ────────────────────────────────────────────────────────────────
  function openTable() {
    if (parseInt(tableInput) === scenario.tableNumber) {
      setTableError(false)
      setItems([]); setHoldActive(false); setHoldUsed(false); setFireUsed(false); setSeat(1); setCat('main')
      startTimer(scenario.timeSeconds)
      playPOS('open')
      setPhase('ordering')
    } else {
      setTableError(true)
      playPOS('error')
      setTimeout(() => setTableError(false), 800)
    }
  }

  function voidItem() {
    if (items.length === 0) return
    setItems(prev => prev.slice(0, -1))
    playPOS('error')
  }

  function addItem(itemId: string, name: string) {
    setItems(prev => [...prev, { itemId, name, seat, category:cat, comment:'', commentType:null, held:holdActive }])
    playPOS('add')
  }

  function fireCourse() {
    setHoldActive(false)
    setFireUsed(true)
    setItems(prev => prev.map(it => ({ ...it, held: false })))
    playPOS('fire')
  }

  function openComment(type: 'food'|'drink') {
    const idx = items.length - 1
    if (idx < 0) return
    setCommentItemIdx(idx)
    setCommentText(items[idx].comment || '')
    setCommentType(type)
    setPhase('comment')
  }

  function confirmComment() {
    if (commentItemIdx === null) return
    setItems(prev => prev.map((it, i) =>
      i === commentItemIdx ? { ...it, comment:commentText, commentType } : it
    ))
    setCommentType(null); setCommentText(''); setCommentItemIdx(null)
    setPhase('ordering')
  }

  function toggleHold() {
    const next = !holdActive
    setHoldActive(next)
    if (next) setHoldUsed(true)
    playPOS(next ? 'hold' : 'add')
  }

  function sendOrder() {
    stopTimer()
    playPOS('send')
    const result = validate(scenario, items, holdUsed, allItems)
    result.timeLeft = timeLeft
    const bonus = Math.floor(timeLeft * 2)
    result.earned = Math.min(result.earned + bonus, result.max)
    setLastResult(result)
    setResults(prev => [...prev, result])
    setTotalScore(s => s + result.earned)

    if (holdUsed && !fireUsed) {
      setFireTimerCount(0)
      let c = 0
      fireTimerRef.current = setInterval(() => {
        c++
        setFireTimerCount(c)
        if (c >= 75) {
          if (fireTimerRef.current) clearInterval(fireTimerRef.current)
          fireTimerRef.current = null
          setFireUsed(true)
          setPhase('validate')
          playPOS('fire')
        }
      }, 1000)
      setPhase('fire-timer')
    } else {
      setPhase('validate')
    }
  }

  function confirmFireCourse() {
    if (fireTimerRef.current) { clearInterval(fireTimerRef.current); fireTimerRef.current = null }
    setFireUsed(true)
    setPhase('validate')
    playPOS('fire')
  }

  function nextScenario() {
    if (scenIdx + 1 >= activeScenarios.length) {
      setPhase('final')
    } else {
      setScenIdx(i => i + 1)
      setTableInput(''); setPhase('table')
    }
  }

  function restart() {
    setScenIdx(0); setTotalScore(0); setResults([])
    setTableInput(''); setPhase('menu-setup')
  }

  // ── Keyboard helpers ───────────────────────────────────────────────────────
  function kbPress(ch: string) { setCommentText(t => t + ch) }
  function kbBack()            { setCommentText(t => t.slice(0,-1)) }
  function kbSpace()           { setCommentText(t => t + ' ') }

  const timerPct = scenario ? timeLeft / scenario.timeSeconds : 1
  const timerColor = timerPct > 0.5 ? '#22c55e' : timerPct > 0.25 ? '#f59e0b' : '#ef4444'

  return (
    <>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        @keyframes pop{0%{transform:scale(0.85);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;background:#000}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-thumb{background:rgba(245,158,11,0.2);border-radius:2px}
      `}</style>

      <div style={{minHeight:'100dvh',background:BG,fontFamily:'var(--font-geist-sans,Arial,sans-serif)',display:'flex',flexDirection:'column',maxWidth:430,margin:'0 auto'}}>

        {/* MENU SETUP */}
        {phase==='menu-setup' && (
          <MenuSetupScreen
            onDemo={() => {
              setActiveMenu(DEMO_MENU); setActiveScenarios(SCENARIOS); setAllItems(ALL_ITEMS)
              setScenIdx(0); setTotalScore(0); setResults([]); setPhase('intro')
            }}
            onCustomMenu={(menu) => {
              const flatItems = Object.values(menu).flat()
              setActiveMenu(menu); setAllItems(flatItems)
              setActiveScenarios(generateScenarios(menu))
              setScenIdx(0); setTotalScore(0); setResults([]); setPhase('intro')
            }}
            onBack={() => router.push('/')}
          />
        )}

        {/* INTRO */}
        {phase==='intro' && <IntroScreen scenario={scenario} onStart={()=>{setTableInput('');setPhase('table')}} onBack={()=>setPhase('menu-setup')} />}

        {/* TABLE SELECT */}
        {phase==='table' && (
          <TableScreen
            scenario={scenario} scenIdx={scenIdx} total={activeScenarios.length}
            tableInput={tableInput} tableError={tableError}
            onInput={setTableInput} onOpen={openTable} onBack={()=>router.push('/')}
          />
        )}

        {/* ORDERING */}
        {phase==='ordering' && (
          <OrderingScreen
            scenario={scenario} scenIdx={scenIdx} total={activeScenarios.length} menuData={activeMenu}
            timeLeft={timeLeft} timerPct={timerPct} timerColor={timerColor}
            cat={cat} seat={seat} items={items} holdActive={holdActive}
            onCat={setCat} onSeat={setSeat} onAddItem={addItem}
            onFoodComment={()=>openComment('food')}
            onDrinkComment={()=>openComment('drink')}
            onHold={toggleHold} onFire={fireCourse} onSend={sendOrder}
            onVoid={voidItem}
          />
        )}

        {/* FIRE TIMER */}
        {phase==='fire-timer' && (
          <FireTimerScreen
            count={fireTimerCount}
            tableNumber={scenario.tableNumber}
            guestName={scenario.guestName}
            pax={scenario.pax}
            onFire={confirmFireCourse}
          />
        )}

        {/* COMMENT OVERLAY */}
        {phase==='comment' && (
          <CommentScreen
            commentType={commentType!} commentText={commentText}
            presets={PRESETS} kbRows={KB_ROWS}
            onPreset={p=>setCommentText(p)}
            onKey={kbPress} onBack={kbBack} onSpace={kbSpace}
            onCancel={()=>{setCommentType(null);setCommentText('');setPhase('ordering')}}
            onConfirm={confirmComment}
          />
        )}

        {/* VALIDATE */}
        {phase==='validate' && lastResult && (
          <ValidateScreen
            scenario={scenario} result={lastResult}
            isLast={scenIdx+1>=activeScenarios.length}
            onNext={nextScenario}
          />
        )}

        {/* FINAL */}
        {phase==='final' && (
          <FinalScreen results={results} totalScore={totalScore} onRestart={restart} onHome={()=>router.push('/')} />
        )}

      </div>
    </>
  )
}

// ── MenuSetupScreen ──────────────────────────────────────────────────────────
function MenuSetupScreen({ onDemo, onCustomMenu, onBack }: {
  onDemo: () => void
  onCustomMenu: (menu: Record<string, PosMenuItem[]>) => void
  onBack: () => void
}) {
  const [step, setStep]           = useState<'choose'|'upload'|'parsing'>('choose')
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; text: string }>>([])
  const [manualText, setManualText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [error, setError]           = useState('')
  const fileRef                     = useRef<HTMLInputElement>(null)
  const TEXT_EXTS = /\.(txt|md|csv|tsv|json|html?)$/i

  async function loadFile(file: File) {
    setError('')
    // Plain text: read directly
    if (TEXT_EXTS.test(file.name) || file.type.startsWith('text/')) {
      const reader = new FileReader()
      reader.onload = e => {
        const text = ((e.target?.result as string) || '').slice(0, 4000)
        setUploadedFiles(prev => [...prev, { name: file.name, text }])
      }
      reader.readAsText(file)
      return
    }
    // Binary: use the lightweight POS extract endpoint
    setExtracting(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/pos/extract-menu', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setUploadedFiles(prev => [...prev, { name: file.name, text: (data.text || '').slice(0, 4000) }])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to read file')
    } finally {
      setExtracting(false)
    }
  }

  function removeFile(i: number) {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))
  }

  function combinedText(): string {
    const parts = uploadedFiles.map(f => f.text)
    if (manualText.trim()) parts.push(manualText)
    return parts.join('\n\n').slice(0, 3000)
  }

  async function parseMenu() {
    const text = combinedText()
    if (text.trim().length < 20) { setError('Add a menu file or paste menu text first'); return }
    setError(''); setStep('parsing')
    try {
      const res = await fetch('/api/pos/parse-menu', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuText: text }),
      })
      const data = await res.json()
      if (data.error || !data.menu) throw new Error(data.error || 'Parse failed')
      onCustomMenu(data.menu)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to parse menu')
      setStep('upload')
    }
  }

  const canBuild = combinedText().trim().length >= 20

  if (step === 'parsing') return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:24 }}>
      <div style={{ width:48, height:48, border:`2px solid rgba(245,158,11,0.2)`, borderTop:`2px solid #f59e0b`, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <div style={{ fontSize:13, color:'rgba(245,158,11,0.7)', textAlign:'center' }}>Building your POS menu…</div>
    </div>
  )

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'18px', gap:14, overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={step==='upload' ? ()=>setStep('choose') : onBack} style={{ background:'none', border:'none', color:'rgba(245,158,11,0.5)', fontSize:18, cursor:'pointer' }}>←</button>
        <div>
          <div style={{ fontSize:7, color:'rgba(245,158,11,0.5)', letterSpacing:3, fontFamily:'monospace' }}>MODULE 09</div>
          <div style={{ fontSize:15, fontWeight:900, color:'#ffe8a0', letterSpacing:2 }}>MICROS POS SIMULATOR</div>
        </div>
      </div>

      {step === 'choose' && (
        <>
          <div style={{ textAlign:'center', padding:'12px 0 4px' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🖥️</div>
            <p style={{ fontSize:12, color:'#6a5a30', lineHeight:1.7 }}>Choose a menu to load into the POS terminal</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div onClick={onDemo} style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:14, padding:'18px 16px', cursor:'pointer', display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ fontSize:28 }}>⚡</div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'#ffe8a0', marginBottom:4 }}>Use Demo Menu</div>
                <div style={{ fontSize:11, color:'#6a5a30', lineHeight:1.5 }}>16 items · Sea Bass, Wagyu, Chablis…<br/>12 pre-built scenarios. Start instantly.</div>
              </div>
            </div>
            <div onClick={()=>setStep('upload')} style={{ background:'rgba(245,158,11,0.03)', border:'1px solid rgba(245,158,11,0.12)', borderRadius:14, padding:'18px 16px', cursor:'pointer', display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ fontSize:28 }}>📄</div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'#ffe8a0', marginBottom:4 }}>Upload My Menu</div>
                <div style={{ fontSize:11, color:'#6a5a30', lineHeight:1.5 }}>Upload food menu + drinks menu separately.<br/>AI extracts item names → custom POS.</div>
              </div>
            </div>
          </div>
        </>
      )}

      {step === 'upload' && (
        <>
          <div style={{ fontSize:13, fontWeight:800, color:'#ffe8a0' }}>Upload your menu files</div>
          <div style={{ fontSize:10, color:'rgba(245,158,11,0.45)', lineHeight:1.6 }}>
            Add as many files as you need — food menu, drinks menu, wine list. Only item names are extracted.
          </div>

          {/* Uploaded file chips */}
          {uploadedFiles.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {uploadedFiles.map((f, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:20, padding:'5px 10px' }}>
                  <span style={{ fontSize:9, color:'#86efac', fontWeight:700 }}>✓ {f.name.length > 20 ? f.name.slice(0,18)+'…' : f.name}</span>
                  <button onClick={()=>removeFile(i)} style={{ background:'none', border:'none', color:'rgba(239,68,68,0.6)', cursor:'pointer', fontSize:12, lineHeight:1 }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Upload area */}
          <input ref={fileRef} type="file" multiple
            accept=".txt,.md,.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.csv"
            style={{ display:'none' }}
            onChange={async e => {
              const files = Array.from(e.target.files || [])
              for (const f of files) await loadFile(f)
              e.target.value = ''
            }}
          />

          <div
            onClick={() => !extracting && fileRef.current?.click()}
            style={{ border:`1.5px dashed ${extracting ? '#f59e0b' : 'rgba(245,158,11,0.25)'}`, borderRadius:12, padding:'18px', textAlign:'center', cursor: extracting ? 'default' : 'pointer', background:'rgba(245,158,11,0.02)', transition:'all 0.2s' }}
          >
            {extracting ? (
              <>
                <div style={{ width:24, height:24, border:`2px solid rgba(245,158,11,0.2)`, borderTop:`2px solid #f59e0b`, borderRadius:'50%', margin:'0 auto 8px', animation:'spin 0.8s linear infinite' }} />
                <div style={{ fontSize:11, color:'rgba(245,158,11,0.7)' }}>Reading file…</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:24, marginBottom:6 }}>📂</div>
                <div style={{ fontSize:12, color:'#c8a060', fontWeight:700, marginBottom:3 }}>
                  {uploadedFiles.length > 0 ? '+ Add another menu file' : 'Upload menu file(s)'}
                </div>
                <div style={{ fontSize:10, color:'rgba(245,158,11,0.35)' }}>PDF · DOCX · PNG/JPG · TXT · CSV · max 4 MB each</div>
              </>
            )}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ flex:1, height:1, background:'rgba(245,158,11,0.1)' }} />
            <span style={{ fontSize:10, color:'rgba(245,158,11,0.3)' }}>or paste text below</span>
            <div style={{ flex:1, height:1, background:'rgba(245,158,11,0.1)' }} />
          </div>

          <textarea value={manualText} onChange={e=>setManualText(e.target.value)}
            placeholder="Paste menu items here… (starters, mains, desserts, drinks)"
            rows={5}
            style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid rgba(245,158,11,0.2)', background:'rgba(245,158,11,0.03)', color:'#ffe8a0', fontSize:12, outline:'none', fontFamily:'inherit', resize:'vertical' }}
          />

          {error && (
            <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, padding:'10px 12px', fontSize:11, color:'#f87171', lineHeight:1.5 }}>{error}</div>
          )}

          <button onClick={parseMenu} disabled={!canBuild || extracting}
            style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background: canBuild && !extracting ? 'linear-gradient(135deg,#f59e0b,#b45309)' : 'rgba(245,158,11,0.08)', color: canBuild && !extracting ? '#07050b' : 'rgba(245,158,11,0.3)', fontSize:14, fontWeight:900, cursor: canBuild && !extracting ? 'pointer' : 'default', letterSpacing:2 }}>
            BUILD MY POS →
          </button>
        </>
      )}
    </div>
  )
}

// ── IntroScreen ──────────────────────────────────────────────────────────────
function IntroScreen({ scenario, onStart, onBack }: { scenario: PosScenario; onStart:()=>void; onBack:()=>void }) {
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',padding:'20px 18px',gap:16,animation:'fadeIn 0.3s ease both'}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:'rgba(245,158,11,0.5)',fontSize:18,cursor:'pointer'}}>←</button>
        <div>
          <div style={{fontSize:7,color:'rgba(245,158,11,0.6)',letterSpacing:3,fontFamily:'monospace'}}>MODULE 09</div>
          <div style={{fontSize:15,fontWeight:900,color:'#ffe8a0',letterSpacing:2}}>MICROS POS SIMULATOR</div>
        </div>
      </div>

      <div style={{textAlign:'center',padding:'16px 0 8px'}}>
        <div style={{fontSize:40,marginBottom:10}}>🖥️</div>
        <h2 style={{fontSize:19,fontWeight:900,color:'#ffe8a0',marginBottom:8}}>Train Like You're On Shift</h2>
        <p style={{fontSize:12,color:'#6a5a30',lineHeight:1.7}}>
          Real MICROS scenarios. Read the guest's order, open the correct table, enter items, add comments and fire courses — just like on the job.
        </p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {[
          {icon:'🎯',label:'8 Scenarios',sub:'Increasing difficulty'},
          {icon:'⏱',label:'2 min timer',sub:'Bonus for speed'},
          {icon:'💬',label:'Comments',sub:'Food & drink notes'},
          {icon:'🔥',label:'Hold & Fire',sub:'Course splitting'},
        ].map(c=>(
          <div key={c.label} style={{background:'rgba(245,158,11,0.04)',border:'1px solid rgba(245,158,11,0.12)',borderRadius:10,padding:'12px 10px',textAlign:'center'}}>
            <div style={{fontSize:22,marginBottom:5}}>{c.icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:'#ffe8a0'}}>{c.label}</div>
            <div style={{fontSize:9,color:'#5a4a20',marginTop:2}}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{background:'rgba(245,158,11,0.04)',border:'1px solid rgba(245,158,11,0.1)',borderRadius:12,padding:'12px 14px'}}>
        <div style={{fontSize:9,fontWeight:700,color:'rgba(245,158,11,0.6)',letterSpacing:2,marginBottom:6}}>FIRST ORDER PREVIEW</div>
        <div style={{fontSize:11,color:'#8a7040',fontStyle:'italic',lineHeight:1.6}}>Table {scenario.tableNumber} · {scenario.narrative}</div>
      </div>

      <button onClick={onStart} style={{width:'100%',padding:'15px',borderRadius:14,border:'none',background:'linear-gradient(135deg,#f59e0b,#b45309)',color:'#07050b',fontSize:14,fontWeight:900,cursor:'pointer',letterSpacing:2,boxShadow:'0 0 28px rgba(245,158,11,0.4)',marginTop:'auto'}}>
        START SHIFT →
      </button>
    </div>
  )
}

// ── TableScreen ──────────────────────────────────────────────────────────────
function TableScreen({ scenario, scenIdx, total, tableInput, tableError, onInput, onOpen, onBack }:{
  scenario:PosScenario; scenIdx:number; total:number
  tableInput:string; tableError:boolean
  onInput:(v:string)=>void; onOpen:()=>void; onBack:()=>void
}) {
  const PAD = ['1','2','3','4','5','6','7','8','9','C','0','⌫']
  function press(k:string) {
    if (k==='C') { onInput(''); return }
    if (k==='⌫') { onInput(tableInput.slice(0,-1)); return }
    if (tableInput.length >= 2) return
    onInput(tableInput + k)
  }
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',padding:'18px',gap:14,animation:'fadeIn 0.3s ease both'}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:'rgba(245,158,11,0.5)',fontSize:18,cursor:'pointer'}}>←</button>
        <div style={{fontSize:10,color:'rgba(245,158,11,0.5)',fontFamily:'monospace'}}>ORDER {scenIdx+1}/{total} · {'★'.repeat(scenario.difficulty)}</div>
      </div>

      {/* Guest info strip */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
        {[
          { label:'GUEST', value: scenario.guestName },
          { label:'PAX',   value: `${scenario.pax} cover${scenario.pax>1?'s':''}` },
          { label:'TABLE', value: `#${scenario.tableNumber}` },
        ].map(c => (
          <div key={c.label} style={{background:'rgba(245,158,11,0.05)',border:'1px solid rgba(245,158,11,0.12)',borderRadius:8,padding:'8px 6px',textAlign:'center'}}>
            <div style={{fontSize:7,color:'rgba(245,158,11,0.45)',letterSpacing:2,marginBottom:3}}>{c.label}</div>
            <div style={{fontSize:10,fontWeight:800,color:'#ffe8a0',lineHeight:1.2}}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{background:'rgba(245,158,11,0.05)',border:'1px solid rgba(245,158,11,0.15)',borderRadius:12,padding:'14px',borderLeft:'3px solid #f59e0b'}}>
        <div style={{fontSize:9,color:'rgba(245,158,11,0.7)',fontWeight:700,letterSpacing:2,marginBottom:6}}>GUEST ORDER</div>
        <div style={{fontSize:12,color:'#c8a060',lineHeight:1.7,fontStyle:'italic'}}>{scenario.narrative}</div>
      </div>

      <div style={{textAlign:'center',padding:'8px 0'}}>
        <div style={{fontSize:10,color:'rgba(245,158,11,0.5)',letterSpacing:2,marginBottom:10,fontFamily:'monospace'}}>OPEN TABLE</div>
        <div style={{
          fontSize:42,fontWeight:900,fontFamily:'monospace',letterSpacing:6,
          color: tableError ? '#ef4444' : tableInput ? '#ffe8a0' : 'rgba(245,158,11,0.2)',
          animation: tableError ? 'shake 0.4s ease' : 'none',
          background:'rgba(0,0,0,0.4)',border:`2px solid ${tableError?'#ef4444':'rgba(245,158,11,0.2)'}`,
          borderRadius:12,padding:'12px 24px',minWidth:160,display:'inline-block',
        }}>
          {tableInput || '—'}
        </div>
        {tableError && <div style={{fontSize:11,color:'#ef4444',marginTop:8}}>Wrong table — check the order</div>}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
        {PAD.map(k=>(
          <button key={k} onClick={()=>press(k)} style={{
            padding:'14px',borderRadius:10,border:'1px solid rgba(245,158,11,0.15)',
            background: k==='C'?'rgba(239,68,68,0.1)':k==='⌫'?'rgba(245,158,11,0.08)':'rgba(245,158,11,0.06)',
            color: k==='C'?'#ef4444':'#ffe8a0',fontSize:18,fontWeight:700,cursor:'pointer',fontFamily:'monospace',
          }}>{k}</button>
        ))}
      </div>

      <button onClick={onOpen} disabled={!tableInput} style={{
        width:'100%',padding:'14px',borderRadius:12,border:'none',
        background: tableInput ? 'linear-gradient(135deg,#f59e0b,#b45309)' : 'rgba(245,158,11,0.06)',
        color: tableInput ? '#07050b' : 'rgba(245,158,11,0.3)',
        fontSize:14,fontWeight:900,cursor:tableInput?'pointer':'default',letterSpacing:2,
        boxShadow: tableInput ? '0 0 20px rgba(245,158,11,0.3)' : 'none',
      }}>OPEN TABLE {tableInput || '?'}</button>
    </div>
  )
}

// ── OrderingScreen ───────────────────────────────────────────────────────────
function OrderingScreen({ scenario, scenIdx, total, menuData, timeLeft, timerPct, timerColor, cat, seat, items, holdActive, onCat, onSeat, onAddItem, onFoodComment, onDrinkComment, onHold, onFire, onSend, onVoid }:{
  scenario:PosScenario; scenIdx:number; total:number; menuData:Record<string,PosMenuItem[]>
  timeLeft:number; timerPct:number; timerColor:string
  cat:Category; seat:number; items:EnteredItem[]; holdActive:boolean
  onCat:(c:Category)=>void; onSeat:(n:number)=>void
  onAddItem:(id:string,name:string)=>void
  onFoodComment:()=>void; onDrinkComment:()=>void
  onHold:()=>void; onFire:()=>void; onSend:()=>void; onVoid:()=>void
}) {
  const cats: Category[] = ['starter','main','dessert','drink']
  const catLabels: Record<Category,string> = { starter:'STARTERS', main:'MAINS', dessert:'DESSERTS', drink:'DRINKS' }
  const menuItems = menuData[cat] || []

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
      {/* Timer bar */}
      <div style={{height:4,background:'rgba(255,255,255,0.05)'}}>
        <div style={{height:'100%',width:`${timerPct*100}%`,background:timerColor,transition:'width 1s linear,background 0.5s'}} />
      </div>

      {/* Header */}
      <div style={{background:'rgba(0,0,0,0.5)',borderBottom:'1px solid rgba(245,158,11,0.1)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 14px 4px'}}>
          <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(245,158,11,0.7)',fontWeight:700}}>
            TABLE {scenario.tableNumber} · {scenario.pax} PAX
          </div>
          <div style={{fontFamily:'monospace',fontSize:16,fontWeight:900,color:timerColor,textShadow:`0 0 10px ${timerColor}66`}}>
            {String(Math.floor(timeLeft/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')}
          </div>
          <div style={{fontSize:9,color:'rgba(245,158,11,0.4)'}}>{'★'.repeat(scenario.difficulty)}</div>
        </div>
        <div style={{padding:'0 14px 7px',fontSize:9,color:'rgba(245,158,11,0.5)',fontFamily:'monospace'}}>
          {scenario.guestName.toUpperCase()} · ORDER {scenIdx+1}/{total}
        </div>
      </div>

      {/* Order ticket */}
      <div style={{padding:'10px 12px',background:'rgba(245,158,11,0.04)',borderBottom:'1px solid rgba(245,158,11,0.08)'}}>
        <div style={{fontSize:9,color:'rgba(245,158,11,0.6)',letterSpacing:2,marginBottom:4}}>GUEST ORDER</div>
        <div style={{fontSize:11,color:'#8a7040',fontStyle:'italic',lineHeight:1.6}}>{scenario.narrative}</div>
      </div>

      {/* Current order list */}
      {items.length > 0 && (
        <div style={{padding:'8px 12px',background:'rgba(0,0,0,0.3)',borderBottom:'1px solid rgba(255,255,255,0.04)',maxHeight:80,overflowY:'auto'}}>
          {items.map((it,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
              <span style={{fontSize:8,color:'rgba(245,158,11,0.5)',minWidth:14}}>S{it.seat}</span>
              {it.held && <span style={{fontSize:7,background:'rgba(239,68,68,0.15)',color:'#ef4444',borderRadius:3,padding:'1px 4px'}}>HELD</span>}
              <span style={{fontSize:10,color:'#c8a060',fontWeight:600}}>{it.name}</span>
              {it.comment && <span style={{fontSize:9,color:'rgba(167,139,250,0.7)'}}>"{it.comment}"</span>}
            </div>
          ))}
        </div>
      )}

      {/* Category tabs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0,borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        {cats.map(c => (
          <button key={c} onClick={()=>onCat(c)} style={{
            padding:'9px 4px',border:'none',borderBottom: cat===c ? `2px solid ${CAT_COLORS[c]}` : '2px solid transparent',
            background: cat===c ? `${CAT_COLORS[c]}15` : 'rgba(0,0,0,0.2)',
            color: cat===c ? CAT_COLORS[c] : 'rgba(255,255,255,0.3)',
            fontSize:8,fontWeight:700,cursor:'pointer',letterSpacing:0.5,transition:'all 0.15s',
          }}>{catLabels[c]}</button>
        ))}
      </div>

      {/* Menu item grid */}
      <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,padding:'10px 10px 6px',overflowY:'auto'}}>
        {menuItems.map(item => (
          <button key={item.id} onClick={()=>onAddItem(item.id,item.name)} style={{
            padding:'12px 8px',borderRadius:8,border:`1px solid ${CAT_COLORS[cat]}22`,
            background:`${CAT_COLORS[cat]}08`,
            color:'#e0e8d8',fontSize:10,fontWeight:700,cursor:'pointer',
            letterSpacing:0.5,fontFamily:'monospace',
            transition:'all 0.12s',textAlign:'center',lineHeight:1.3,
          }}>
            {item.short}
          </button>
        ))}
      </div>

      {/* Seat selector */}
      <div style={{display:'flex',gap:5,padding:'6px 10px',borderTop:'1px solid rgba(255,255,255,0.04)'}}>
        <span style={{fontSize:9,color:'rgba(245,158,11,0.5)',alignSelf:'center',marginRight:2,fontFamily:'monospace'}}>SEAT</span>
        {[1,2,3,4].map(n => (
          <button key={n} onClick={()=>onSeat(n)} style={{
            width:32,height:28,borderRadius:6,border:`1px solid ${seat===n?'rgba(245,158,11,0.5)':'rgba(255,255,255,0.08)'}`,
            background: seat===n ? 'rgba(245,158,11,0.15)' : 'rgba(0,0,0,0.3)',
            color: seat===n ? '#f59e0b' : 'rgba(255,255,255,0.3)',
            fontSize:11,fontWeight:800,cursor:'pointer',fontFamily:'monospace',
          }}>{n}</button>
        ))}
      </div>

      {/* Action bar — row 1 */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5,padding:'6px 10px 3px',borderTop:'1px solid rgba(255,255,255,0.04)'}}>
        <button onClick={onFoodComment} disabled={items.length===0} style={{
          padding:'9px 4px',borderRadius:8,border:'1px solid rgba(251,146,60,0.25)',
          background:'rgba(251,146,60,0.08)',color: items.length ? '#fb923c' : 'rgba(251,146,60,0.25)',
          fontSize:8,fontWeight:700,cursor:items.length?'pointer':'default',letterSpacing:0.3,
        }}>FOOD{'\n'}CMT</button>
        <button onClick={onDrinkComment} disabled={items.length===0} style={{
          padding:'9px 4px',borderRadius:8,border:'1px solid rgba(168,85,247,0.25)',
          background:'rgba(168,85,247,0.08)',color: items.length ? '#a855f7' : 'rgba(168,85,247,0.25)',
          fontSize:8,fontWeight:700,cursor:items.length?'pointer':'default',letterSpacing:0.3,
        }}>DRINK{'\n'}CMT</button>
        <button onClick={onVoid} disabled={items.length===0} style={{
          padding:'9px 4px',borderRadius:8,border:'1px solid rgba(239,68,68,0.25)',
          background:'rgba(239,68,68,0.06)',color: items.length ? '#ef4444' : 'rgba(239,68,68,0.2)',
          fontSize:8,fontWeight:700,cursor:items.length?'pointer':'default',letterSpacing:0.3,
        }}>✕ VOID{'\n'}LAST</button>
      </div>
      {/* Action bar — row 2 */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:5,padding:'3px 10px 14px'}}>
        {holdActive ? (
          <button onClick={onFire} style={{
            padding:'9px 4px',borderRadius:8,
            border:'1px solid rgba(239,68,68,0.6)',
            background:'rgba(239,68,68,0.2)',
            color:'#ef4444',fontSize:8,fontWeight:900,cursor:'pointer',
            letterSpacing:0.3,animation:'pulse 1s ease-in-out infinite',
          }}>🔥 FIRE{'\n'}COURSE</button>
        ) : (
          <button onClick={onHold} style={{
            padding:'9px 4px',borderRadius:8,
            border:'1px solid rgba(239,68,68,0.2)',
            background:'rgba(239,68,68,0.06)',
            color:'rgba(239,68,68,0.5)',fontSize:8,fontWeight:700,cursor:'pointer',letterSpacing:0.3,
          }}>HOLD{'\n'}COURSE</button>
        )}
        <button onClick={onSend} disabled={items.length===0} style={{
          padding:'9px 4px',borderRadius:8,border:'none',
          background: items.length ? 'linear-gradient(135deg,#f59e0b,#b45309)' : 'rgba(245,158,11,0.08)',
          color: items.length ? '#07050b' : 'rgba(245,158,11,0.3)',
          fontSize:9,fontWeight:900,cursor:items.length?'pointer':'default',letterSpacing:0.5,
        }}>SEND ORDER →</button>
      </div>
    </div>
  )
}

// ── CommentScreen ────────────────────────────────────────────────────────────
function CommentScreen({ commentType, commentText, presets, kbRows, onPreset, onKey, onBack, onSpace, onCancel, onConfirm }:{
  commentType:'food'|'drink'; commentText:string
  presets:string[]; kbRows:string[]
  onPreset:(p:string)=>void; onKey:(k:string)=>void
  onBack:()=>void; onSpace:()=>void
  onCancel:()=>void; onConfirm:()=>void
}) {
  const color = commentType==='food' ? '#fb923c' : '#a855f7'
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',padding:'12px 10px',gap:8,animation:'fadeIn 0.2s ease both'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:10,fontWeight:700,color,letterSpacing:2}}>{commentType.toUpperCase()} COMMENT</div>
        <button onClick={onCancel} style={{background:'none',border:'none',color:'rgba(255,255,255,0.3)',cursor:'pointer',fontSize:12}}>✕</button>
      </div>

      {/* Text display */}
      <div style={{background:'rgba(0,0,0,0.5)',border:`1px solid ${color}33`,borderRadius:10,padding:'12px',minHeight:44,fontFamily:'monospace',fontSize:14,color:'#fff',letterSpacing:1}}>
        {commentText || <span style={{color:'rgba(255,255,255,0.2)'}}>Type comment...</span>}
        <span style={{animation:'fadeIn 0.5s step-end infinite'}}>|</span>
      </div>

      {/* Presets */}
      <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
        {presets.map(p=>(
          <button key={p} onClick={()=>onPreset(p)} style={{
            padding:'5px 8px',borderRadius:6,border:`1px solid ${color}25`,
            background:`${color}0c`,color:`${color}cc`,fontSize:9,fontWeight:700,cursor:'pointer',letterSpacing:0.5,
          }}>{p}</button>
        ))}
      </div>

      {/* Keyboard */}
      <div style={{display:'flex',flexDirection:'column',gap:4,marginTop:4}}>
        {kbRows.map((row,ri)=>(
          <div key={ri} style={{display:'flex',gap:3,justifyContent:'center'}}>
            {row.split('').map(ch=>(
              <button key={ch} onClick={()=>onKey(ch)} style={{
                width:30,height:32,borderRadius:5,border:'1px solid rgba(255,255,255,0.1)',
                background:'rgba(255,255,255,0.05)',color:'#e0e8d8',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'monospace',
              }}>{ch}</button>
            ))}
          </div>
        ))}
        <div style={{display:'flex',gap:4,justifyContent:'center',marginTop:2}}>
          <button onClick={onBack} style={{width:56,height:32,borderRadius:5,border:'1px solid rgba(255,100,100,0.2)',background:'rgba(239,68,68,0.08)',color:'#ef4444',fontSize:12,cursor:'pointer'}}>⌫</button>
          <button onClick={onSpace} style={{flex:1,height:32,borderRadius:5,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.5)',fontSize:11,cursor:'pointer'}}>SPACE</button>
          <button onClick={onConfirm} style={{width:56,height:32,borderRadius:5,border:'none',background:color,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer'}}>OK</button>
        </div>
      </div>
    </div>
  )
}

// ── ValidateScreen ───────────────────────────────────────────────────────────
function ValidateScreen({ scenario, result, isLast, onNext }:{
  scenario:PosScenario; result:ScenarioResult; isLast:boolean; onNext:()=>void
}) {
  const pct = Math.round((result.earned / result.max) * 100)
  const passed = pct >= 50
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',padding:'18px',gap:12,animation:'pop 0.4s ease both',overflowY:'auto'}}>
      {/* Guest badge */}
      <div style={{display:'flex',gap:6,justifyContent:'center'}}>
        {[
          { label:'TABLE', value:`#${scenario.tableNumber}` },
          { label:'GUEST', value:scenario.guestName },
          { label:'PAX',   value:`${scenario.pax}` },
        ].map(c=>(
          <div key={c.label} style={{background:'rgba(245,158,11,0.05)',border:'1px solid rgba(245,158,11,0.12)',borderRadius:7,padding:'5px 8px',textAlign:'center',flex:1}}>
            <div style={{fontSize:7,color:'rgba(245,158,11,0.4)',letterSpacing:1}}>{c.label}</div>
            <div style={{fontSize:9,fontWeight:800,color:'#ffe8a0'}}>{c.value}</div>
          </div>
        ))}
      </div>
      <div style={{textAlign:'center',padding:'4px 0'}}>
        <div style={{fontSize:38,marginBottom:8}}>{pct===100?'🏆':passed?'✅':'❌'}</div>
        <div style={{fontSize:18,fontWeight:900,color: passed?'#f59e0b':'#ef4444',marginBottom:4}}>
          {pct===100?'PERFECT ORDER!':passed?'ORDER SENT':'NEEDS WORK'}
        </div>
        <div style={{fontSize:13,color:'rgba(245,158,11,0.5)'}}>+{result.earned} pts · {result.timeLeft}s remaining</div>
      </div>

      <div style={{background:'rgba(0,0,0,0.4)',border:'1px solid rgba(245,158,11,0.1)',borderRadius:12,padding:'14px'}}>
        <div style={{fontSize:9,color:'rgba(245,158,11,0.5)',letterSpacing:2,marginBottom:10}}>ORDER BREAKDOWN</div>
        {result.itemResults.map((r,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
            <span style={{fontSize:14}}>{r.ok?'✓':'✗'}</span>
            <span style={{fontSize:11,color: r.ok?'#86efac':'#fca5a5'}}>{r.label}</span>
          </div>
        ))}
      </div>

      <div style={{background:'rgba(245,158,11,0.04)',border:'1px solid rgba(245,158,11,0.1)',borderRadius:10,padding:'10px 12px'}}>
        <div style={{fontSize:9,color:'rgba(245,158,11,0.5)',letterSpacing:2,marginBottom:5}}>TIP</div>
        <div style={{fontSize:11,color:'#8a7040',lineHeight:1.6}}>{scenario.tip}</div>
      </div>

      <button onClick={onNext} style={{
        width:'100%',padding:'15px',borderRadius:12,border:'none',
        background:'linear-gradient(135deg,#f59e0b,#b45309)',
        color:'#07050b',fontSize:14,fontWeight:900,cursor:'pointer',letterSpacing:2,
        boxShadow:'0 0 24px rgba(245,158,11,0.35)',marginTop:'auto',
      }}>
        {isLast ? 'SEE FINAL SCORE →' : 'NEXT ORDER →'}
      </button>
    </div>
  )
}

// ── FireTimerScreen ───────────────────────────────────────────────────────────
function FireTimerScreen({ count, tableNumber, guestName, pax, onFire }: { count: number; tableNumber: number; guestName: string; pax: number; onFire: () => void }) {
  const ideal = count >= 30 && count <= 50
  const tooEarly = count < 25
  const late = count > 60

  const statusText = tooEarly
    ? 'Guests are eating starters...'
    : ideal
    ? '✓ Good time to fire!'
    : 'Fire now — do not wait!'

  const statusColor = tooEarly ? '#f59e0b' : ideal ? '#22c55e' : '#ef4444'
  const circumference = 2 * Math.PI * 60
  const progress = Math.min(count / 65, 1)

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px', gap:20, background:'#0a0c09', animation:'fadeIn 0.3s ease both' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:9, color:'rgba(245,158,11,0.5)', letterSpacing:3, fontFamily:'monospace', marginBottom:4 }}>TABLE {tableNumber} · {pax} PAX · STARTERS AWAY</div>
        <div style={{ fontSize:13, color:'rgba(245,158,11,0.7)', marginBottom:6 }}>{guestName}</div>
        <div style={{ fontSize:15, fontWeight:900, color:'#ffe8a0' }}>Fire Main Course</div>
        <div style={{ fontSize:11, color:'#6a5a30', marginTop:4 }}>Return to the table and fire when guests are ready</div>
      </div>

      <div style={{ position:'relative', width:160, height:160, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="160" height="160" style={{ position:'absolute', top:0, left:0 }}>
          <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(245,158,11,0.08)" strokeWidth="10"/>
          {/* Green optimal zone arc: 30-50s = 46%–77% of circle */}
          <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(34,197,94,0.25)" strokeWidth="10"
            strokeDasharray={`${(20/65)*circumference} ${circumference}`}
            strokeDashoffset={`${circumference - (30/65)*circumference}`}
            strokeLinecap="round"
            style={{ transform:'rotate(-90deg)', transformOrigin:'80px 80px' }}
          />
          <circle cx="80" cy="80" r="60" fill="none"
            stroke={ideal ? '#22c55e' : tooEarly ? '#f59e0b' : '#ef4444'}
            strokeWidth="10"
            strokeDasharray={`${progress * circumference} ${circumference}`}
            strokeLinecap="round"
            style={{ transform:'rotate(-90deg)', transformOrigin:'80px 80px', transition:'stroke-dasharray 1s linear, stroke 0.5s' }}
          />
        </svg>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:44, fontWeight:900, fontFamily:'monospace', color:'#ffe8a0', lineHeight:1 }}>{count}s</div>
          <div style={{ fontSize:9, color:statusColor, marginTop:4, fontWeight:700 }}>{statusText}</div>
        </div>
      </div>

      <div style={{ width:'100%', background:'rgba(0,0,0,0.4)', borderRadius:10, padding:'10px 14px' }}>
        <div style={{ fontSize:8, color:'rgba(245,158,11,0.4)', letterSpacing:2, marginBottom:6 }}>OPTIMAL FIRE WINDOW</div>
        <div style={{ position:'relative', height:6, background:'rgba(255,255,255,0.05)', borderRadius:3 }}>
          <div style={{ position:'absolute', left:`${(30/65)*100}%`, width:`${(20/65)*100}%`, height:'100%', background:'rgba(34,197,94,0.35)', borderRadius:3 }} />
          <div style={{ position:'absolute', top:'50%', left:`${Math.min(progress*100,100)}%`, transform:'translate(-50%,-50%)', width:12, height:12, borderRadius:'50%', background:statusColor, boxShadow:`0 0 8px ${statusColor}`, transition:'left 1s linear' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:8, color:'rgba(255,255,255,0.2)' }}>
          <span>0s</span><span style={{ color:'#22c55e' }}>30–50s ✓</span><span>65s</span>
        </div>
      </div>

      <button onClick={onFire} style={{
        width:'100%', padding:'18px', borderRadius:14, border:'none',
        background: tooEarly
          ? 'rgba(245,158,11,0.12)'
          : ideal
          ? 'linear-gradient(135deg,#22c55e,#15803d)'
          : 'linear-gradient(135deg,#ef4444,#b91c1c)',
        color: tooEarly ? 'rgba(245,158,11,0.4)' : '#fff',
        fontSize:14, fontWeight:900, cursor:'pointer', letterSpacing:2,
        boxShadow: ideal ? '0 0 30px rgba(34,197,94,0.4)' : 'none',
        animation: ideal ? 'pulse 1s ease-in-out infinite' : 'none',
        transition:'all 0.5s',
      }}>
        🔥 FIRE MAIN COURSE
      </button>
      {tooEarly && (
        <div style={{ fontSize:10, color:'rgba(245,158,11,0.3)', textAlign:'center' }}>
          Wait until guests have nearly finished starters (30–50s)
        </div>
      )}
    </div>
  )
}

// ── FinalScreen ──────────────────────────────────────────────────────────────
function FinalScreen({ results, totalScore, onRestart, onHome }:{
  results:ScenarioResult[]; totalScore:number; onRestart:()=>void; onHome:()=>void
}) {
  const maxPossible = results.reduce((s,r)=>s+r.max,0)
  const pct = maxPossible > 0 ? Math.round((totalScore/maxPossible)*100) : 0
  const grade = pct===100?'🏆 FLAWLESS SHIFT':pct>=80?'⭐ EXCELLENT SERVICE':pct>=60?'✓ GOOD SHIFT':pct>=40?'📋 NEEDS PRACTICE':'🔄 KEEP TRAINING'
  const gradeColor = pct>=80?'#f59e0b':pct>=60?'#22c55e':pct>=40?'#fb923c':'#ef4444'

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',padding:'18px',gap:14,animation:'pop 0.4s ease both',overflowY:'auto'}}>
      <div style={{textAlign:'center',padding:'12px 0 4px'}}>
        <div style={{fontSize:42,marginBottom:8}}>🖥️</div>
        <div style={{fontSize:11,color:'rgba(245,158,11,0.5)',letterSpacing:3,fontFamily:'monospace',marginBottom:4}}>SHIFT COMPLETE</div>
        <div style={{fontSize:22,fontWeight:900,color:gradeColor,marginBottom:6}}>{grade}</div>
        <div style={{fontSize:32,fontWeight:900,color:'#ffe8a0'}}>{totalScore}</div>
        <div style={{fontSize:10,color:'rgba(245,158,11,0.4)'}}>points · {pct}% accuracy</div>
      </div>

      <div style={{background:'rgba(0,0,0,0.4)',border:'1px solid rgba(245,158,11,0.1)',borderRadius:12,padding:'14px'}}>
        <div style={{fontSize:9,color:'rgba(245,158,11,0.5)',letterSpacing:2,marginBottom:10}}>ORDER HISTORY</div>
        {results.map((r,i)=>{
          const p=Math.round((r.earned/r.max)*100)
          return (
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:11,color:'#8a7040',fontFamily:'monospace'}}>Order {i+1}</span>
              <div style={{flex:1,height:4,background:'rgba(255,255,255,0.05)',borderRadius:2,margin:'0 10px'}}>
                <div style={{height:'100%',width:`${p}%`,background:p>=80?'#22c55e':p>=50?'#f59e0b':'#ef4444',borderRadius:2}} />
              </div>
              <span style={{fontSize:11,color:'#c8a060',fontWeight:700}}>{r.earned}pts</span>
            </div>
          )
        })}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:'auto'}}>
        <button onClick={onRestart} style={{padding:'13px',borderRadius:12,border:'1px solid rgba(245,158,11,0.2)',background:'rgba(245,158,11,0.06)',color:'rgba(245,158,11,0.8)',fontSize:12,fontWeight:700,cursor:'pointer'}}>🔄 Try Again</button>
        <button onClick={onHome} style={{padding:'13px',borderRadius:12,border:'none',background:'linear-gradient(135deg,#f59e0b,#b45309)',color:'#07050b',fontSize:12,fontWeight:900,cursor:'pointer'}}>🏠 Home</button>
      </div>
    </div>
  )
}
