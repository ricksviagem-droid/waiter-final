'use client';

import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { PAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, DisplayHeading, VideoLightbox } from './shared';

function VideoCard({ item, delay }: { item: { kicker: string; title: string; vid: string }; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  const thumb = `https://img.youtube.com/vi/${item.vid}/maxresdefault.jpg`;

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(true)}
        data-cursor="media"
        style={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(32px)',
          transition: `opacity 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
          boxShadow: hover ? `0 30px 60px ${PAL.oceanDeep}` : `0 12px 28px ${PAL.oceanDeep}80`,
        }}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
          <img
            src={thumb}
            alt={item.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: hover ? 'saturate(0.9) brightness(0.7)' : 'saturate(0.5) brightness(0.55)',
              transform: hover ? 'scale(1.04)' : 'scale(1)',
              transition: 'filter 400ms, transform 700ms cubic-bezier(.2,.8,.2,1)',
            }}
          />
          {/* Overlay gradient */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 30%, rgba(5,28,54,0.92) 100%)` }} />

          {/* Play button */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${hover ? 1.12 : 1})`,
            transition: 'transform 300ms cubic-bezier(.2,.8,.2,1)',
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: hover ? PAL.gold : 'rgba(212,165,116,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: hover ? `0 0 40px ${PAL.gold}80` : `0 4px 20px rgba(0,0,0,0.4)`,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={PAL.ocean}><polygon points="5,3 19,12 5,21" /></svg>
          </div>

          {/* Duration chip */}
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(5,28,54,0.75)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${PAL.gold}40`,
            borderRadius: 999,
            padding: '4px 10px',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: 10,
            color: PAL.gold,
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}>
            ▶ YouTube
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 20px 24px', background: 'rgba(10,37,64,0.7)', border: `1px solid ${PAL.gold}20`, borderTop: 'none' }}>
          <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, letterSpacing: '0.22em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>{item.kicker}</div>
          <h4 style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(17px, 1.6vw, 21px)', fontWeight: 500, color: PAL.cream, letterSpacing: '-0.01em', lineHeight: 1.2, margin: 0 }}>{item.title}</h4>
        </div>
      </div>

      {open && <VideoLightbox vid={item.vid} onClose={() => setOpen(false)} />}
    </>
  );
}

export default function OceanTestimonials() {
  const { t } = useOcean();

  return (
    <section id="testimonials" style={{ position: 'relative', padding: 'clamp(100px, 14vw, 180px) clamp(20px, 5vw, 80px)', background: `linear-gradient(180deg, ${PAL.oceanDeep} 0%, ${PAL.ocean} 50%, ${PAL.oceanDeep} 100%)`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '40%', height: '55%', background: `radial-gradient(circle, ${PAL.coral}20, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(50px, 7vw, 80px)', maxWidth: 800, marginInline: 'auto' }}>
          <Eyebrow color={PAL.gold}>{t.testimonials.kicker}</Eyebrow>
          <div style={{ marginTop: 28 }}>
            <DisplayHeading part1={t.testimonials.title1} part2={t.testimonials.title2} color1={PAL.cream} color2={PAL.gold} center />
          </div>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(15px, 1.1vw, 17px)', color: 'rgba(248,241,229,0.7)', lineHeight: 1.6, fontWeight: 300, marginTop: 24 }}>
            {t.testimonials.sub}
          </p>
        </div>

        {/* Videos grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'clamp(20px, 2.5vw, 32px)' }}>
          {t.testimonials.items.map((item, i) => (
            <VideoCard key={i} item={item} delay={i * 120} />
          ))}
        </div>

        {/* Trust strip */}
        <div style={{ marginTop: 'clamp(60px, 8vw, 90px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(24px, 4vw, 48px)', paddingTop: 'clamp(32px, 4vw, 48px)', borderTop: `1px solid ${PAL.gold}25` }}>
          {[
            { icon: '🎬', label: 'Reais', sub: 'Sem script' },
            { icon: '✂️', label: 'Sem corte', sub: 'Conversa completa' },
            { icon: '🔒', label: 'Autorizado', sub: 'Pelos alunos' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 17, fontWeight: 500, color: PAL.cream }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11.5, color: 'rgba(248,241,229,0.5)', marginTop: 2 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
