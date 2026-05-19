'use client';

import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { PAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, DisplayHeading, MagneticButton } from './shared';

function EnglishCard({ card, delay, index }: { card: { tag: string; t: string; d: string; sample: string }; delay: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hover, setHover] = useState(false);

  const icons = ['🍷', '🛎️', '⚓', '🤝'];

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="link"
      style={{
        position: 'relative',
        background: hover ? `linear-gradient(135deg, rgba(10,37,64,0.9), rgba(212,165,116,0.12))` : 'rgba(10,37,64,0.55)',
        border: `1px solid ${hover ? PAL.gold : 'rgba(212,165,116,0.18)'}`,
        padding: 'clamp(28px, 3vw, 36px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, background 300ms, border-color 250ms`,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Corner accent */}
      <span style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderTop: `1px solid ${PAL.gold}40`, borderRight: `1px solid ${PAL.gold}40`, opacity: hover ? 1 : 0, transition: 'opacity 300ms' }} />

      {/* Tag */}
      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, letterSpacing: '0.24em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 600 }}>{card.tag}</div>

      {/* Icon */}
      <div style={{ fontSize: 32, lineHeight: 1 }}>{icons[index]}</div>

      {/* Title */}
      <h3 style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(22px, 2.2vw, 30px)', fontWeight: 500, color: PAL.cream, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>{card.t}</h3>

      {/* Description */}
      <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(13.5px, 1vw, 15.5px)', color: 'rgba(248,241,229,0.7)', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{card.d}</p>

      {/* Sample phrase */}
      <div style={{
        marginTop: 'auto',
        paddingTop: 20,
        borderTop: `1px solid ${PAL.gold}22`,
        fontFamily: 'var(--font-fraunces), Fraunces, serif',
        fontStyle: 'italic',
        fontSize: 'clamp(14px, 1.05vw, 16px)',
        color: PAL.gold,
        lineHeight: 1.4,
        opacity: hover ? 1 : 0.6,
        transition: 'opacity 300ms',
      }}>
        {card.sample}
      </div>
    </div>
  );
}

export default function OceanEnglish() {
  const { t, lang } = useOcean();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="english" ref={ref} style={{ position: 'relative', padding: 'clamp(100px, 14vw, 180px) clamp(20px, 5vw, 80px)', background: `linear-gradient(180deg, ${PAL.ocean} 0%, ${PAL.oceanMid} 50%, ${PAL.ocean} 100%)`, overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '45%', height: '55%', background: `radial-gradient(circle, ${PAL.gold}20, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', right: '-5%', width: '35%', height: '45%', background: `radial-gradient(circle, ${PAL.coral}18, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'end', marginBottom: 'clamp(50px, 7vw, 80px)' }} className="ocean-english-head">
          <div>
            <Eyebrow color={PAL.gold}>{t.english.kicker}</Eyebrow>
            <div style={{ marginTop: 28 }}>
              <DisplayHeading part1={t.english.title1} part2={t.english.title2} color1={PAL.cream} color2={PAL.gold} />
            </div>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(15px, 1.1vw, 17px)', color: 'rgba(248,241,229,0.7)', lineHeight: 1.6, fontWeight: 300, maxWidth: 460, margin: 0 }}>{t.english.sub}</p>
            <div style={{ marginTop: 32 }}>
              <MagneticButton primary href="/simulator" style={{ fontSize: 13, padding: '16px 28px' }}>
                {lang === 'pt' ? 'Experimentar grátis' : 'Try for free'}
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(16px, 1.8vw, 24px)' }}>
          {t.english.cards.map((card, i) => (
            <EnglishCard key={i} card={card} delay={i * 100} index={i} />
          ))}
        </div>

        {/* Bottom proof strip */}
        <div
          style={{
            marginTop: 'clamp(50px, 6vw, 70px)',
            padding: 'clamp(24px, 3vw, 32px) clamp(28px, 4vw, 48px)',
            background: 'rgba(10,37,64,0.4)',
            border: `1px solid ${PAL.gold}22`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: inView ? 1 : 0,
            transition: 'opacity 800ms 400ms',
          }}
        >
          {[
            { n: '4', label: lang === 'pt' ? 'módulos de inglês real' : 'real English modules' },
            { n: '200+', label: lang === 'pt' ? 'frases prontas para usar' : 'ready-to-use phrases' },
            { n: '100%', label: lang === 'pt' ? 'focado em hospitalidade' : 'hospitality-focused' },
            { n: 'IA +', label: lang === 'pt' ? 'mentor humano' : 'AI + human mentor' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 500, color: PAL.gold, fontStyle: 'italic', letterSpacing: '-0.02em' }}>{item.n}</span>
              <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 12.5, color: 'rgba(248,241,229,0.6)', lineHeight: 1.4, maxWidth: 100 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media (max-width: 800px) { .ocean-english-head { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
