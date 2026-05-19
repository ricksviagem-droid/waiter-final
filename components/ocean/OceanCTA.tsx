'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { PAL, SOCIAL, BOOKING_URL } from './constants';
import { useOcean } from './OceanProvider';
import { DisplayHeading, MagneticButton, SocialIcon } from './shared';

export default function OceanCTA() {
  const { t, lang } = useOcean();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(100px, 14vw, 180px) clamp(20px, 5vw, 80px)',
        background: `linear-gradient(180deg, ${PAL.oceanDeep} 0%, ${PAL.ocean} 40%, ${PAL.oceanDeep} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${PAL.gold}20 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '60%', background: `radial-gradient(circle, ${PAL.coral}18, transparent 60%)`, filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '45%', height: '55%', background: `radial-gradient(circle, ${PAL.gold}18, transparent 60%)`, filter: 'blur(100px)', pointerEvents: 'none' }} />

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '15%', right: '8%', width: 380, height: 380, border: `1px solid ${PAL.gold}18`, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: 240, height: 240, border: `1px solid ${PAL.gold}12`, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '8%', width: 300, height: 300, border: `1px solid ${PAL.gold}14`, borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        {/* Label */}
        <div style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 10,
          letterSpacing: '0.36em',
          color: PAL.gold,
          textTransform: 'uppercase',
          fontWeight: 700,
          marginBottom: 32,
          opacity: inView ? 1 : 0,
          transition: 'opacity 600ms 100ms',
        }}>
          {lang === 'pt' ? '── Próximo passo ──' : '── Next step ──'}
        </div>

        {/* Heading */}
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 700ms 200ms, transform 700ms 200ms',
        }}>
          <DisplayHeading part1={t.cta.title1} part2={t.cta.title2} color1={PAL.cream} color2={PAL.gold} center />
        </div>

        {/* Sub */}
        <p style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 'clamp(15px, 1.15vw, 18px)',
          color: 'rgba(248,241,229,0.75)',
          lineHeight: 1.65,
          fontWeight: 300,
          maxWidth: 620,
          marginInline: 'auto',
          marginTop: 28,
          opacity: inView ? 1 : 0,
          transition: 'opacity 700ms 350ms',
        }}>
          {t.cta.sub}
        </p>

        {/* CTAs */}
        <div style={{
          marginTop: 48,
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
          opacity: inView ? 1 : 0,
          transition: 'opacity 700ms 450ms',
        }}>
          <MagneticButton
            primary
            href={SOCIAL.whatsapp}
            style={{ padding: '20px 40px', fontSize: 14, gap: 10, display: 'flex', alignItems: 'center' }}
          >
            <SocialIcon kind="whatsapp" size={18} color="currentColor" />
            {t.cta.btn1}
          </MagneticButton>
          <MagneticButton href={BOOKING_URL} style={{ padding: '20px 36px', fontSize: 14 }}>
            {t.cta.btn2}
          </MagneticButton>
        </div>

        {/* Contact info */}
        <div style={{
          marginTop: 56,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'clamp(24px, 4vw, 48px)',
          paddingTop: 40,
          borderTop: `1px solid ${PAL.gold}22`,
          opacity: inView ? 1 : 0,
          transition: 'opacity 700ms 550ms',
        }}>
          {[
            { icon: 'whatsapp', label: '+55 71 9 9999-0000', href: SOCIAL.whatsapp },
            { icon: 'email', label: lang === 'pt' ? 'contato@brazilabroad.com' : 'contact@brazilabroad.com', href: SOCIAL.email },
            { icon: 'pin', label: lang === 'pt' ? 'Salvador · Dubai' : 'Salvador · Dubai', href: undefined },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              target={item.href?.startsWith('http') ? '_blank' : undefined}
              rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontSize: 13.5,
                color: 'rgba(248,241,229,0.65)',
                transition: 'color 200ms',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = PAL.gold; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(248,241,229,0.65)'; }}
            >
              <SocialIcon kind={item.icon as 'whatsapp'} size={15} color={PAL.gold} />
              {item.label}
            </a>
          ))}
        </div>

        {/* Trust badges */}
        <div style={{
          marginTop: 48,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 12,
          opacity: inView ? 1 : 0,
          transition: 'opacity 700ms 650ms',
        }}>
          {[
            lang === 'pt' ? '✓ 100% gratuito' : '✓ 100% free',
            lang === 'pt' ? '✓ Sem compromisso' : '✓ No commitment',
            lang === 'pt' ? '✓ Resposta rápida' : '✓ Fast reply',
            lang === 'pt' ? '✓ Mentores reais' : '✓ Real mentors',
          ].map((badge, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontSize: 11.5,
                color: 'rgba(248,241,229,0.5)',
                fontWeight: 400,
                letterSpacing: '0.04em',
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
