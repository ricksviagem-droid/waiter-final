'use client';

import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { PAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, DisplayHeading } from './shared';

function Stat({ num, suffix, label, delay }: { num: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const dur = 1800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(num * eased));
      if (p < 1) requestAnimationFrame(step);
      else setVal(num);
    };
    setTimeout(() => requestAnimationFrame(step), delay);
  }, [inView, num, delay]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(56px, 8vw, 110px)', fontWeight: 500, color: PAL.cream, letterSpacing: '-0.04em', lineHeight: 1 }}>
        {val.toLocaleString('pt-BR')}<span style={{ color: PAL.gold, fontStyle: 'italic', fontWeight: 400 }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 12, color: 'rgba(248,241,229,0.55)', marginTop: 18, lineHeight: 1.5, maxWidth: 220, margin: '18px auto 0' }}>{label}</div>
    </div>
  );
}

export default function OceanStats() {
  const { t, lang } = useOcean();
  const stats = [
    { num: 5000, suffix: ' USD', label: t.stats.label1 },
    { num: 20,   suffix: '+',   label: t.stats.label2 },
    { num: 15,   suffix: lang === 'pt' ? ' anos' : ' yrs', label: t.stats.label3 },
    { num: 500,  suffix: '+',   label: t.stats.label4 },
  ];

  return (
    <section style={{ padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 80px)', position: 'relative', overflow: 'hidden', background: `linear-gradient(180deg, ${PAL.oceanDeep} 0%, ${PAL.ocean} 100%)` }}>
      <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '50%', height: '60%', background: `radial-gradient(circle, ${PAL.gold}25, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(60px, 8vw, 100px)' }}>
          <Eyebrow color={PAL.gold}>{t.stats.kicker}</Eyebrow>
          <div style={{ marginTop: 28 }}>
            <DisplayHeading part1={t.stats.title1} part2={t.stats.title2} color1={PAL.cream} color2={PAL.gold} center />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(40px, 5vw, 60px)' }}>
          {stats.map((s, i) => <Stat key={i} {...s} delay={i * 150} />)}
        </div>
      </div>
    </section>
  );
}
