'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PAL, SOCIAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, RevealWords, MagneticButton } from './shared';
import { LangSwitcher } from './chrome';
import { Link } from '@/i18n/navigation';

const IMAGES = [
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=2400&q=85',
  '/scenes/cruise-star.jpg',
  '/scenes/waiter-sommelier.jpg',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=2400&q=85',
];

export default function OceanHero() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useOcean();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % IMAGES.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 700,
        overflow: 'hidden',
        background: PAL.oceanDeep,
      }}
    >
      {/* Image carousel */}
      <motion.div style={{ position: 'absolute', inset: 0, scale, y }}>
        {IMAGES.map((src, i) => (
          <div
            key={src}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === active ? 1 : 0,
              transition: 'opacity 1.6s cubic-bezier(.7,0,.3,1)',
              filter: 'brightness(0.4) saturate(0.65) contrast(1.05)',
              animation: 'kenburns 22s ease-in-out infinite alternate',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(5,28,54,0.55) 0%, rgba(10,37,64,0.65) 50%, rgba(5,28,54,0.85) 100%)`,
            mixBlendMode: 'multiply',
          }}
        />
      </motion.div>

      {/* Light leaks */}
      <div style={{ position: 'absolute', top: '-15%', right: '-15%', width: '70%', height: '80%', background: `radial-gradient(circle, ${PAL.coral}40, transparent 60%)`, filter: 'blur(80px)', animation: 'lightleak 9s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-25%', left: '-15%', width: '70%', height: '90%', background: `radial-gradient(circle, ${PAL.gold}35, transparent 65%)`, filter: 'blur(100px)', animation: 'lightleak 11s ease-in-out infinite reverse', pointerEvents: 'none' }} />

      {/* Nav */}
      <motion.nav
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5,
          padding: 'clamp(20px, 3vw, 36px) clamp(20px, 5vw, 60px)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20,
          opacity,
        }}
      >
        <Link href="/" style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(20px, 2vw, 24px)', color: PAL.cream, fontWeight: 400, letterSpacing: '-0.02em', textDecoration: 'none' }}>
          Brazil <span style={{ fontStyle: 'italic', color: PAL.gold }}>Abroad</span>
        </Link>

        <div className="ocean-nav-links" style={{ display: 'flex', gap: 32, fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500, color: PAL.cream }}>
          {[
            { href: '#mentors', label: t.nav.mentors },
            { href: '#road', label: t.nav.road },
            { href: '#apps', label: t.nav.apps },
            { href: '#gallery', label: t.nav.gallery },
            { href: '#trusted', label: t.nav.trusted },
          ].map(({ href, label }) => (
            <a key={href} href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <LangSwitcher light />
          <a href={SOCIAL.whatsapp} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
            <MagneticButton primary style={{ padding: '12px 22px', fontSize: 11 }}>{t.nav.start}</MagneticButton>
          </a>
        </div>
      </motion.nav>

      {/* Hero content */}
      <motion.div
        style={{
          position: 'relative', zIndex: 4, height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 clamp(20px, 5vw, 80px)', maxWidth: 1400, margin: '0 auto',
          opacity,
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <Eyebrow color={PAL.gold}>{t.hero.kicker}</Eyebrow>
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(54px, 9vw, 144px)', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.92, margin: 0, color: PAL.cream, maxWidth: '14ch' }}>
          <RevealWords delay={200}>{t.hero.title1}</RevealWords>
          <br />
          <RevealWords delay={500} italic color={PAL.gold}>{t.hero.title2}</RevealWords>
        </h1>
        <div style={{ marginTop: 'clamp(28px, 4vw, 48px)', maxWidth: 540, fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(15px, 1.2vw, 18px)', color: 'rgba(248,241,229,0.75)', lineHeight: 1.6, fontWeight: 300 }}>
          <RevealWords delay={1000}>{t.hero.sub1}</RevealWords>
          <br />
          <RevealWords delay={1300}>{t.hero.sub2}</RevealWords>
        </div>
        <div style={{ marginTop: 'clamp(32px, 4vw, 56px)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href={SOCIAL.whatsapp} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
            <MagneticButton primary>{t.hero.cta1}</MagneticButton>
          </a>
          <a href="#road" style={{ textDecoration: 'none' }}>
            <MagneticButton>{t.hero.cta2}</MagneticButton>
          </a>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 32, left: 'clamp(20px, 5vw, 80px)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 10, letterSpacing: '0.32em', color: 'rgba(248,241,229,0.5)', textTransform: 'uppercase', fontWeight: 500 }}>{t.hero.scroll}</div>
          <span style={{ display: 'inline-block', width: 1, height: 32, background: PAL.gold }} />
        </div>
        {/* Carousel dots */}
        <div style={{ position: 'absolute', bottom: 38, right: 'clamp(20px, 5vw, 80px)', display: 'flex', gap: 8 }}>
          {IMAGES.map((_, i) => (
            <span key={i} style={{ width: i === active ? 24 : 6, height: 1.5, background: i === active ? PAL.gold : 'rgba(248,241,229,0.3)', transition: 'width 400ms, background 400ms' }} />
          ))}
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 960px) { .ocean-nav-links { display: none !important; } }
      `}</style>
    </section>
  );
}
