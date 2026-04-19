'use client'

import { useState } from 'react'

const options = [
  {
    id: 'A',
    name: 'Luxury Noir',
    desc: 'Black + warm gold — Forbes 5-star, European fine dining',
    bg: '#0A0A0A',
    accent: '#C9A84C',
    surface: '#141414',
    border: '#2A2A2A',
    text: '#F5F0E8',
    muted: '#888',
    pill: '#1E1A12',
    pillText: '#C9A84C',
    font: '"Playfair Display", Georgia, serif',
    headFont: '"Playfair Display", Georgia, serif',
    logo: 'WAITER',
    logoSub: 'INTELLIGENCE',
    tagline: 'The Art of Effortless Service',
    sub: 'AI-powered tools crafted for the world\'s finest restaurants.',
    ctaLabel: 'Begin Your Journey',
    badge: 'Trusted by Michelin-starred kitchens',
    features: ['Intelligent menu training', 'POS scenario simulator', 'Guest-ready briefings'],
  },
  {
    id: 'B',
    name: 'Deep Navy',
    desc: 'Navy + azure — Mediterranean beach club, upscale resort',
    bg: '#071828',
    accent: '#3B82F6',
    surface: '#0D2337',
    border: '#1A3A52',
    text: '#F0F4F8',
    muted: '#7BA3C4',
    pill: '#0F2D44',
    pillText: '#60A5FA',
    font: '"Inter", system-ui, sans-serif',
    headFont: '"DM Sans", "Inter", sans-serif',
    logo: 'waiter',
    logoSub: 'ai',
    tagline: 'Your team. Perfectly prepared.',
    sub: 'From menu knowledge to POS mastery — train smarter, serve better.',
    ctaLabel: 'Get Started Free',
    badge: '500+ hospitality teams onboarded',
    features: ['Menu knowledge base', 'POS training simulator', 'Performance analytics'],
  },
  {
    id: 'C',
    name: 'Obsidian Emerald',
    desc: 'Near-black + emerald — ultra-minimal, modern hospitality tech',
    bg: '#080808',
    accent: '#10B981',
    surface: '#111111',
    border: '#1C1C1C',
    text: '#EFEFEF',
    muted: '#666',
    pill: '#0C1F19',
    pillText: '#10B981',
    font: '"Inter", system-ui, sans-serif',
    headFont: '"Inter", system-ui, sans-serif',
    logo: 'Waiter',
    logoSub: '',
    tagline: 'Restaurant teams that know more, earn more.',
    sub: 'AI training tools for front-of-house staff who take service seriously.',
    ctaLabel: 'Start Training',
    badge: 'No credit card required',
    features: ['AI menu coach', 'Live POS drills', 'Instant staff briefings'],
  },
]

export default function PreviewPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', padding: '40px 20px 80px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ color: '#666', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Design Preview</p>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Choose a Direction</h1>
          <p style={{ color: '#888', marginTop: 8, fontSize: 15 }}>3 options for the landing screen — click one to select</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {options.map((o) => (
            <div key={o.id} onClick={() => setSelected(o.id)}
              style={{
                cursor: 'pointer',
                borderRadius: 16,
                overflow: 'hidden',
                border: `2px solid ${selected === o.id ? o.accent : '#222'}`,
                transition: 'border-color 0.2s, transform 0.15s',
                transform: selected === o.id ? 'scale(1.01)' : 'scale(1)',
                boxShadow: selected === o.id ? `0 0 32px ${o.accent}33` : 'none',
              }}>

              {/* Label bar */}
              <div style={{ background: '#161616', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Option {o.id} — {o.name}</span>
                  <p style={{ color: '#666', fontSize: 12, margin: '2px 0 0' }}>{o.desc}</p>
                </div>
                {selected === o.id && (
                  <span style={{ background: o.accent, color: '#000', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>SELECTED</span>
                )}
              </div>

              {/* Simulated screen */}
              <div style={{ background: o.bg, padding: '40px 32px 48px', minHeight: 520, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

                {/* Background decoration */}
                <div style={{
                  position: 'absolute', top: -80, right: -80,
                  width: 280, height: 280, borderRadius: '50%',
                  background: `radial-gradient(circle, ${o.accent}18 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Nav */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 56 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ color: o.text, fontFamily: o.headFont, fontSize: 20, fontWeight: 800, letterSpacing: o.id === 'A' ? 3 : 0 }}>
                      {o.logo}
                    </span>
                    {o.logoSub && (
                      <span style={{ color: o.accent, fontSize: o.id === 'A' ? 11 : 16, fontWeight: o.id === 'B' ? 800 : 600, letterSpacing: o.id === 'A' ? 4 : 0 }}>
                        {o.logoSub}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 20 }}>
                    {['Features', 'Pricing', 'Sign in'].map(l => (
                      <span key={l} style={{ color: o.muted, fontSize: 13, fontFamily: o.font }}>{l}</span>
                    ))}
                  </div>
                </div>

                {/* Badge */}
                <div style={{ marginBottom: 24 }}>
                  <span style={{
                    background: o.pill, color: o.pillText,
                    fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
                    textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20,
                    border: `1px solid ${o.accent}44`,
                    fontFamily: o.font,
                  }}>
                    ✦ {o.badge}
                  </span>
                </div>

                {/* Headline */}
                <h2 style={{
                  color: o.text, margin: '0 0 16px',
                  fontFamily: o.headFont,
                  fontSize: o.id === 'A' ? 34 : 32,
                  fontWeight: o.id === 'A' ? 400 : 800,
                  letterSpacing: o.id === 'A' ? 1 : -0.5,
                  lineHeight: 1.2,
                  maxWidth: 320,
                }}>
                  {o.tagline}
                </h2>

                {/* Sub */}
                <p style={{ color: o.muted, fontSize: 14, lineHeight: 1.6, maxWidth: 300, margin: '0 0 32px', fontFamily: o.font }}>
                  {o.sub}
                </p>

                {/* CTA */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
                  <button style={{
                    background: o.accent,
                    color: o.id === 'B' ? '#fff' : '#000',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: o.id === 'A' ? 2 : 8,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    fontFamily: o.font,
                    letterSpacing: o.id === 'A' ? 1 : 0,
                  }}>
                    {o.ctaLabel}
                  </button>
                  <span style={{ color: o.muted, fontSize: 13, fontFamily: o.font }}>See how it works →</span>
                </div>

                {/* Feature pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {o.features.map(f => (
                    <span key={f} style={{
                      background: o.surface,
                      border: `1px solid ${o.border}`,
                      color: o.muted,
                      fontSize: 12,
                      padding: '5px 12px',
                      borderRadius: 6,
                      fontFamily: o.font,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{ color: o.accent }}>✓</span> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom action */}
        {selected && (
          <div style={{ textAlign: 'center', marginTop: 40, padding: '24px', background: '#111', borderRadius: 12, border: '1px solid #222' }}>
            <p style={{ color: '#fff', margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>
              Option {selected} selected — {options.find(o => o.id === selected)?.name}
            </p>
            <p style={{ color: '#666', margin: 0, fontSize: 14 }}>
              Tell me to go ahead and I'll apply this design to the full app.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
