'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { PAL, SOCIAL, BOOKING_URL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, DisplayHeading, MagneticButton } from './shared';

export default function OceanAbout() {
  const { t } = useOcean();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="about"
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(100px, 14vw, 180px) clamp(20px, 5vw, 80px)',
        background: `linear-gradient(180deg, ${PAL.ocean} 0%, ${PAL.oceanDeep} 100%)`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none', background: `radial-gradient(circle at 25% 30%, ${PAL.gold}25, transparent 55%), radial-gradient(circle at 80% 80%, ${PAL.coral}18, transparent 55%)` }} />
      <div style={{ position: 'relative', maxWidth: 1300, margin: '0 auto' }}>
        <div className="ocean-about-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 6fr', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>

          {/* Photo */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', boxShadow: `0 30px 80px ${PAL.oceanDeep}`, transform: inView ? 'translateX(0)' : 'translateX(-60px)', opacity: inView ? 1 : 0, transition: 'transform 900ms cubic-bezier(.2,.8,.2,1), opacity 900ms' }}>
              <img src="/scenes/rick-black-suit.jpeg" alt="Ricardo Rogério" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.05) brightness(0.92)' }} />
              <span style={{ position: 'absolute', top: -10, left: -10, width: 60, height: 60, borderTop: `2px solid ${PAL.gold}`, borderLeft: `2px solid ${PAL.gold}` }} />
              <span style={{ position: 'absolute', bottom: -10, right: -10, width: 60, height: 60, borderBottom: `2px solid ${PAL.gold}`, borderRight: `2px solid ${PAL.gold}` }} />
              <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, background: 'rgba(5,28,54,0.85)', backdropFilter: 'blur(14px)', border: `1px solid ${PAL.gold}40`, padding: '14px 18px' }}>
                <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, letterSpacing: '0.28em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                  Maître · Atlantis The Royal
                </div>
                <div style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 18, color: PAL.cream, fontStyle: 'italic' }}>
                  "Conheço cada porta dessa indústria."
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <Eyebrow color={PAL.gold}>{t.about.kicker}</Eyebrow>
            <div style={{ marginTop: 24 }}>
              <DisplayHeading part1={t.about.title1} part2={t.about.title2} color1={PAL.cream} color2={PAL.gold} />
            </div>
            <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, letterSpacing: '0.24em', color: PAL.coral, textTransform: 'uppercase', fontWeight: 600, marginTop: 20 }}>{t.about.role}</div>
            <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(15px, 1.15vw, 17.5px)', color: 'rgba(248,241,229,0.85)', lineHeight: 1.7, fontWeight: 300, marginTop: 28, maxWidth: 580 }}>
              {t.about.body}
            </p>
            <p style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontStyle: 'italic', fontSize: 'clamp(17px, 1.3vw, 21px)', color: PAL.cream, lineHeight: 1.55, fontWeight: 400, marginTop: 22, maxWidth: 580, borderLeft: `2px solid ${PAL.gold}`, paddingLeft: 22 }}>
              {t.about.body2}
            </p>
            <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {t.about.badges.map((b, i) => (
                <span key={i} style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, fontWeight: 500, color: PAL.gold, border: `1px solid ${PAL.gold}55`, padding: '7px 14px', borderRadius: 999, background: 'rgba(212,165,116,0.08)' }}>{b}</span>
              ))}
            </div>
            <div style={{ marginTop: 40, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <MagneticButton primary href={BOOKING_URL}>{t.about.cta}</MagneticButton>
              <MagneticButton href={SOCIAL.whatsapp}>{t.about.cta2}</MagneticButton>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .ocean-about-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
