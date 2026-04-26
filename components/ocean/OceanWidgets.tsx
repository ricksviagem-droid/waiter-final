'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PAL, SOCIAL } from './constants';
import { useOcean } from './OceanProvider';
import { SocialIcon } from './shared';

/* ── WhatsApp FAB ── */
export function WhatsAppFAB() {
  const { lang } = useOcean();
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 900,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
        transition: 'opacity 300ms, transform 300ms cubic-bezier(.2,.8,.2,1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: 10,
          background: PAL.ocean,
          border: `1px solid ${PAL.gold}40`,
          borderRadius: 8,
          padding: '10px 16px',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 12.5,
          color: PAL.cream,
          fontWeight: 400,
          boxShadow: `0 8px 30px ${PAL.oceanDeep}`,
        }}>
          {lang === 'pt' ? 'Fale com um mentor →' : 'Talk to a mentor →'}
          <div style={{ position: 'absolute', bottom: -5, right: 18, width: 10, height: 10, background: PAL.ocean, border: `1px solid ${PAL.gold}40`, borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)' }} />
        </div>
      )}

      {/* Button */}
      <a
        href={SOCIAL.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        onMouseEnter={(e) => {
          setTooltip(true);
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(37,211,102,0.6)';
        }}
        onMouseLeave={(e) => {
          setTooltip(false);
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(37,211,102,0.45)';
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: '#25D366',
          boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
          textDecoration: 'none',
          transition: 'transform 200ms, box-shadow 200ms',
        }}
      >
        <SocialIcon kind="whatsapp" size={26} color="#fff" />
        {/* Pulse ring */}
        <span style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: '2px solid rgba(37,211,102,0.4)',
          animation: 'wapulse 2s ease-out infinite',
        }} />
      </a>
    </div>
  );
}

/* ── Social Rail (desktop left side) ── */
export function SocialRail() {
  const socials = [
    { kind: 'instagram', href: SOCIAL.instagram },
    { kind: 'youtube', href: SOCIAL.youtube },
    { kind: 'linkedin', href: SOCIAL.linkedin },
    { kind: 'tiktok', href: SOCIAL.tiktok },
    { kind: 'email', href: SOCIAL.email },
  ];

  return (
    <div
      className="ocean-social-rail"
      style={{
        position: 'fixed',
        left: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
      }}
    >
      {/* Top line */}
      <div style={{ width: 1, height: 60, background: `linear-gradient(transparent, ${PAL.gold}50)` }} />

      {socials.map((s) => (
        <a
          key={s.kind}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          title={s.kind}
          style={{
            opacity: 0.45,
            transition: 'opacity 200ms, transform 200ms',
            display: 'flex',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.opacity = '1';
            el.style.transform = 'translateX(3px)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.opacity = '0.45';
            el.style.transform = 'translateX(0)';
          }}
        >
          <SocialIcon kind={s.kind as 'instagram'} size={16} color={PAL.gold} />
        </a>
      ))}

      {/* Bottom line */}
      <div style={{ width: 1, height: 60, background: `linear-gradient(${PAL.gold}50, transparent)` }} />

      <style>{`
        @media (max-width: 1100px) { .ocean-social-rail { display: none !important; } }
      `}</style>
    </div>
  );
}

/* ── Mobile Sticky CTA bar ── */
export function MobileStickyBar() {
  const { lang } = useOcean();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="ocean-mobile-sticky"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: `linear-gradient(0deg, ${PAL.oceanDeep} 0%, rgba(5,28,54,0.95) 100%)`,
        borderTop: `1px solid ${PAL.gold}30`,
        padding: '12px 20px',
        display: 'flex',
        gap: 10,
        backdropFilter: 'blur(20px)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(.2,.8,.2,1)',
      }}
    >
      <a
        href={SOCIAL.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: '#25D366',
          color: '#fff',
          textDecoration: 'none',
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.04em',
          padding: '13px 16px',
          borderRadius: 8,
        }}
      >
        <SocialIcon kind="whatsapp" size={16} color="#fff" />
        WhatsApp
      </a>
      <a
        href="/assessment"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${PAL.gold}, ${PAL.goldWarm})`,
          color: PAL.ocean,
          textDecoration: 'none',
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.04em',
          padding: '13px 16px',
          borderRadius: 8,
        }}
      >
        {lang === 'pt' ? 'Avaliação grátis' : 'Free assessment'}
      </a>
      <style>{`
        @media (min-width: 768px) { .ocean-mobile-sticky { display: none !important; } }
      `}</style>
    </div>
  );
}

/* ── Scroll progress bar ── */
export function OceanScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, ${PAL.gold}, ${PAL.coral})`,
        transformOrigin: '0%',
        scaleX,
        zIndex: 9999,
      }}
    />
  );
}
