'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { PAL } from './constants';
import { Eyebrow, DisplayHeading, MagneticButton } from './shared';

const packages = [
  {
    name: 'Aula Avulsa',
    detail: '45 minutos',
    price: 'R$ 147',
    period: '',
    highlight: false,
  },
  {
    name: '2 Aulas / Semana',
    detail: 'Plano mensal',
    price: 'R$ 247',
    period: '/mês',
    highlight: true,
  },
  {
    name: '3 Aulas / Semana',
    detail: 'Plano mensal',
    price: 'R$ 300',
    period: '/mês',
    highlight: false,
  },
];

function PackageCard({ pkg, delay }: { pkg: typeof packages[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        background: pkg.highlight ? `linear-gradient(135deg, ${PAL.oceanMid}, ${PAL.ocean})` : `rgba(255,255,255,0.04)`,
        border: `2px solid ${pkg.highlight ? PAL.gold : 'rgba(212,165,116,0.2)'}`,
        borderRadius: 16,
        padding: 'clamp(28px, 3vw, 40px)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
      }}
    >
      {pkg.highlight && (
        <div style={{
          position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
          background: PAL.gold, color: PAL.oceanDeep, fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
          padding: '4px 16px', borderRadius: 999,
        }}>
          Popular
        </div>
      )}
      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, color: PAL.gold, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
        {pkg.detail}
      </div>
      <div style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(18px, 2vw, 24px)', color: PAL.cream, fontWeight: 500, marginBottom: 16 }}>
        {pkg.name}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
        <span style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(36px, 4vw, 52px)', color: PAL.goldWarm, fontWeight: 600, letterSpacing: '-0.03em' }}>
          {pkg.price}
        </span>
        {pkg.period && (
          <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 14, color: 'rgba(248,241,229,0.5)', fontWeight: 300 }}>
            {pkg.period}
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 13, color: 'rgba(248,241,229,0.7)', lineHeight: 1.6, marginBottom: 28, padding: '12px 16px', background: 'rgba(212,165,116,0.08)', borderRadius: 8, border: `1px solid rgba(212,165,116,0.15)` }}>
        🎁 Inclui curso gravado completo na Hotmart
      </div>
      <MagneticButton
        primary={pkg.highlight}
        href="https://calendly.com/ricardo-rogerios/30min"
        style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}
      >
        Agendar Aulas
      </MagneticButton>
    </div>
  );
}

export default function OceanPackages() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      id="pacotes"
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(100px, 14vw, 180px) clamp(20px, 5vw, 80px)',
        background: `linear-gradient(180deg, ${PAL.oceanDeep} 0%, ${PAL.ocean} 50%, ${PAL.oceanDeep} 100%)`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none', background: `radial-gradient(circle at 70% 30%, ${PAL.gold}28, transparent 55%), radial-gradient(circle at 20% 70%, ${PAL.coral}20, transparent 55%)` }} />

      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(50px, 7vw, 80px)' }}>
          <Eyebrow color={PAL.gold}>Pacotes · Invista na sua carreira</Eyebrow>
          <div style={{ marginTop: 28 }}>
            <DisplayHeading part1="Escolha seu" part2="plano." color1={PAL.cream} color2={PAL.gold} center />
          </div>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(14px, 1.1vw, 16px)', color: 'rgba(248,241,229,0.7)', lineHeight: 1.6, fontWeight: 300, maxWidth: 500, margin: '20px auto 0' }}>
            Todos os planos incluem bônus: curso gravado completo na Hotmart.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(16px, 2.5vw, 28px)', marginBottom: 'clamp(48px, 6vw, 72px)' }}>
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.name} pkg={pkg} delay={i * 120} />
          ))}
        </div>

        {/* Pix info */}
        <div
          style={{
            background: 'rgba(212,165,116,0.08)',
            border: `1px solid rgba(212,165,116,0.3)`,
            borderRadius: 12,
            padding: 'clamp(24px, 3vw, 36px)',
            textAlign: 'center',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 700ms cubic-bezier(.2,.8,.2,1) 400ms, transform 700ms cubic-bezier(.2,.8,.2,1) 400ms',
          }}
        >
          <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, color: PAL.gold, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
            Como pagar
          </div>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(14px, 1.1vw, 16px)', color: 'rgba(248,241,229,0.85)', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: PAL.cream }}>Chave Pix:</strong>{' '}
            <span style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 10px', borderRadius: 6, color: PAL.goldWarm }}>
              ricardo.rogerios@hotmail.com
            </span>
          </p>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(13px, 1vw, 15px)', color: 'rgba(248,241,229,0.65)', lineHeight: 1.6, marginTop: 10 }}>
            Envie o comprovante para <strong style={{ color: PAL.cream }}>ricardo@brazilabroad.com</strong> para liberar o agendamento.
          </p>
        </div>
      </div>
    </section>
  );
}
