'use client';

import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { PAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, DisplayHeading, MagneticButton } from './shared';

const MENTOR_IMAGES = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&q=85',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=85',
];

function MentorCard({ mentor, img, delay }: { mentor: { name: string; role: string; tag: string; bio: string }; img: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hover, setHover] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="media"
      style={{ position: 'relative', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms` }}
    >
      <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', boxShadow: hover ? `0 30px 60px ${PAL.oceanDeep}` : `0 12px 30px ${PAL.oceanDeep}80`, transition: 'box-shadow 400ms' }}>
        <img
          src={img}
          alt={mentor.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: hover ? 'saturate(1) brightness(0.95)' : 'grayscale(0.4) saturate(0.85) brightness(0.8)', transition: 'filter 600ms, transform 800ms', transform: hover ? 'scale(1.05)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(5,28,54,0.7)', backdropFilter: 'blur(14px)', border: `1px solid ${PAL.gold}55`, padding: '5px 12px', borderRadius: 999, fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, letterSpacing: '0.22em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 600 }}>{mentor.tag}</div>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 30%, rgba(5,28,54,0.95) 90%)`, display: 'flex', alignItems: 'flex-end', padding: 18, opacity: hover ? 1 : 0, transition: 'opacity 350ms' }}>
          <p style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontStyle: 'italic', fontSize: 16, color: PAL.cream, lineHeight: 1.4, margin: 0 }}>"{mentor.bio}"</p>
        </div>
      </div>
      <div style={{ paddingTop: 16 }}>
        <div style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 22, fontWeight: 500, color: PAL.cream, letterSpacing: '-0.01em' }}>{mentor.name}</div>
        <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 12, color: PAL.gold, marginTop: 4, letterSpacing: '0.04em' }}>{mentor.role}</div>
      </div>
    </div>
  );
}

export default function OceanMentors() {
  const { t } = useOcean();
  return (
    <section id="mentors" style={{ position: 'relative', padding: 'clamp(100px, 14vw, 180px) clamp(20px, 5vw, 80px)', background: `linear-gradient(180deg, ${PAL.oceanDeep} 0%, ${PAL.ocean} 50%, ${PAL.oceanDeep} 100%)`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none', background: `radial-gradient(circle at 80% 20%, ${PAL.gold}30, transparent 50%), radial-gradient(circle at 20% 80%, ${PAL.coral}25, transparent 50%)` }} />
      <div style={{ position: 'relative', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'end', marginBottom: 'clamp(50px, 7vw, 80px)' }} className="ocean-mentors-head">
          <div>
            <Eyebrow color={PAL.gold}>{t.mentors.kicker}</Eyebrow>
            <div style={{ marginTop: 28 }}>
              <DisplayHeading part1={t.mentors.title1} part2={t.mentors.title2} color1={PAL.cream} color2={PAL.gold} />
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(15px, 1.1vw, 17px)', color: 'rgba(248,241,229,0.7)', lineHeight: 1.6, fontWeight: 300, maxWidth: 460, margin: 0 }}>{t.mentors.sub}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(20px, 2.5vw, 32px)' }}>
          {t.mentors.list.map((m, i) => <MentorCard key={i} mentor={m} img={MENTOR_IMAGES[i]} delay={i * 120} />)}
        </div>
        <div style={{ marginTop: 60, textAlign: 'center' }}>
          <a href={`#about`} style={{ textDecoration: 'none' }}>
            <MagneticButton primary>{t.cta.btn2}</MagneticButton>
          </a>
        </div>
      </div>
      <style>{`@media (max-width: 800px) { .ocean-mentors-head { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
