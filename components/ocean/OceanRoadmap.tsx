'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { PAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, DisplayHeading, MagneticButton } from './shared';

function RoadStepCard({ step, align }: { step: { t: string; d: string; n: string }; align: 'left' | 'right' }) {
  return (
    <div style={{ display: 'inline-block', maxWidth: 440 }}>
      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, letterSpacing: '0.32em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Stop · {step.n}</div>
      <h3 style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(26px, 3.2vw, 42px)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1.05, margin: 0, color: PAL.cream }}>{step.t}</h3>
      <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(14px, 1vw, 16px)', color: 'rgba(248,241,229,0.68)', lineHeight: 1.65, maxWidth: 420, marginTop: 16, marginLeft: align === 'right' ? 'auto' : 0, fontWeight: 300 }}>{step.d}</p>
    </div>
  );
}

function RoadStep({ step, index }: { step: { t: string; d: string; n: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const isOdd = index % 2 === 0;

  return (
    <div ref={ref} className="ocean-roadstep" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center', gap: 0, position: 'relative' }}>
      <div style={{ gridColumn: 1, paddingRight: 'clamp(20px, 3vw, 50px)', textAlign: 'right', opacity: isOdd && inView ? 1 : 0, transform: isOdd ? (inView ? 'translateX(0)' : 'translateX(-30px)') : 'none', transition: 'opacity 700ms cubic-bezier(.2,.8,.2,1) 200ms, transform 700ms cubic-bezier(.2,.8,.2,1) 200ms', visibility: isOdd ? 'visible' : 'hidden' }}>
        {isOdd && <RoadStepCard step={step} align="right" />}
      </div>
      <div style={{ gridColumn: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: PAL.oceanDeep, border: `2px solid ${inView ? PAL.gold : 'rgba(212,165,116,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 22, fontWeight: 500, color: inView ? PAL.gold : 'rgba(212,165,116,0.5)', fontStyle: 'italic', letterSpacing: '-0.02em', transition: 'border-color 600ms, color 600ms', position: 'relative' }}>
          {step.n}
          {inView && <span style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `1px solid ${PAL.gold}`, animation: 'pulseRing 2.4s ease-out infinite' }} />}
        </div>
      </div>
      <div style={{ gridColumn: 3, paddingLeft: 'clamp(20px, 3vw, 50px)', textAlign: 'left', opacity: !isOdd && inView ? 1 : 0, transform: !isOdd ? (inView ? 'translateX(0)' : 'translateX(30px)') : 'none', transition: 'opacity 700ms cubic-bezier(.2,.8,.2,1) 200ms, transform 700ms cubic-bezier(.2,.8,.2,1) 200ms', visibility: !isOdd ? 'visible' : 'hidden' }}>
        {!isOdd && <RoadStepCard step={step} align="left" />}
      </div>
      <style>{`
        @media (max-width: 800px) {
          .ocean-roadstep { grid-template-columns: 60px 1fr !important; }
          .ocean-roadstep > div:nth-child(1) { display: none; }
          .ocean-roadstep > div:nth-child(2) { grid-column: 1 !important; }
          .ocean-roadstep > div:nth-child(3) { grid-column: 2 !important; padding-left: 16px !important; visibility: visible !important; opacity: 1 !important; transform: none !important; text-align: left !important; }
        }
      `}</style>
    </div>
  );
}

export default function OceanRoadmap() {
  const { t, lang } = useOcean();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const pathLength = useTransform(scrollYProgress, [0.05, 0.92], [0, 1]);
  const steps = t.road.steps.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') }));

  return (
    <section id="road" ref={ref} style={{ position: 'relative', padding: 'clamp(100px, 14vw, 180px) clamp(20px, 5vw, 80px)', background: `linear-gradient(180deg, ${PAL.ocean} 0%, ${PAL.oceanMid} 50%, ${PAL.ocean} 100%)`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '-15%', width: '40%', height: '50%', background: `radial-gradient(circle, ${PAL.gold}18, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(70px, 9vw, 120px)' }}>
          <Eyebrow color={PAL.gold}>{t.road.kicker}</Eyebrow>
          <div style={{ marginTop: 28 }}>
            <DisplayHeading part1={t.road.title1} part2={t.road.title2} color1={PAL.cream} color2={PAL.gold} center />
          </div>
        </div>

        <div style={{ position: 'relative', paddingLeft: 0 }}>
          {/* Dashed center line */}
          <svg className="ocean-roadmap-line" preserveAspectRatio="none" viewBox="0 0 4 1000" width="4" height="100%" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', height: '100%' }}>
            <line x1="2" y1="0" x2="2" y2="1000" stroke={`${PAL.gold}26`} strokeWidth="1.4" strokeDasharray="6 8" />
            <motion.path d="M 2 0 L 2 1000" stroke={PAL.gold} strokeWidth="1.6" strokeDasharray="6 8" fill="none" style={{ pathLength }} />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(60px, 7vw, 100px)', position: 'relative' }}>
            {steps.map((s, i) => <RoadStep key={i} step={s} index={i} />)}
          </div>
        </div>

        {/* Assessment CTA */}
        <div style={{ marginTop: 'clamp(70px, 9vw, 120px)', background: `linear-gradient(135deg, ${PAL.gold}30, ${PAL.coral}22)`, border: `1px solid ${PAL.gold}55`, padding: 'clamp(40px, 5vw, 64px) clamp(28px, 4vw, 56px)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 280, height: 280, border: `1px solid ${PAL.gold}40`, borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 220, height: 220, border: `1px solid ${PAL.gold}30`, borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, letterSpacing: '0.32em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 700, marginBottom: 18 }}>
            {lang === 'pt' ? '100% gratuito · 3 minutos' : '100% free · 3 minutes'}
          </div>
          <h3 style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(28px, 3.6vw, 52px)', color: PAL.cream, fontWeight: 500, lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em', maxWidth: '20ch', marginInline: 'auto' }}>
            {lang === 'pt'
              ? <>{`Comece pelo `}<em style={{ color: PAL.gold, fontStyle: 'italic' }}>passo zero</em>{`: faça sua avaliação gratuita.`}</>
              : <>{`Start with `}<em style={{ color: PAL.gold, fontStyle: 'italic' }}>step zero</em>{`: take your free assessment.`}</>}
          </h3>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(14px, 1.05vw, 16px)', color: 'rgba(248,241,229,0.78)', fontWeight: 300, lineHeight: 1.6, margin: '20px auto 0', maxWidth: 620 }}>
            {lang === 'pt'
              ? 'Diagnóstico de inglês + perfil profissional. Em 3 minutos você descobre seu nível atual e quais vagas reais combinam com você. Sem custo, sem compromisso.'
              : 'English diagnostic + professional profile. In 3 minutes, find out your current level and which real jobs match you. No cost, no commitment.'}
          </p>
          <div style={{ marginTop: 32 }}>
            <MagneticButton primary style={{ padding: '20px 40px', fontSize: 13 }} href="/assessment">
              {lang === 'pt' ? 'Faça sua avaliação gratuita' : 'Take your free assessment'}
            </MagneticButton>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 800px) { .ocean-roadmap-line { left: 22px !important; transform: none !important; } }`}</style>
    </section>
  );
}
