'use client'
export default function OptionC() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh', padding: '40px 60px', fontFamily: '"Inter", system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #10B98115 0%, transparent 70%)', pointerEvents: 'none' }} />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 120 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontSize: 14, fontWeight: 900 }}>W</span>
          </div>
          <span style={{ color: '#EFEFEF', fontSize: 18, fontWeight: 700 }}>Waiter</span>
        </div>
        <div style={{ display: 'flex', gap: 36 }}>
          {['Features', 'Pricing', 'About', 'Sign in'].map(l => (
            <span key={l} style={{ color: '#666', fontSize: 13 }}>{l}</span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 680 }}>
        <div style={{ marginBottom: 28 }}>
          <span style={{ background: '#0C1F19', color: '#10B981', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', padding: '6px 16px', borderRadius: 20, border: '1px solid #10B98133' }}>
            ✦ No credit card required
          </span>
        </div>

        <h1 style={{ color: '#EFEFEF', fontFamily: '"Inter", sans-serif', fontSize: 66, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.05, margin: '0 0 24px' }}>
          Restaurant teams<br />that know more,<br />earn more.
        </h1>

        <p style={{ color: '#666', fontSize: 18, lineHeight: 1.7, margin: '0 0 48px', maxWidth: 460 }}>
          AI training tools for front-of-house staff who take service seriously.
        </p>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button style={{ background: '#10B981', color: '#000', border: 'none', padding: '16px 36px', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Start Training
          </button>
          <span style={{ color: '#666', fontSize: 14 }}>See how it works →</span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 56, flexWrap: 'wrap' }}>
          {['AI menu coach', 'Live POS drills', 'Instant staff briefings'].map(f => (
            <span key={f} style={{ background: '#111', border: '1px solid #1C1C1C', color: '#666', fontSize: 12, padding: '6px 14px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#10B981' }}>✓</span> {f}
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 32, right: 60, color: '#1C1C1C', fontSize: 12, letterSpacing: 2 }}>OPTION C — OBSIDIAN EMERALD</div>
    </div>
  )
}
