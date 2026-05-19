'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PAL, SOCIAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, RevealWords, MagneticButton } from './shared';
import { LangSwitcher } from './chrome';
import { Link } from '@/i18n/navigation';

export default function OceanHero() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useOcean();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: PAL.oceanDeep,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Light leaks */}
      <div style={{ position: 'absolute', top: '-15%', right: '-15%', width: '70%', height: '80%', background: `radial-gradient(circle, ${PAL.coral}40, transparent 60%)`, filter: 'blur(80px)', animation: 'lightleak 9s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-25%', left: '-15%', width: '70%', height: '90%', background: `radial-gradient(circle, ${PAL.gold}35, transparent 65%)`, filter: 'blur(100px)', animation: 'lightleak 11s ease-in-out infinite reverse', pointerEvents: 'none' }} />

      {/* Nav */}
      <motion.nav
        style={{
          position: 'relative', zIndex: 5,
          padding: 'clamp(20px, 3vw, 36px) clamp(20px, 5vw, 60px)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20,
          opacity,
        }}
      >
        <Link href="/" style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(20px, 2vw, 24px)', color: PAL.cream, fontWeight: 400, letterSpacing: '-0.02em', textDecoration: 'none' }}>
          Brazil <span style={{ fontStyle: 'italic', color: PAL.gold }}>Abroad</span>
        </Link>

        <div className="ocean-nav-links" style={{ display: 'flex', gap: 32, fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500, color: PAL.cream }}>
          <Link href="/assessment" style={{ color: 'inherit', textDecoration: 'none' }}>{t.nav.assessment}</Link>
          <a href="#road" style={{ color: 'inherit', textDecoration: 'none' }}>{t.nav.road}</a>
          <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>{t.nav.about}</a>
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
          position: 'relative', zIndex: 4, flex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 clamp(20px, 5vw, 80px) clamp(40px, 5vw, 80px)',
          maxWidth: 1000, margin: '0 auto', width: '100%',
          opacity,
        }}
      >
        {/* YouTube embed — primeira dobra */}
        <div style={{
          position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden',
          borderRadius: 16, marginBottom: 28,
          border: `1px solid rgba(212,165,116,0.25)`,
          boxShadow: `0 8px 48px rgba(0,0,0,0.55), 0 0 64px ${PAL.gold}18`,
        }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            src="https://www.youtube.com/embed/KXnjAxuFS6M"
            title="Brazil Abroad — Seu mapa para o mundo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* CTA abaixo do vídeo */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Link href="/assessment" style={{ textDecoration: 'none' }}>
            <MagneticButton primary style={{ padding: '18px 36px', fontSize: 14 }}>Fazer Assessment Gratuito</MagneticButton>
          </Link>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Eyebrow color={PAL.gold}>{t.hero.kicker}</Eyebrow>
        </div>

        <h1 style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 0.96, margin: '0 0 16px', color: PAL.cream, maxWidth: '18ch' }}>
          <RevealWords delay={200}>{t.hero.title1}</RevealWords>
          {' '}
          <RevealWords delay={500} italic color={PAL.gold}>{t.hero.title2}</RevealWords>
        </h1>

        <p style={{ maxWidth: 540, fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(14px, 1.1vw, 16px)', color: 'rgba(248,241,229,0.75)', lineHeight: 1.6, fontWeight: 300, margin: '0 0 28px' }}>
          {t.hero.sub1} {t.hero.sub2}
        </p>

        {/* CTAs secundários */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="#road" style={{ textDecoration: 'none' }}>
            <MagneticButton>{t.hero.cta2}</MagneticButton>
          </a>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 960px) { .ocean-nav-links { display: none !important; } }
      `}</style>
    </section>
  );
}
