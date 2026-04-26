'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, motion } from 'framer-motion';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { PAL, SOCIAL } from './constants';
import { FlagBR, FlagUS, MagneticButton } from './shared';
import { useOcean } from './OceanProvider';

/* ── Smooth scroll (Lenis) ───────────────────────────────────── */
export function useSmoothScroll() {
  useEffect(() => {
    const isMobile =
      window.matchMedia('(max-width: 900px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReduced) return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let rafId: number;
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.15, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      function raf(time: number) {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);
}

/* ── Plane cursor ────────────────────────────────────────────── */
export function PlaneCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState<string | null>(null);
  const [click, setClick] = useState(0);
  const [visible, setVisible] = useState(false);
  const trailRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const [trailPts, setTrailPts] = useState<{ x: number; y: number }[]>([]);
  const angleRef = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile =
      window.matchMedia('(max-width: 900px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    const move = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 1) {
        angleRef.current = (Math.atan2(dy, dx) * 180) / Math.PI;
      }
      lastPos.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      trailRef.current = [...trailRef.current.slice(-20), { x: e.clientX, y: e.clientY, t: Date.now() }];
      setTrailPts([...trailRef.current]);
    };
    const leave = () => setVisible(false);
    const down = () => setClick((c) => c + 1);
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-cursor="cta"]')) setHover('cta');
      else if (t.closest('[data-cursor="media"]')) setHover('media');
      else if (t.closest('a, button, [data-cursor="link"]')) setHover('link');
      else setHover(null);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  if (typeof window !== 'undefined') {
    const isMobile =
      window.matchMedia('(max-width: 900px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return null;
  }

  const planeSize = hover === 'cta' ? 52 : hover === 'media' ? 44 : 36;
  const tilt = hover === 'cta' ? -15 : hover === 'media' ? -8 : 0;

  return (
    <>
      <svg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      >
        {trailPts.length > 1 && (
          <polyline
            points={trailPts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(212,165,116,0.55)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 6"
          />
        )}
      </svg>
      <div
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          pointerEvents: 'none',
          zIndex: 10000,
          transform: `translate(-50%, -50%) rotate(${angleRef.current + tilt}deg)`,
          transition: hover ? 'transform 200ms ease' : 'transform 80ms linear',
          opacity: visible ? 1 : 0,
        }}
      >
        <svg width={planeSize} height={planeSize} viewBox="0 0 24 24" fill="none">
          <path
            d="M22 12 L4 4 L7 12 L4 20 Z"
            fill="rgba(212,165,116,0.12)"
            stroke={PAL.gold}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d="M7 12 L9 12" stroke={PAL.gold} strokeWidth="0.7" strokeLinecap="round" opacity="0.7" />
          <circle cx="22" cy="12" r="1.6" fill={PAL.coral} />
        </svg>
      </div>
      {click > 0 && (
        <div
          key={click}
          style={{
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            pointerEvents: 'none',
            zIndex: 9999,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={deg}
              style={{
                position: 'absolute',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'rgba(255,140,122,0.7)',
                animation: `burst-${deg} 600ms ease-out forwards`,
              }}
            />
          ))}
          <style>{[0, 60, 120, 180, 240, 300]
            .map(
              (deg) => `
            @keyframes burst-${deg} {
              0% { transform: translate(0,0) scale(1); opacity: 1; }
              100% { transform: translate(${Math.cos((deg * Math.PI) / 180) * 30}px, ${Math.sin((deg * Math.PI) / 180) * 30}px) scale(0); opacity: 0; }
            }
          `
            )
            .join('')}</style>
        </div>
      )}
    </>
  );
}

/* ── Scroll progress bar ─────────────────────────────────────── */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 1.5,
        background: `linear-gradient(90deg, ${PAL.gold}, ${PAL.coral}, ${PAL.pink})`,
        transformOrigin: '0%',
        scaleX,
        zIndex: 9997,
      }}
    />
  );
}

/* ── Loading curtain ─────────────────────────────────────────── */
export function LoadingCurtain({ onDone }: { onDone?: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 350);
    const t2 = setTimeout(() => setStage(2), 1300);
    const t3 = setTimeout(() => { setStage(3); onDone?.(); }, 1900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone]);

  if (stage >= 3) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: `linear-gradient(135deg, ${PAL.oceanDeep} 0%, ${PAL.ocean} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: stage === 2 ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 850ms cubic-bezier(.7,0,.3,1)',
      }}
    >
      <svg
        width="320"
        height="180"
        viewBox="0 0 320 180"
        style={{ position: 'absolute', opacity: 0.3 }}
      >
        <path
          d="M 30 140 Q 160 30 290 140"
          stroke={PAL.gold}
          strokeWidth="1"
          fill="none"
          strokeDasharray="500"
          strokeDashoffset={stage >= 1 ? 0 : 500}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.7,0,.3,1)' }}
        />
        <g
          transform={`translate(${stage >= 1 ? 290 : 30}, 140) rotate(${stage >= 1 ? -20 : 35})`}
          style={{ transition: 'transform 1.4s cubic-bezier(.7,0,.3,1)' }}
        >
          <path d="M14 0 L-4 -4 L0 0 L-4 4 Z" fill={PAL.gold} />
        </g>
      </svg>
      <div style={{ position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-fraunces), Fraunces, serif',
            fontSize: 'clamp(40px, 7vw, 80px)',
            color: PAL.cream,
            fontWeight: 400,
            letterSpacing: '-0.03em',
            transform: stage >= 1 ? 'translateY(0)' : 'translateY(120%)',
            transition: 'transform 900ms cubic-bezier(.2,.8,.2,1) 100ms',
          }}
        >
          Brazil <span style={{ fontStyle: 'italic', color: PAL.gold }}>Abroad</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 0,
            marginTop: 14,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              height: 1.5,
              background: PAL.gold,
              width: stage >= 1 ? 100 : 0,
              transition: 'width 600ms cubic-bezier(.7,0,.3,1) 700ms',
            }}
          />
          <span
            style={{
              height: 1.5,
              background: PAL.coral,
              width: stage >= 1 ? 30 : 0,
              transition: 'width 400ms cubic-bezier(.7,0,.3,1) 1000ms',
              marginLeft: 4,
            }}
          />
          <span
            style={{
              height: 1.5,
              background: PAL.pink,
              width: stage >= 1 ? 16 : 0,
              transition: 'width 300ms cubic-bezier(.7,0,.3,1) 1200ms',
              marginLeft: 3,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Language switcher ───────────────────────────────────────── */
export function LangSwitcher({ light }: { light?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isPT = locale === 'pt';

  const flip = () => {
    router.replace(pathname, { locale: isPT ? 'en' : 'pt' });
  };

  return (
    <button
      onClick={flip}
      data-cursor="link"
      aria-label={`Switch to ${isPT ? 'English' : 'Portuguese'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        borderRadius: 999,
        background: 'rgba(248,241,229,0.06)',
        border: `1px solid ${light ? 'rgba(248,241,229,0.18)' : 'rgba(10,37,64,0.18)'}`,
        backdropFilter: 'blur(16px)',
        color: light ? PAL.cream : PAL.ocean,
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 250ms, border-color 250ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(212,165,116,0.15)';
        e.currentTarget.style.borderColor = PAL.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(248,241,229,0.06)';
        e.currentTarget.style.borderColor = light ? 'rgba(248,241,229,0.18)' : 'rgba(10,37,64,0.18)';
      }}
    >
      {isPT ? <FlagBR /> : <FlagUS />}
      <span>{isPT ? 'PT' : 'EN'}</span>
      <span style={{ opacity: 0.4, fontSize: 9 }}>↔</span>
      {isPT ? <FlagUS /> : <FlagBR />}
      <span style={{ opacity: 0.4 }}>{isPT ? 'EN' : 'PT'}</span>
    </button>
  );
}

/* ── Wave background (body bg color changes on scroll) ──────── */
export function OceanWaveBg() {
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const stops = [0, 0.15, 0.32, 0.48, 0.65, 0.85, 1];
    const colors = [
      PAL.oceanDeep, PAL.oceanDeep, PAL.ocean, PAL.creamWarm,
      PAL.oceanDeep, PAL.ocean, PAL.oceanDeep,
    ];
    const lerp = (a: string, b: string, t: number) => {
      const hex = (h: string) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
      const ac = hex(a), bc = hex(b);
      return `rgb(${ac.map((v,i)=>Math.round(v+(bc[i]-v)*t)).join(',')})`;
    };
    const unsub = scrollYProgress.on('change', (v) => {
      for (let i = 0; i < stops.length - 1; i++) {
        if (v >= stops[i] && v <= stops[i+1]) {
          const t = (v - stops[i]) / (stops[i+1] - stops[i]);
          document.body.style.backgroundColor = lerp(colors[i], colors[i+1], t);
          break;
        }
      }
    });
    return unsub;
  }, [scrollYProgress]);
  return null;
}
