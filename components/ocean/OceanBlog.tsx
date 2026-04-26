'use client';

import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { PAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, DisplayHeading } from './shared';

const POST_IMAGES = [
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80',
  'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
];

const TAG_COLORS: Record<string, string> = {
  Mercado: PAL.gold,
  Market: PAL.gold,
  Cruzeiros: PAL.coral,
  Cruises: PAL.coral,
  Visto: PAL.brGreen,
  Visa: PAL.brGreen,
  Salários: PAL.coralSoft,
  Salaries: PAL.coralSoft,
};

function FeaturedPost({ post, img }: { post: { tag: string; date: string; title: string; excerpt: string; featured?: boolean }; img: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [hover, setHover] = useState(false);
  const tagColor = TAG_COLORS[post.tag] || PAL.gold;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="link"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(10,37,64,0.55)',
        border: `1px solid ${hover ? PAL.gold : 'rgba(212,165,116,0.18)'}`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 700ms cubic-bezier(.2,.8,.2,1), transform 700ms cubic-bezier(.2,.8,.2,1), border-color 250ms`,
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
      className="ocean-featured-post"
    >
      {/* Image */}
      <div style={{ position: 'relative', minHeight: 320, overflow: 'hidden' }}>
        <img
          src={img}
          alt={post.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: hover ? 'saturate(1) brightness(0.85)' : 'saturate(0.7) brightness(0.65)',
            transform: hover ? 'scale(1.05)' : 'scale(1)',
            transition: 'filter 400ms, transform 700ms cubic-bezier(.2,.8,.2,1)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 60%, rgba(5,28,54,0.85))' }} />
      </div>

      {/* Content */}
      <div style={{ padding: 'clamp(32px, 4vw, 52px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, letterSpacing: '0.22em', color: tagColor, textTransform: 'uppercase', fontWeight: 700, padding: '4px 10px', border: `1px solid ${tagColor}50`, borderRadius: 999, background: `${tagColor}12` }}>{post.tag}</span>
          <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, color: 'rgba(248,241,229,0.45)', letterSpacing: '0.06em' }}>{post.date}</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(22px, 2.8vw, 38px)', fontWeight: 500, color: PAL.cream, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 16px' }}>{post.title}</h3>
        <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(13.5px, 1vw, 15.5px)', color: 'rgba(248,241,229,0.65)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{post.excerpt}</p>
        <div style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 12, color: hover ? PAL.gold : 'rgba(248,241,229,0.5)', transition: 'color 200ms', fontWeight: 500, letterSpacing: '0.04em' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
  );
}

function SmallPost({ post, img, delay }: { post: { tag: string; date: string; title: string; excerpt: string }; img: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hover, setHover] = useState(false);
  const tagColor = TAG_COLORS[post.tag] || PAL.gold;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="link"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(10,37,64,0.55)',
        border: `1px solid ${hover ? PAL.gold : 'rgba(212,165,116,0.18)'}`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, border-color 250ms`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img
          src={img}
          alt={post.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: hover ? 'saturate(1) brightness(0.85)' : 'saturate(0.6) brightness(0.6)',
            transform: hover ? 'scale(1.05)' : 'scale(1)',
            transition: 'filter 400ms, transform 700ms',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(5,28,54,0.7))' }} />
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9, letterSpacing: '0.22em', color: tagColor, textTransform: 'uppercase', fontWeight: 700 }}>{post.tag}</span>
          <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 10.5, color: 'rgba(248,241,229,0.4)' }}>{post.date}</span>
        </div>
        <h4 style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(17px, 1.6vw, 21px)', fontWeight: 500, color: PAL.cream, letterSpacing: '-0.015em', lineHeight: 1.2, margin: 0 }}>{post.title}</h4>
        <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 13, color: 'rgba(248,241,229,0.6)', lineHeight: 1.55, fontWeight: 300, margin: 0 }}>{post.excerpt}</p>
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: `1px solid ${PAL.gold}18`, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11.5, color: hover ? PAL.gold : 'rgba(248,241,229,0.4)', transition: 'color 200ms', fontWeight: 500 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
  );
}

export default function OceanBlog() {
  const { t, lang } = useOcean();
  const [featured, ...rest] = t.gallery.posts;

  return (
    <section id="blog" style={{ position: 'relative', padding: 'clamp(100px, 14vw, 180px) clamp(20px, 5vw, 80px)', background: `linear-gradient(180deg, ${PAL.ocean} 0%, ${PAL.oceanDeep} 50%, ${PAL.ocean} 100%)`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '-8%', width: '42%', height: '50%', background: `radial-gradient(circle, ${PAL.gold}18, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'end', marginBottom: 'clamp(50px, 7vw, 80px)' }} className="ocean-blog-head">
          <div>
            <Eyebrow color={PAL.gold}>{t.gallery.kicker}</Eyebrow>
            <div style={{ marginTop: 28 }}>
              <DisplayHeading part1={t.gallery.title1} part2={t.gallery.title2} color1={PAL.cream} color2={PAL.gold} />
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(15px, 1.1vw, 17px)', color: 'rgba(248,241,229,0.7)', lineHeight: 1.6, fontWeight: 300, maxWidth: 460, margin: 0 }}>{t.gallery.sub}</p>
        </div>

        {/* Featured post */}
        <FeaturedPost post={featured} img={POST_IMAGES[0]} />

        {/* Small posts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'clamp(16px, 1.8vw, 24px)', marginTop: 'clamp(16px, 1.8vw, 24px)' }}>
          {rest.map((post, i) => (
            <SmallPost key={i} post={post} img={POST_IMAGES[i + 1]} delay={i * 100} />
          ))}
        </div>

        {/* See all */}
        <div style={{ marginTop: 'clamp(40px, 5vw, 56px)', textAlign: 'center' }}>
          <a
            href="/blog"
            data-cursor="link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: PAL.gold,
              textDecoration: 'none',
              border: `1px solid ${PAL.gold}40`,
              padding: '14px 28px',
              borderRadius: 999,
              background: `${PAL.gold}08`,
              transition: 'background 200ms, border-color 200ms',
            }}
          >
            {t.gallery.readAll}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .ocean-blog-head { grid-template-columns: 1fr !important; }
          .ocean-featured-post { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
