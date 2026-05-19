'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { PAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, DisplayHeading } from './shared';

const PARTNERS = [
  { name: 'Atlantis The Royal', logo: 'A', desc: 'Dubai' },
  { name: 'MSC Cruises', logo: 'MSC', desc: 'Mediterranean · Caribbean' },
  { name: 'Royal Caribbean', logo: 'RC', desc: 'Cruise Line' },
  { name: 'Hilton Hotels', logo: 'H', desc: '5★ Properties' },
  { name: 'Four Seasons', logo: 'FS', desc: 'Luxury Hotels' },
  { name: 'Amazónico', logo: 'AZ', desc: 'Dubai' },
  { name: 'Casa Blanca', logo: 'CB', desc: 'Fine Dining' },
  { name: 'Ling Ling', logo: 'LL', desc: 'Dubai' },
  { name: 'Hakkasan', logo: 'HK', desc: 'Global' },
  { name: 'Norwegian Cruise', logo: 'NC', desc: 'Cruise Line' },
];

function PartnerLogo({ partner, delay }: { partner: typeof PARTNERS[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div
      ref={ref}
      data-cursor="link"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity: inView ? 0.55 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 600ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 600ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
        cursor: 'default',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0.55'; }}
    >
      {/* Logo circle */}
      <div style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: `linear-gradient(135deg, rgba(212,165,116,0.15), rgba(212,165,116,0.05))`,
        border: `1px solid ${PAL.gold}35`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-fraunces), Fraunces, serif',
        fontSize: partner.logo.length > 2 ? 13 : 20,
        fontWeight: 500,
        color: PAL.gold,
        letterSpacing: '-0.02em',
        transition: 'border-color 250ms, box-shadow 250ms',
      }}>
        {partner.logo}
      </div>

      {/* Name */}
      <div style={{
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        fontSize: 11,
        fontWeight: 500,
        color: PAL.cream,
        textAlign: 'center',
        letterSpacing: '0.04em',
        lineHeight: 1.3,
      }}>
        {partner.name}
      </div>
      <div style={{
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        fontSize: 9.5,
        color: 'rgba(248,241,229,0.4)',
        textAlign: 'center',
        letterSpacing: '0.08em',
      }}>
        {partner.desc}
      </div>
    </div>
  );
}

export default function OceanPartners() {
  const { t } = useOcean();

  return (
    <section id="partners" style={{ position: 'relative', padding: 'clamp(80px, 10vw, 130px) clamp(20px, 5vw, 80px)', background: `linear-gradient(180deg, ${PAL.ocean} 0%, ${PAL.oceanDeep} 100%)`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', right: '-10%', width: '40%', height: '50%', background: `radial-gradient(circle, ${PAL.gold}15, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(50px, 7vw, 80px)' }}>
          <Eyebrow color={PAL.gold}>{t.trusted.kicker}</Eyebrow>
          <div style={{ marginTop: 28 }}>
            <DisplayHeading part1={t.trusted.title1} part2={t.trusted.title2} color1={PAL.cream} color2={PAL.gold} center />
          </div>
        </div>

        {/* Horizontal rule */}
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${PAL.gold}40, transparent)`, marginBottom: 'clamp(40px, 6vw, 64px)' }} />

        {/* Partners grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'clamp(32px, 4vw, 48px) clamp(20px, 3vw, 32px)', justifyItems: 'center' }}>
          {PARTNERS.map((p, i) => (
            <PartnerLogo key={i} partner={p} delay={i * 80} />
          ))}
        </div>

        {/* Bottom rule */}
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${PAL.gold}40, transparent)`, marginTop: 'clamp(40px, 6vw, 64px)' }} />

        {/* Disclaimer */}
        <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, color: 'rgba(248,241,229,0.3)', textAlign: 'center', marginTop: 24, letterSpacing: '0.04em' }}>
          Parceiros de recrutamento oficial · Official recruitment partners
        </p>
      </div>
    </section>
  );
}
