'use client'

interface RickTutorProps {
  tip: string
  visible: boolean
}

export default function RickTutor({ tip, visible }: RickTutorProps) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        width: 220,
        background: 'rgba(10,20,35,0.92)',
        border: '1px solid #3b9eff',
        borderRadius: 12,
        padding: '10px 12px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 16px rgba(59,158,255,0.3)',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#3b9eff,#1a5fa8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          R
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#3b9eff', letterSpacing: 1 }}>
          RICK TUTOR
        </span>
      </div>
      <p style={{ fontSize: 12, color: '#c8dff5', lineHeight: 1.5, margin: 0 }}>{tip}</p>
    </div>
  )
}
