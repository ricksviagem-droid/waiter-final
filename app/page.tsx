'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; }
      `}</style>

      <div style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg,#040b12 0%,#081422 50%,#040e1a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
        padding: 20,
      }}>
        <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 32, animation: 'fadeIn 0.5s ease' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: 2 }}>Career Analytics</h1>
            <p style={{ fontSize: 13, color: '#3b9eff', fontWeight: 600, letterSpacing: 3, marginTop: 4 }}>HOSPITALITY TRAINING</p>
          </div>

          {/* Option 1 — SHIFT */}
          <button
            onClick={() => router.push('/shift')}
            style={{
              width: '100%', padding: '28px 24px', borderRadius: 20,
              background: 'linear-gradient(135deg,#0a2a4a,#1a5fa8)',
              border: '1px solid #3b9eff',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 0 40px rgba(59,158,255,0.2)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(59,158,255,0.35)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(59,158,255,0.2)' }}
          >
            {/* PRO badge */}
            <div style={{ position: 'absolute', top: 14, right: 14, background: 'linear-gradient(135deg,#f59e0b,#b45309)', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 1, boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>PRO</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 32 }}>⚡</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>SHIFT Simulator</div>
                <div style={{ fontSize: 12, color: '#3b9eff', fontWeight: 600, letterSpacing: 2 }}>FORBES 5-STAR</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#7aa8cc', lineHeight: 1.6 }}>
              18 cenas completas de um turno real. Fale com os guests, responda ao Inspector, receba avaliação Forbes + relatório Rick Tutor.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {['18 Cenas', '45s Timer', 'Voz IA', 'PDF Report', 'Rick Tutor'].map(tag => (
                <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: '#3b9eff', background: 'rgba(59,158,255,0.1)', border: '1px solid rgba(59,158,255,0.3)', borderRadius: 10, padding: '3px 8px' }}>{tag}</span>
              ))}
            </div>
          </button>

          {/* Option 2 — Training Chat */}
          <button
            onClick={() => router.push('/training')}
            style={{
              width: '100%', padding: '28px 24px', borderRadius: 20,
              background: 'linear-gradient(135deg,#0d1f12,#1a3d20)',
              border: '1px solid #22c55e',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 0 40px rgba(34,197,94,0.12)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(34,197,94,0.25)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(34,197,94,0.12)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 32 }}>💬</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>Training Chat</div>
                <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, letterSpacing: 2 }}>LUXURY WAITER AI</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#7aa8cc', lineHeight: 1.6 }}>
              Converse com um guest AI em tempo real. Pratique respostas, receba feedback por turno e melhore seu inglês de hospitalidade.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {['Chat IA', 'Feedback', 'Pontuação', 'Medalhas'].map(tag => (
                <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '3px 8px' }}>{tag}</span>
              ))}
            </div>
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#2a4a6a' }}>Career Analytics AI · Hospitality Edition</p>
        </div>
      </div>
    </>
  )
}
