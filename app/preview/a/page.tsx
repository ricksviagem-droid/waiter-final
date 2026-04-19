'use client'
export default function OptionA() {
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', padding: '40px 60px', fontFamily: '"Georgia", serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #C9A84C18 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #C9A84C0A 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 120 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ color: '#F5F0E8', fontSize: 22, fontWeight: 700, letterSpacing: 4, fontFamily: '"Playfair Display", Georgia, serif' }}>WAITER</span>
          <span style={{ color: '#C9A84C', fontSize: 11, fontWeight: 600, letterSpacing: 5 }}>INTELLIGENCE</span>
        </div>
        <div style={{ display: 'flex', gap: 36 }}>
          {['Features', 'Pricing', 'About', 'Sign in'].map(l => (
            <span key={l} style={{ color: '#888', fontSize: 13, letterSpacing: 1 }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 680 }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ background: '#1E1A12', color: '#C9A84C', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 16px', borderRadius: 20, border: '1px solid #C9A84C44' }}>
            ✦ Trusted by Michelin-starred kitchens
          </span>
        </div>

        <h1 style={{ color: '#F5F0E8', fontFamily: '"Playfair Display", Georgia, serif', fontSize: 72, fontWeight: 400, letterSpacing: 1, lineHeight: 1.1, margin: '0 0 24px' }}>
          The Art of<br />Effortless Service
        </h1>

        <p style={{ color: '#888', fontSize: 18, lineHeight: 1.7, margin: '0 0 48px', maxWidth: 480 }}>
          AI-powered tools crafted for the world's finest restaurants. Train your team to the standard your guests expect.
        </p>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <button style={{ background: '#C9A84C', color: '#000', border: 'none', padding: '16px 36px', borderRadius: 2, fontWeight: 700, fontSize: 14, cursor: 'pointer', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Begin Your Journey
          </button>
          <span style={{ color: '#888', fontSize: 14 }}>See how it works →</span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 56, flexWrap: 'wrap' }}>
          {['Intelligent menu training', 'POS scenario simulator', 'Guest-ready briefings'].map(f => (
            <span key={f} style={{ background: '#141414', border: '1px solid #2A2A2A', color: '#888', fontSize: 12, padding: '6px 14px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#C9A84C' }}>✓</span> {f}
            </span>
          ))}
        </div>
      </div>

      {/* Label */}
      <div style={{ position: 'absolute', bottom: 32, right: 60, color: '#333', fontSize: 12, letterSpacing: 2 }}>OPTION A — LUXURY NOIR</div>
    </div>
  )
}
