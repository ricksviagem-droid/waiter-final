'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const Y = '#fbbf24'
const YB = 'rgba(251,191,36,0.22)'
const YBG = 'rgba(251,191,36,0.07)'

type Tab = 'dubai' | 'qatar' | 'london'

const DESTINATIONS = {
  dubai: {
    flag: '🇦🇪', city: 'Dubai', country: 'UAE', color: Y,
    headline: 'The world\'s hospitality capital',
    sub: 'Tax-free income. World-class hotels. Fast career growth.',
    salary: { role: 'Waiter / Server', base: 'AED 2,500–4,000', tips: 'AED 1,000–3,000', total: 'AED 5,000–8,500', brl: 'R$7,500–12,700', brazil: 'R$1,800–3,200' },
    benefits: ['Accommodation provided or allowance', 'Annual return flight to Brazil', 'Medical insurance', 'Tips in USD/EUR from international guests', 'Staff meals on duty', 'Visa sponsored by employer'],
    hotels: ['Burj Al Arab — Jumeirah', 'Atlantis The Palm', 'Four Seasons DIFC', 'Waldorf Astoria', 'Armani Hotel', 'Address Downtown', 'W Dubai', 'Ritz-Carlton DIFC'],
    requirements: ['B2+ English (conversational and professional)', '2+ years fine dining experience', 'Clean professional appearance', 'Valid passport + no criminal record', 'Flexibility with working hours / shifts'],
    lifestyle: ['Work 8–10 hour shifts, 5–6 days/week', 'Shared staff accommodation (often provided)', 'Multicultural team — colleagues from 30+ countries', 'No income tax — everything you earn, you keep', 'Growth to Captain in 1–2 years, Maître in 3–5'],
    warning: 'Avoid agencies that charge fees. Legitimate employers sponsor your visa and arrange flights. Never pay to get a job.',
  },
  qatar: {
    flag: '🇶🇦', city: 'Doha', country: 'Qatar', color: '#a78bfa',
    headline: 'Luxury at scale — post-World Cup growth',
    sub: 'High demand. Tax-free. Premium properties.',
    salary: { role: 'Waiter / Server', base: 'QAR 2,200–3,800', tips: 'QAR 800–2,000', total: 'QAR 4,000–7,000', brl: 'R$6,000–10,500', brazil: 'R$1,800–3,200' },
    benefits: ['Accommodation included', 'Annual flight allowance', 'Health insurance', 'Tax-free salary', 'Career development programmes', 'Visa sponsored'],
    hotels: ['W Doha', 'St. Regis Doha', 'Four Seasons Doha', 'Raffles Doha', 'The Ned Doha', 'Mondrian Doha'],
    requirements: ['B2+ English', '2+ years hospitality experience', 'Cultural sensitivity and professionalism', 'Flexibility with schedule'],
    lifestyle: ['Strong expat community', 'Similar structure to Dubai', 'Growing luxury hotel market since 2022 World Cup', 'Slightly lower cost of living than Dubai'],
    warning: 'Do your research on the specific property. Standards vary significantly. Aim for international luxury brands.',
  },
  london: {
    flag: '🇬🇧', city: 'London', country: 'UK', color: '#38bdf8',
    headline: 'The fine dining capital of Europe',
    sub: 'Michelin stars. Top salaries. World recognition.',
    salary: { role: 'Waiter / Server', base: '£1,800–2,600/mo', tips: '£600–1,500/mo', total: '£2,400–4,100/mo', brl: 'R$15,000–25,600', brazil: 'R$1,800–3,200' },
    benefits: ['National minimum wage guarantee', 'Tips paid on top (often cash)', 'NHS healthcare access', 'Defined shift hours', 'World-class training opportunities', 'Path to Michelin-starred properties'],
    hotels: ['The Ritz London', 'Claridge\'s', 'The Savoy', 'Nobu Hotel', 'Gordon Ramsay Restaurants', 'Sketch', 'Brasserie Zédel'],
    requirements: ['Strong English — C1 level preferred', 'Work visa (Skilled Worker or Youth Mobility)', 'Fine dining experience is essential', 'References from previous employers'],
    lifestyle: ['Higher cost of living — budget carefully', 'Large Brazilian community in London', 'Cultural exposure and career prestige', 'Route to working in world\'s best restaurants'],
    warning: 'UK visa requirements changed post-Brexit. Check gov.uk for current Skilled Worker visa rules. Youth Mobility visa (age 18–30) is the fastest route.',
  },
}

const CAREER_PATH = [
  { title: 'Waiter / Server', years: '0–2 yrs', salary: 'Entry level', icon: '🍽️', color: '#4a5a52' },
  { title: 'Senior Waiter / Captain', years: '2–4 yrs', salary: '+15–25%', icon: '⭐', color: '#818cf8' },
  { title: 'Maître d\'Hôtel', years: '4–7 yrs', salary: '+40–60%', icon: '🎩', color: '#38bdf8' },
  { title: 'Restaurant Manager', years: '6–9 yrs', salary: '+80–120%', icon: '📋', color: '#f59e0b' },
  { title: 'F&B Manager / Director', years: '8+ yrs', salary: '+150–300%', icon: '🏆', color: Y },
]

export default function WorkAbroadPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('dubai')
  const dest = DESTINATIONS[tab]

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; background:#000; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#2a2010; border-radius:3px; }
      `}</style>

      <div style={{ minHeight:'100dvh', background:'linear-gradient(160deg,#0a0800 0%,#0f0d05 50%,#0a0800 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-geist-sans,Arial,sans-serif)' }}>
        <div style={{ width:'100%', maxWidth:430, height:'100dvh', maxHeight:900, background:'#0d0a05', display:'flex', flexDirection:'column', border:`1px solid ${YB}`, overflow:'hidden' }}>

          {/* Header */}
          <div style={{ background:'rgba(8,6,2,0.98)', borderBottom:`1px solid ${YB}`, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <button onClick={() => router.push('/')} style={{ background:'transparent', border:'none', color:'#4a3a1a', cursor:'pointer', fontSize:18, padding:0, lineHeight:1 }}>←</button>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:'#e8dfc8' }}>✈️ Work Abroad</div>
              <div style={{ fontSize:10, color:'#4a3a1a' }}>Salaries · Lifestyle · How to get hired</div>
            </div>
          </div>

          <div style={{ flex:1, overflowY:'auto' }}>

            {/* Hero */}
            <div style={{ padding:'20px 16px 0', animation:'fadeIn 0.4s ease' }}>
              <div style={{ background:`linear-gradient(135deg,${YBG},rgba(0,0,0,0.3))`, border:`1px solid ${YB}`, borderRadius:16, padding:'18px', marginBottom:16, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${Y},transparent)` }} />
                <div style={{ fontSize:11, color:Y, fontWeight:700, letterSpacing:2, marginBottom:6 }}>CAREER OPPORTUNITY</div>
                <h1 style={{ fontSize:22, fontWeight:900, color:'#e8dfc8', lineHeight:1.2, marginBottom:8 }}>
                  The same job.<br />
                  <span style={{ color:Y }}>3–5× the salary.</span>
                </h1>
                <p style={{ fontSize:12, color:'#6a5a3a', lineHeight:1.65 }}>
                  A waiter in São Paulo earns R$1,800–3,200/month. The same professional in Dubai earns the equivalent of R$7,500–12,700 — tax-free, with accommodation and flights included.
                </p>
              </div>

              {/* Brazil vs Abroad quick compare */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'12px', textAlign:'center' }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>🇧🇷</div>
                  <div style={{ fontSize:11, color:'#4a5a52', fontWeight:700, marginBottom:2 }}>Brazil (SP/RJ)</div>
                  <div style={{ fontSize:18, fontWeight:900, color:'#e8edf2' }}>R$2.5k</div>
                  <div style={{ fontSize:9, color:'#3a4a3a' }}>avg waiter/month</div>
                </div>
                <div style={{ background:YBG, border:`1px solid ${YB}`, borderRadius:12, padding:'12px', textAlign:'center', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:Y }} />
                  <div style={{ fontSize:18, marginBottom:4 }}>🇦🇪</div>
                  <div style={{ fontSize:11, color:Y, fontWeight:700, marginBottom:2 }}>Dubai (all-in)</div>
                  <div style={{ fontSize:18, fontWeight:900, color:Y }}>R$10k+</div>
                  <div style={{ fontSize:9, color:'#6a5a2a' }}>tax-free + housing</div>
                </div>
              </div>
            </div>

            {/* Destination tabs */}
            <div style={{ padding:'0 16px', marginBottom:2 }}>
              <div style={{ fontSize:10, color:'#3a2a1a', fontWeight:700, letterSpacing:2, marginBottom:8 }}>CHOOSE DESTINATION</div>
              <div style={{ display:'flex', gap:6 }}>
                {(Object.keys(DESTINATIONS) as Tab[]).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ flex:1, padding:'8px 4px', borderRadius:10, border:`1px solid ${tab === t ? DESTINATIONS[t].color + '60' : 'rgba(255,255,255,0.06)'}`, background: tab === t ? `${DESTINATIONS[t].color}12` : 'rgba(255,255,255,0.02)', color: tab === t ? DESTINATIONS[t].color : '#4a3a2a', fontSize:12, fontWeight:800, cursor:'pointer', transition:'all 0.15s' }}>
                    {DESTINATIONS[t].flag} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination content */}
            <div key={tab} style={{ padding:'12px 16px', animation:'fadeIn 0.3s ease' }}>

              {/* Headline */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:16, fontWeight:900, color:'#e8dfc8', marginBottom:3 }}>{dest.headline}</div>
                <div style={{ fontSize:12, color:dest.color, fontStyle:'italic' }}>{dest.sub}</div>
              </div>

              {/* Salary comparison */}
              <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'14px', marginBottom:10 }}>
                <div style={{ fontSize:10, color:dest.color, fontWeight:700, letterSpacing:2, marginBottom:10 }}>SALARY — {dest.salary.role.toUpperCase()}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    { label:'Base salary', value:dest.salary.base, color:'#e8dfc8' },
                    { label:'Tips (avg)', value:dest.salary.tips, color:dest.color },
                    { label:'Total monthly', value:dest.salary.total, color:dest.color, bold:true },
                    { label:'Equiv. in BRL', value:dest.salary.brl, color:Y, bold:true },
                    { label:'vs Brazil same role', value:dest.salary.brazil, color:'#4a5a52' },
                  ].map(({ label, value, color, bold }) => (
                    <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:11, color:'#4a3a2a' }}>{label}</span>
                      <span style={{ fontSize: bold ? 13 : 12, fontWeight: bold ? 800 : 600, color }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div style={{ background:YBG, border:`1px solid ${YB}`, borderRadius:12, padding:'12px', marginBottom:10 }}>
                <div style={{ fontSize:10, color:Y, fontWeight:700, letterSpacing:2, marginBottom:8 }}>WHAT\'S INCLUDED</div>
                {dest.benefits.map(b => (
                  <div key={b} style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}>
                    <span style={{ color:Y, fontSize:11, flexShrink:0, marginTop:1 }}>✓</span>
                    <span style={{ fontSize:11, color:'#7a6a4a', lineHeight:1.5 }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Top hotels */}
              <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'12px', marginBottom:10 }}>
                <div style={{ fontSize:10, color:dest.color, fontWeight:700, letterSpacing:2, marginBottom:8 }}>TOP HOTELS HIRING</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {dest.hotels.map(h => (
                    <span key={h} style={{ fontSize:10, color:'#6a5a3a', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:6, padding:'4px 8px' }}>{h}</span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'12px', marginBottom:10 }}>
                <div style={{ fontSize:10, color:dest.color, fontWeight:700, letterSpacing:2, marginBottom:8 }}>WHAT THEY EXPECT</div>
                {dest.requirements.map(r => (
                  <div key={r} style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}>
                    <span style={{ color:dest.color, fontSize:11, flexShrink:0, marginTop:1 }}>→</span>
                    <span style={{ fontSize:11, color:'#6a5a3a', lineHeight:1.5 }}>{r}</span>
                  </div>
                ))}
              </div>

              {/* Lifestyle */}
              <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'12px', marginBottom:10 }}>
                <div style={{ fontSize:10, color:dest.color, fontWeight:700, letterSpacing:2, marginBottom:8 }}>LIFESTYLE</div>
                {dest.lifestyle.map(l => (
                  <div key={l} style={{ display:'flex', gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:11, color:'#4a3a2a', flexShrink:0 }}>•</span>
                    <span style={{ fontSize:11, color:'#6a5a3a', lineHeight:1.5 }}>{l}</span>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div style={{ background:'rgba(248,113,113,0.06)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:12, padding:'12px', marginBottom:16 }}>
                <div style={{ fontSize:10, color:'#f87171', fontWeight:700, letterSpacing:1, marginBottom:4 }}>⚠️ IMPORTANT</div>
                <p style={{ fontSize:11, color:'#7a4a4a', lineHeight:1.6, margin:0 }}>{dest.warning}</p>
              </div>

              {/* Career path */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:10, color:'#3a2a1a', fontWeight:700, letterSpacing:2, marginBottom:10 }}>CAREER PATH ABROAD</div>
                {CAREER_PATH.map((step, i) => (
                  <div key={step.title} style={{ display:'flex', gap:10, marginBottom: i < CAREER_PATH.length - 1 ? 0 : 0, alignItems:'stretch' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, width:28 }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:`${step.color}18`, border:`1px solid ${step.color}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{step.icon}</div>
                      {i < CAREER_PATH.length - 1 && <div style={{ width:1, flex:1, background:'rgba(255,255,255,0.05)', margin:'4px 0', minHeight:16 }} />}
                    </div>
                    <div style={{ flex:1, paddingBottom: i < CAREER_PATH.length - 1 ? 12 : 0 }}>
                      <div style={{ fontSize:12, fontWeight:800, color: i === 0 ? '#e8dfc8' : step.color }}>{step.title}</div>
                      <div style={{ fontSize:10, color:'#3a2a1a' }}>{step.years} · <span style={{ color: i === 0 ? '#4a5a52' : Y }}>{step.salary}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display:'flex', flexDirection:'column', gap:8, paddingBottom:24 }}>
                <button onClick={() => router.push('/interview')}
                  style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${Y},#d97706)`, color:'#07050b', fontSize:13, fontWeight:900, cursor:'pointer', letterSpacing:1 }}>
                  PRACTICE YOUR INTERVIEW →
                </button>
                <button onClick={() => router.push('/level-scan')}
                  style={{ width:'100%', padding:'13px', borderRadius:12, border:`1px solid ${YB}`, background:'transparent', color:'#6a5a3a', fontSize:12, cursor:'pointer', fontWeight:700 }}>
                  Check my English level first
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
