'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ResumeData } from '@/app/api/resume/generate/route'

const P  = '#a78bfa'   // violet
const PB = 'rgba(167,139,250,0.18)'
const PG = 'rgba(167,139,250,0.06)'

type Phase = 'intro' | 'form' | 'upload' | 'generating' | 'result'
type Mode  = 'generate' | 'improve'

const TEXT_EXTS = /\.(txt|md|csv|tsv|json|xml|rtf|html?)$/i

function playSound(type: 'correct' | 'click') {
  try {
    const ctx = new AudioContext()
    const freq = type === 'correct' ? 660 : 520
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination); o.type = 'sine'; o.frequency.value = freq
    g.gain.setValueAtTime(0, ctx.currentTime)
    g.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    o.start(); o.stop(ctx.currentTime + 0.2)
  } catch {}
}

function Section({ title, color = P, children }: { title: string; color?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9, fontWeight: 800, color, letterSpacing: 3, marginBottom: 8, borderBottom: `1px solid ${color}22`, paddingBottom: 5 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export default function ResumePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [phase, setPhase] = useState<Phase>('intro')
  const [mode, setMode] = useState<Mode>('generate')
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [cvText, setCvText] = useState('')
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    name: '', role: '', experience: '', skills: '', languages: '', target: '', highlights: '',
  })

  function setF(k: keyof typeof form, v: string) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: `1px solid rgba(167,139,250,0.2)`,
    background: 'rgba(167,139,250,0.04)', color: '#e0d8ff',
    fontSize: 13, outline: 'none', fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 9, fontWeight: 700, color: `${P}99`, letterSpacing: 2, marginBottom: 5, display: 'block',
  }

  async function loadFile(file: File) {
    if (TEXT_EXTS.test(file.name) || file.type.startsWith('text/')) {
      const reader = new FileReader()
      reader.onload = e => setCvText((e.target?.result as string) || '')
      reader.readAsText(file)
      return
    }
    setExtracting(true)
    setErrorMsg('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/menu-master/extract', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCvText(data.text || '')
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Failed to read file')
    } finally {
      setExtracting(false)
    }
  }

  async function generate() {
    setErrorMsg('')
    setPhase('generating')
    try {
      const body = mode === 'generate'
        ? { mode: 'generate', formData: form }
        : { mode: 'improve', cvText }
      const res = await fetch('/api/resume/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error || !data.resume) throw new Error(data.error || 'No resume generated')
      setResume(data.resume)
      playSound('correct')
      setPhase('result')
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Failed to generate resume. Please try again.')
      setPhase(mode === 'generate' ? 'form' : 'upload')
    }
  }

  function buildPlainText(r: ResumeData): string {
    const lines: string[] = []
    lines.push(r.name.toUpperCase())
    lines.push(r.title)
    lines.push('')
    lines.push('PROFESSIONAL SUMMARY')
    lines.push(r.summary)
    lines.push('')
    lines.push('CORE COMPETENCIES')
    lines.push(r.competencies.join(' · '))
    lines.push('')
    lines.push('EXPERIENCE')
    r.experience.forEach(e => {
      lines.push(`${e.role} — ${e.company} (${e.period})`)
      e.bullets.forEach(b => lines.push(`• ${b}`))
      lines.push('')
    })
    if (r.education.length) {
      lines.push('EDUCATION')
      r.education.forEach(e => lines.push(`${e.degree} — ${e.institution} (${e.year})`))
      lines.push('')
    }
    lines.push('LANGUAGES')
    lines.push(r.languages.join(' | '))
    lines.push('')
    if (r.certifications?.length) {
      lines.push('CERTIFICATIONS')
      lines.push(r.certifications.join(' | '))
      lines.push('')
    }
    lines.push('ADDITIONAL SKILLS')
    lines.push(r.additionalSkills.join(' · '))
    return lines.join('\n')
  }

  function copyResume() {
    if (!resume) return
    navigator.clipboard.writeText(buildPlainText(resume)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function downloadResume() {
    if (!resume) return
    const text = buildPlainText(resume)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resume.name.replace(/\s+/g, '_')}_CV.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const canGenerate = mode === 'generate'
    ? form.role.trim().length > 1 && form.experience.trim().length > 1
    : cvText.trim().length > 50

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pop { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; background:#000; background:#000; }
        ::placeholder { color:rgba(167,139,250,0.3); }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(167,139,250,0.2); border-radius:3px; }
      `}</style>

      <div style={{ minHeight:'100dvh', background:'linear-gradient(160deg,#07050f 0%,#0a0714 50%,#07050f 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-geist-sans,Arial,sans-serif)' }}>
        <div style={{ width:'100%', maxWidth:430, minHeight:'100dvh', display:'flex', flexDirection:'column', position:'relative' }}>

          {/* Header */}
          <div style={{ padding:'18px 20px 0', display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={() => router.push('/')} style={{ background:'none', border:'none', color:`${P}77`, fontSize:18, cursor:'pointer', padding:'4px 0' }}>←</button>
            <div>
              <div style={{ fontSize:8, color:`${P}77`, letterSpacing:3, fontWeight:700, fontFamily:'monospace' }}>MODULE 08</div>
              <div style={{ fontSize:15, fontWeight:900, color:'#e0d8ff', letterSpacing:2 }}>PROFESSIONAL RESUME</div>
            </div>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 32px' }}>

            {/* ── INTRO ── */}
            {phase === 'intro' && (
              <div style={{ animation:'fadeIn 0.35s ease both', display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ textAlign:'center', padding:'20px 0 10px' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>📄</div>
                  <h2 style={{ fontSize:20, fontWeight:900, color:'#e0d8ff', marginBottom:8 }}>AI Resume Builder</h2>
                  <p style={{ fontSize:12, color:'#6a5a88', lineHeight:1.7 }}>
                    Generate a world-class hospitality CV in English — or upload yours and let AI upgrade it.
                  </p>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[
                    { mode:'generate' as Mode, icon:'✨', title:'Build from Scratch', desc:'Answer a few questions — AI writes your perfect hospitality CV' },
                    { mode:'improve'  as Mode, icon:'🔄', title:'Improve My CV',      desc:'Upload your current CV — AI rewrites it in professional English' },
                  ].map(opt => (
                    <div key={opt.mode} onClick={() => { setMode(opt.mode); setPhase(opt.mode === 'generate' ? 'form' : 'upload'); playSound('click') }}
                      style={{ background:PG, border:`1px solid ${PB}`, borderRadius:14, padding:'18px 14px', cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}>
                      <div style={{ fontSize:28, marginBottom:10 }}>{opt.icon}</div>
                      <div style={{ fontSize:12, fontWeight:800, color:'#e0d8ff', marginBottom:6 }}>{opt.title}</div>
                      <div style={{ fontSize:10, color:'#6a5a88', lineHeight:1.5 }}>{opt.desc}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background:'rgba(167,139,250,0.04)', border:`1px solid rgba(167,139,250,0.1)`, borderRadius:12, padding:'14px' }}>
                  <div style={{ fontSize:9, fontWeight:700, color:`${P}88`, letterSpacing:2, marginBottom:8 }}>WHAT YOU GET</div>
                  {[
                    '✓ Professional British English',
                    '✓ ATS-optimised format',
                    '✓ Tailored for luxury hospitality',
                    '✓ Strong action verbs & quantified achievements',
                    '✓ Download as .txt or copy to clipboard',
                  ].map(i => <div key={i} style={{ fontSize:11, color:'#5a4a78', marginBottom:4 }}>{i}</div>)}
                </div>
              </div>
            )}

            {/* ── FORM (generate from scratch) ── */}
            {phase === 'form' && (
              <div style={{ animation:'fadeIn 0.35s ease both', display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <button onClick={() => setPhase('intro')} style={{ background:'none', border:'none', color:`${P}66`, fontSize:16, cursor:'pointer' }}>←</button>
                  <div style={{ fontSize:13, fontWeight:800, color:'#e0d8ff' }}>Tell us about yourself</div>
                </div>

                {[
                  { key:'name',        label:'FULL NAME',           ph:'e.g. Ricardo Silva',                    required:false },
                  { key:'role',        label:'TARGET ROLE *',       ph:'e.g. Senior Waiter, Sommelier, Maître d\'', required:true },
                  { key:'experience',  label:'EXPERIENCE *',        ph:'e.g. 4 years fine dining, 2 years luxury hotel', required:true },
                  { key:'skills',      label:'KEY SKILLS',          ph:'e.g. wine service, allergen management, MICROS', required:false },
                  { key:'languages',   label:'LANGUAGES',           ph:'e.g. English B2, Portuguese native, Spanish basic', required:false },
                  { key:'target',      label:'TARGET ESTABLISHMENTS',ph:'e.g. 5-star hotels in Dubai, Michelin restaurants', required:false },
                  { key:'highlights',  label:'ACHIEVEMENTS / HIGHLIGHTS',ph:'e.g. Forbes 5-star trained, managed 80 covers solo', required:false },
                ].map(field => (
                  <div key={field.key}>
                    <label style={labelStyle}>{field.label}</label>
                    <input
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setF(field.key as keyof typeof form, e.target.value)}
                      placeholder={field.ph}
                      style={inputStyle}
                    />
                  </div>
                ))}

                {errorMsg && (
                  <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:10, padding:'10px 12px', fontSize:12, color:'#f87171' }}>{errorMsg}</div>
                )}

                <button onClick={generate} disabled={!canGenerate}
                  style={{ width:'100%', padding:'15px', borderRadius:14, border:'none', background: canGenerate ? `linear-gradient(135deg,${P},#7c3aed)` : PG, color: canGenerate ? '#07050f' : '#4a3a68', fontSize:14, fontWeight:900, cursor: canGenerate ? 'pointer' : 'default', letterSpacing:2, boxShadow: canGenerate ? `0 0 28px rgba(167,139,250,0.35)` : 'none', transition:'all 0.2s' }}>
                  GENERATE MY CV →
                </button>
                <div style={{ fontSize:9, color:'#3a2a58', textAlign:'center' }}>* Required fields</div>
              </div>
            )}

            {/* ── UPLOAD (improve existing) ── */}
            {phase === 'upload' && (
              <div style={{ animation:'fadeIn 0.35s ease both', display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <button onClick={() => setPhase('intro')} style={{ background:'none', border:'none', color:`${P}66`, fontSize:16, cursor:'pointer' }}>←</button>
                  <div style={{ fontSize:13, fontWeight:800, color:'#e0d8ff' }}>Upload or paste your CV</div>
                </div>

                {/* File upload */}
                <input ref={fileRef} type="file"
                  accept=".txt,.md,.pdf,.doc,.docx,.odt,.png,.jpg,.jpeg,.webp,.rtf"
                  style={{ display:'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = '' }} />

                <div onClick={() => !extracting && fileRef.current?.click()}
                  style={{ border:`1.5px dashed ${extracting ? P : PB}`, borderRadius:12, padding:'24px 16px', textAlign:'center', cursor: extracting ? 'default' : 'pointer', background: extracting ? `${P}06` : 'transparent', transition:'all 0.2s' }}>
                  {extracting ? (
                    <>
                      <div style={{ width:24, height:24, border:`2px solid ${P}33`, borderTop:`2px solid ${P}`, borderRadius:'50%', margin:'0 auto 10px', animation:'spin 0.8s linear infinite' }} />
                      <div style={{ fontSize:12, color:P }}>Reading your CV...</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize:28, marginBottom:8 }}>📂</div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#c0b0f0', marginBottom:4 }}>Upload your CV</div>
                      <div style={{ fontSize:10, color:'#4a3a68' }}>PDF · DOCX · PNG/JPG · TXT · and more</div>
                    </>
                  )}
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ flex:1, height:1, background:'rgba(167,139,250,0.1)' }} />
                  <span style={{ fontSize:10, color:'#4a3a68' }}>or paste below</span>
                  <div style={{ flex:1, height:1, background:'rgba(167,139,250,0.1)' }} />
                </div>

                <div>
                  <label style={labelStyle}>PASTE YOUR CV TEXT</label>
                  <textarea
                    value={cvText}
                    onChange={e => setCvText(e.target.value)}
                    placeholder="Paste your current CV content here..."
                    rows={8}
                    style={{ ...inputStyle, resize:'vertical', lineHeight:1.6 }}
                  />
                </div>

                {errorMsg && (
                  <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:10, padding:'10px 12px', fontSize:12, color:'#f87171' }}>{errorMsg}</div>
                )}

                <button onClick={generate} disabled={!canGenerate || extracting}
                  style={{ width:'100%', padding:'15px', borderRadius:14, border:'none', background: canGenerate && !extracting ? `linear-gradient(135deg,${P},#7c3aed)` : PG, color: canGenerate && !extracting ? '#07050f' : '#4a3a68', fontSize:14, fontWeight:900, cursor: canGenerate && !extracting ? 'pointer' : 'default', letterSpacing:2, boxShadow: canGenerate && !extracting ? `0 0 28px rgba(167,139,250,0.35)` : 'none', transition:'all 0.2s' }}>
                  UPGRADE MY CV →
                </button>
              </div>
            )}

            {/* ── GENERATING ── */}
            {phase === 'generating' && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:20, animation:'fadeIn 0.4s ease both' }}>
                <div style={{ position:'relative', width:64, height:64 }}>
                  <div style={{ position:'absolute', inset:0, border:`2px solid ${P}22`, borderTop:`2px solid ${P}`, borderRadius:'50%', animation:'spin 0.9s linear infinite' }} />
                  <div style={{ position:'absolute', inset:8, border:`2px solid ${P}11`, borderBottom:`2px solid ${P}88`, borderRadius:'50%', animation:'spin 1.4s linear infinite reverse' }} />
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>📄</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:15, fontWeight:800, color:'#e0d8ff', marginBottom:6 }}>
                    {mode === 'generate' ? 'Building your CV...' : 'Upgrading your CV...'}
                  </div>
                  <div style={{ fontSize:12, color:'#5a4a78', lineHeight:1.7 }}>
                    AI is crafting a world-class<br />hospitality resume for you
                  </div>
                </div>
              </div>
            )}

            {/* ── RESULT ── */}
            {phase === 'result' && resume && (
              <div style={{ animation:'pop 0.4s ease both', display:'flex', flexDirection:'column', gap:14 }}>

                {/* Action buttons */}
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={copyResume}
                    style={{ flex:1, padding:'11px', borderRadius:10, border:`1px solid ${PB}`, background: copied ? `${P}18` : PG, color: copied ? P : '#9a8aaa', fontSize:11, fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <button onClick={downloadResume}
                    style={{ flex:1, padding:'11px', borderRadius:10, border:`1px solid ${PB}`, background:PG, color:'#9a8aaa', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                    ⬇️ Download .txt
                  </button>
                  <button onClick={() => { setResume(null); setPhase('intro'); setCvText('') }}
                    style={{ flex:1, padding:'11px', borderRadius:10, border:`1px solid rgba(167,139,250,0.1)`, background:'transparent', color:'#5a4a78', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                    🔄 New CV
                  </button>
                </div>

                {/* Resume card */}
                <div style={{ background:'rgba(8,6,16,0.95)', border:`1px solid rgba(167,139,250,0.12)`, borderTop:`3px solid ${P}`, borderRadius:14, padding:'20px 18px' }}>

                  {/* Name & Title */}
                  <div style={{ textAlign:'center', marginBottom:20, paddingBottom:16, borderBottom:`1px solid rgba(167,139,250,0.1)` }}>
                    <div style={{ fontSize:20, fontWeight:900, color:'#e0d8ff', letterSpacing:1, marginBottom:4 }}>{resume.name || '[Your Name]'}</div>
                    <div style={{ fontSize:12, color:P, fontWeight:600, letterSpacing:1 }}>{resume.title}</div>
                    <div style={{ fontSize:10, color:'#3a2a58', marginTop:6 }}>London · Dubai · International · Available for relocation</div>
                  </div>

                  {/* Summary */}
                  <Section title="PROFESSIONAL SUMMARY">
                    <p style={{ fontSize:12, color:'#8a7aaa', lineHeight:1.75 }}>{resume.summary}</p>
                  </Section>

                  {/* Competencies */}
                  <Section title="CORE COMPETENCIES">
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {resume.competencies.map(c => (
                        <span key={c} style={{ fontSize:10, color:`${P}cc`, background:`${P}10`, border:`1px solid ${P}22`, borderRadius:5, padding:'3px 8px', fontWeight:600 }}>{c}</span>
                      ))}
                    </div>
                  </Section>

                  {/* Experience */}
                  {resume.experience.length > 0 && (
                    <Section title="EXPERIENCE">
                      {resume.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: i < resume.experience.length - 1 ? 16 : 0 }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:3 }}>
                            <div style={{ fontSize:13, fontWeight:800, color:'#d0c8f0' }}>{exp.role}</div>
                            <div style={{ fontSize:9, color:'#4a3a68', whiteSpace:'nowrap', marginLeft:8 }}>{exp.period}</div>
                          </div>
                          <div style={{ fontSize:11, color:P, opacity:0.7, marginBottom:6 }}>{exp.company}</div>
                          {exp.bullets.map((b, j) => (
                            <div key={j} style={{ display:'flex', gap:8, marginBottom:4 }}>
                              <span style={{ color:`${P}55`, flexShrink:0, marginTop:1 }}>›</span>
                              <span style={{ fontSize:11, color:'#6a5a88', lineHeight:1.6 }}>{b}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </Section>
                  )}

                  {/* Education */}
                  {resume.education.length > 0 && (
                    <Section title="EDUCATION">
                      {resume.education.map((e, i) => (
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:'#c0b0f0' }}>{e.degree}</div>
                            <div style={{ fontSize:10, color:'#5a4a78' }}>{e.institution}</div>
                          </div>
                          <div style={{ fontSize:10, color:'#3a2a58', flexShrink:0, marginLeft:8 }}>{e.year}</div>
                        </div>
                      ))}
                    </Section>
                  )}

                  {/* Languages */}
                  <Section title="LANGUAGES">
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {resume.languages.map(l => (
                        <span key={l} style={{ fontSize:11, color:'#8a7aaa', background:'rgba(167,139,250,0.05)', border:`1px solid rgba(167,139,250,0.12)`, borderRadius:6, padding:'3px 10px' }}>{l}</span>
                      ))}
                    </div>
                  </Section>

                  {/* Certifications */}
                  {resume.certifications && resume.certifications.length > 0 && (
                    <Section title="CERTIFICATIONS">
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                        {resume.certifications.map(c => (
                          <span key={c} style={{ fontSize:10, color:`${P}99`, background:`${P}08`, border:`1px solid ${P}18`, borderRadius:5, padding:'3px 8px', fontWeight:600 }}>{c}</span>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Additional Skills */}
                  {resume.additionalSkills.length > 0 && (
                    <Section title="ADDITIONAL SKILLS">
                      <div style={{ fontSize:11, color:'#6a5a88', lineHeight:1.8 }}>
                        {resume.additionalSkills.join(' · ')}
                      </div>
                    </Section>
                  )}

                  <div style={{ marginTop:16, paddingTop:12, borderTop:`1px solid rgba(167,139,250,0.06)`, fontSize:9, color:'#2a1a48', textAlign:'center', letterSpacing:1 }}>
                    Generated by ON DUTY AI · Tailor before sending · Add your contact details
                  </div>
                </div>

                <div style={{ background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.15)', borderRadius:10, padding:'12px 14px' }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#fbbf24', marginBottom:4 }}>⚠️ BEFORE SENDING</div>
                  <div style={{ fontSize:10, color:'#8a7020', lineHeight:1.6 }}>Add your email, phone, LinkedIn, and location. Review all experience for accuracy. Personalise for each application.</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
