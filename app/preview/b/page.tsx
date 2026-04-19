'use client'
export default function OptionB() {
  return (
    <div style={{ background: '#071828', minHeight: '100vh', padding: '40px 60px', fontFamily: '"Inter", system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #3B82F620 0%, transparent 70%)', pointerEvents: 'none' }} />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 120 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ color: '#F0F4F8', fontSize: 22, fontWeight: 800 }}>waiter</span>
          <span style={{ color: '#3B82F6', fontSize: 22, fontWeight: 800 }}>ai</span>
        </div>
        <div style={{ display: 'flex', gap: 36 }}>
          {['Features', 'Pricing', 'About', 'Sign in'].map(l => (
            <span key={l} style={{ color: '#7BA3C4', fontSize: 13 }}>{l}</span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 680 }}>
        <div style={{ marginBottom: 28 }}>
          <span style={{ background: '#0F2D44', color: '#60A5FA', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', padding: '6px 16px', borderRadius: 20, border: '1px solid #3B82F644' }}>
            ✦ 500+ hospitality teams onboarded
          </span>
        </div>

        <h1 style={{ color: '#F0F4F8', fontFamily: '"DM Sans", Inter, sans-serif', fontSize: 68, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1, margin: '0 0 24px' }}>
          Your team.<br />Perfectly prepared.
        </h1>

        <p style={{ color: '#7BA3C4', fontSize: 18, lineHeight: 1.7, margin: '0 0 48px', maxWidth: 480 }}>
          From menu knowledge to POS mastery — train smarter, serve better, and keep every guest coming back.
        </p>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '16px 36px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Get Started Free
          </button>
          <button style={{ background: 'transparent', color: '#7BA3C4', border: '1px solid #1A3A52', padding: '16px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
            See how it works →
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 56, flexWrap: 'wrap' }}>
          {['Menu knowledge base', 'POS training simulator', 'Performance analytics'].map(f => (
            <span key={f} style={{ background: '#0D2337', border: '1px solid #1A3A52', color: '#7BA3C4', fontSize: 12, padding: '6px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#3B82F6' }}>✓</span> {f}
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 32, right: 60, color: '#1A3A52', fontSize: 12, letterSpacing: 2 }}>OPTION B — DEEP NAVY</div>
    </div>
  )
}
