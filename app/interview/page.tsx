'use client'

import { useState, useCallback } from 'react'
import { QUESTIONS, TOTAL_QUESTIONS } from '@/lib/interview/data'
import type { QuestionResult } from '@/lib/interview/data'
import QuestionScene from './components/QuestionScene'
import InterviewReport from './components/InterviewReport'

const S = '#7ab0cc'
const SB = 'rgba(122,176,204,0.22)'
const SBG = 'rgba(122,176,204,0.06)'

type AppState = 'intro' | 'interview' | 'report'

export default function InterviewPage() {
  const [state, setState] = useState<AppState>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [results, setResults] = useState<QuestionResult[]>([])

  const handleComplete = useCallback((result: QuestionResult) => {
    const updated = [...results, result]
    setResults(updated)
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      setState('report')
    } else {
      setQuestionIndex(i => i + 1)
    }
  }, [results, questionIndex])

  const handleRestart = useCallback(() => {
    setResults([])
    setQuestionIndex(0)
    setState('intro')
  }, [])

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(122,176,204,0.5)}50%{box-shadow:0 0 0 10px rgba(122,176,204,0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#1a2a3a; border-radius:4px; }
      `}</style>

      <div style={{ minHeight:'100dvh', background:'linear-gradient(160deg,#04060a 0%,#060c12 50%,#04060a 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-geist-sans,Arial,sans-serif)', padding:0 }}>
        <div style={{ width:'100%', maxWidth:430, height:'100dvh', maxHeight:900, background:'#06090e', borderRadius:0, overflow:'hidden', display:'flex', flexDirection:'column', border:'1px solid '+SB, boxShadow:`0 0 60px rgba(122,176,204,0.07)` }}>

          {state === 'intro' && <IntroScreen onStart={() => { setQuestionIndex(0); setResults([]); setState('interview') }} />}

          {state === 'interview' && (
            <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', animation:'fadeIn 0.3s ease' }}>
              <QuestionScene
                key={`q-${questionIndex}`}
                question={QUESTIONS[questionIndex]}
                questionIndex={questionIndex}
                onComplete={handleComplete}
              />
            </div>
          )}

          {state === 'report' && (
            <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
              <InterviewReport results={results} onRestart={handleRestart} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'28px 24px', gap:18, textAlign:'center', animation:'fadeIn 0.4s ease', overflowY:'auto' }}>

      {/* Badge */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(122,176,204,0.07)', border:'1px solid rgba(122,176,204,0.25)', borderRadius:20, padding:'5px 16px' }}>
          <span style={{ fontSize:11, color:S, fontWeight:700, letterSpacing:2 }}>PROFESSIONAL INTERVIEW</span>
        </div>
        <h1 style={{ fontSize:28, fontWeight:900, color:'#e4eef4', letterSpacing:2, margin:0 }}>
          Interview Simulator
        </h1>
        <p style={{ fontSize:10, color:'#4a6a7a', fontWeight:600, letterSpacing:4, margin:0, textTransform:'uppercase' }}>
          Luxury Restaurant · AI Powered
        </p>
        <p style={{ fontSize:13, color:S, fontStyle:'italic', margin:0, opacity:0.85 }}>
          "Train for the interview. Land the job."
        </p>
      </div>

      {/* What to expect */}
      <div style={{ background:SBG, border:'1px solid '+SB, borderRadius:14, padding:'14px 16px', width:'100%', textAlign:'left' }}>
        <div style={{ fontSize:10, color:S, fontWeight:700, letterSpacing:2, marginBottom:10 }}>WHAT TO EXPECT</div>
        {[
          ['🎙', '10 real interview questions asked by Rick in audio'],
          ['📹', 'Camera opens — you record your answer in video'],
          ['⏱', 'Timer per question (60–90 seconds)'],
          ['🇧🇷', 'Caption EN + Portuguese translation available'],
          ['📋', 'Full AI report: English, knowledge, professionalism'],
          ['🏢', 'HR summary for shortlisting'],
        ].map(([icon, text]) => (
          <div key={text as string} style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start' }}>
            <span style={{ fontSize:14, flexShrink:0 }}>{icon}</span>
            <span style={{ fontSize:12, color:'#7aa8c0', lineHeight:1.5 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Rick card */}
      <div style={{ display:'flex', alignItems:'center', gap:14, background:'linear-gradient(135deg,rgba(6,9,14,0.95),rgba(4,6,10,0.95))', border:'1px solid rgba(122,176,204,0.2)', borderRadius:14, padding:'12px 14px', width:'100%', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${S},transparent)` }} />
        <div style={{ position:'relative', flexShrink:0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/scenes/rick.jpeg" alt="Rick" style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', objectPosition:'50% 25%', display:'block' }}
            onError={e => { const el=e.currentTarget; el.style.display='none'; (el.nextSibling as HTMLElement).style.display='flex' }}
          />
          <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(122,176,204,0.15)', display:'none', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:S }}>R</div>
          <div style={{ position:'absolute', inset:-2, borderRadius:'50%', border:'2px solid transparent', background:`linear-gradient(#04060a,#04060a) padding-box, linear-gradient(135deg,${S},#3a78a8) border-box` }} />
          <div style={{ position:'absolute', bottom:1, right:1, width:10, height:10, borderRadius:'50%', background:'#22c55e', border:'2px solid #04060a' }} />
        </div>
        <div style={{ textAlign:'left' }}>
          <div style={{ fontSize:13, fontWeight:800, color:'#e4eef4', marginBottom:2 }}>
            Rick — Your Interviewer
            <span style={{ marginLeft:7, fontSize:9, color:S, background:'rgba(122,176,204,0.1)', border:'1px solid rgba(122,176,204,0.3)', borderRadius:5, padding:'1px 6px' }}>ONLINE</span>
          </div>
          <p style={{ fontSize:11, color:'#4a6a7a', margin:0, lineHeight:1.5 }}>
            Vai conduzir sua entrevista, avaliar cada resposta e dar coaching personalizado no final.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, width:'100%' }}>
        {[
          { icon:'❓', label:'10 Questions', sub:'5 categories' },
          { icon:'📹', label:'Video Answer', sub:'Record yourself' },
          { icon:'📊', label:'AI Report', sub:'HR shortlist' },
        ].map(({ icon, label, sub }) => (
          <div key={label} style={{ background:SBG, border:'1px solid '+SB, borderRadius:12, padding:'10px 6px', textAlign:'center' }}>
            <div style={{ fontSize:18 }}>{icon}</div>
            <div style={{ fontSize:11, fontWeight:700, color:'#e4eef4', marginTop:4 }}>{label}</div>
            <div style={{ fontSize:9, color:'#3a5a6a', marginTop:2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button onClick={onStart} style={{ width:'100%', padding:'15px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${S},#4a88a8)`, color:'#04060a', fontSize:14, fontWeight:900, cursor:'pointer', boxShadow:`0 0 28px rgba(122,176,204,0.4)`, letterSpacing:3 }}>
        BEGIN INTERVIEW
      </button>

      <p style={{ fontSize:10, color:'#2a4a5a', margin:0 }}>
        Camera + microphone required · English responses · AI evaluation
      </p>
    </div>
  )
}
