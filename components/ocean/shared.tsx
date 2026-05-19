'use client';

import { useRef, CSSProperties, ReactNode, useEffect, MouseEvent } from 'react';
import { useInView } from 'framer-motion';
import { PAL } from './constants';

/* ── RevealWords ─────────────────────────────────────────────── */
export function RevealWords({
  children,
  delay = 0,
  style,
  italic,
  color,
}: {
  children: string;
  delay?: number;
  style?: CSSProperties;
  italic?: boolean;
  color?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const words = children.split(' ');
  return (
    <span ref={ref} style={{ display: 'inline-block', ...style }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <span
            style={{
              display: 'inline-block',
              transform: inView ? 'translateY(0)' : 'translateY(110%)',
              transition: `transform 900ms cubic-bezier(.2,.8,.2,1) ${delay + i * 70}ms`,
              paddingRight: '0.25em',
              fontStyle: italic ? 'italic' : 'normal',
              color: color || 'inherit',
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ── Eyebrow ─────────────────────────────────────────────────── */
export function Eyebrow({ children, color = PAL.gold }: { children: ReactNode; color?: string }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        fontSize: 11,
        letterSpacing: '0.4em',
        color,
        fontWeight: 500,
        textTransform: 'uppercase',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <span style={{ width: 36, height: 1, background: color }} />
      {children}
    </div>
  );
}

/* ── DisplayHeading ──────────────────────────────────────────── */
export function DisplayHeading({
  part1,
  part2,
  color1,
  color2,
  size = 'lg',
  center,
}: {
  part1: string;
  part2: string;
  color1?: string;
  color2?: string;
  size?: 'xl' | 'lg' | 'md';
  center?: boolean;
}) {
  const sz =
    size === 'xl'
      ? 'clamp(54px, 9vw, 144px)'
      : size === 'md'
      ? 'clamp(36px, 5.5vw, 76px)'
      : 'clamp(42px, 6.5vw, 100px)';
  return (
    <h2
      style={{
        fontFamily: 'var(--font-fraunces), Fraunces, serif',
        fontSize: sz,
        fontWeight: 400,
        letterSpacing: '-0.035em',
        lineHeight: 0.92,
        margin: 0,
        color: color1 || PAL.cream,
        textWrap: 'balance' as CSSProperties['textWrap'],
        maxWidth: '14ch',
        marginInline: center ? 'auto' : undefined,
        textAlign: center ? 'center' : 'left',
      }}
    >
      <RevealWords>{part1}</RevealWords>
      <br />
      <RevealWords delay={300} italic color={color2 || PAL.gold}>
        {part2}
      </RevealWords>
    </h2>
  );
}

/* ── MagneticButton ──────────────────────────────────────────── */
export function MagneticButton({
  children,
  primary,
  onClick,
  style = {},
  dark,
  href,
}: {
  children: ReactNode;
  primary?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  dark?: boolean;
  href?: string;
}) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const handleMove = (e: MouseEvent) => {
    if (!ref.current || typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  };

  const bg = primary ? PAL.gold : 'transparent';
  const fg = primary ? PAL.oceanDeep : dark ? PAL.ocean : PAL.cream;
  const border = primary ? 'none' : `1px solid ${dark ? PAL.gold : 'rgba(212,165,116,0.55)'}`;

  const commonStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    padding: '18px 32px',
    background: bg,
    color: fg,
    border,
    borderRadius: 0,
    fontFamily: 'var(--font-inter), Inter, sans-serif',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    transition: 'transform 250ms cubic-bezier(.2,.8,.2,1)',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    ...style,
  };

  const inner = (
    <>
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '50%',
          background: `linear-gradient(90deg, transparent, ${primary ? 'rgba(255,255,255,0.4)' : 'rgba(212,165,116,0.4)'}, transparent)`,
          animation: 'shimmer 2.6s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        {children}
        <span style={{ display: 'inline-block', fontSize: 14 }}>→</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        data-cursor="cta"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={commonStyle}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      data-cursor="cta"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={commonStyle}
    >
      {inner}
    </button>
  );
}

/* ── Flag SVGs ───────────────────────────────────────────────── */
export function FlagBR({ size = 14 }: { size?: number }) {
  return (
    <svg width={size * 1.4} height={size} viewBox="0 0 28 20" style={{ borderRadius: 1, overflow: 'hidden' }}>
      <rect width="28" height="20" fill="#229954" />
      <polygon points="14,2 26,10 14,18 2,10" fill="#FFD466" />
      <circle cx="14" cy="10" r="3.6" fill="#0A2540" />
      <path d="M 10.6 9.6 Q 14 8.4 17.4 9.6" stroke="#FBF5EB" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

export function FlagUS({ size = 14 }: { size?: number }) {
  return (
    <svg width={size * 1.4} height={size} viewBox="0 0 28 20" style={{ borderRadius: 1, overflow: 'hidden' }}>
      <rect width="28" height="20" fill="#FBF5EB" />
      {[1, 3, 5, 7, 9].map((y) => (
        <rect key={y} y={y * 2} width="28" height="2" fill="#B22234" />
      ))}
      <rect width="12" height="11" fill="#1B3A6B" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <circle key={`${r}-${c}`} cx={1.6 + c * 2.2} cy={1.6 + r * 3} r="0.5" fill="#FBF5EB" />
        ))
      )}
    </svg>
  );
}

/* ── SocialIcon ──────────────────────────────────────────────── */
export function SocialIcon({ kind, size = 18, color = 'currentColor' }: { kind: string; size?: number; color?: string }) {
  const c = color;
  switch (kind) {
    case 'whatsapp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={c}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
        </svg>
      );
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.9" fill={c} stroke="none" />
        </svg>
      );
    case 'youtube':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={c}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={c}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={c}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
        </svg>
      );
    case 'email':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case 'phone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'pin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── VideoLightbox ───────────────────────────────────────────── */
export function VideoLightbox({ vid, onClose }: { vid: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(3,16,31,0.92)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4vw',
        animation: 'lbFade 240ms ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1100,
          aspectRatio: '16/9',
          background: '#000',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
          animation: 'lbPop 360ms cubic-bezier(.2,.9,.2,1)',
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 0 }}
        />
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: -48,
            right: 0,
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: PAL.gold,
            color: PAL.ocean,
            border: 'none',
            fontSize: 20,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 6px 20px ${PAL.gold}55`,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
