'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function HowItWorks() {
  const t = useTranslations('howItWorks');
  const ref = useRef<HTMLElement>(null);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setGo(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const steps = [
    { number: t('step1_number'), title: t('step1_title'), desc: t('step1_desc') },
    { number: t('step2_number'), title: t('step2_title'), desc: t('step2_desc') },
    { number: t('step3_number'), title: t('step3_title'), desc: t('step3_desc') },
  ];

  const pathD = 'M 100 46 C 200 46 200 20 300 20 C 400 20 400 46 500 46';
  const pathLen = 470;
  const nodes = [{ cx: 100, cy: 46 }, { cx: 300, cy: 20 }, { cx: 500, cy: 46 }];

  return (
    <section className="bg-[#F5EDD8] py-24 px-5" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase text-center mb-4 font-[family-name:var(--font-dm-sans)]">
          Como funciona
        </p>
        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-[#1a1a1a] text-center mb-10">
          {t('title')}
        </h2>

        {/* Desktop: animated road map SVG */}
        <div className="hidden md:block mb-2">
          <svg viewBox="0 0 600 80" className="w-full h-auto overflow-visible">
            <path d={pathD} stroke="#C9963A" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.07" />
            <path
              d={pathD}
              stroke="#C9963A"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={pathLen}
              strokeDashoffset={go ? 0 : pathLen}
              style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)' }}
              opacity="0.55"
            />
            {nodes.map(({ cx, cy }, i) => (
              <g
                key={i}
                style={{
                  opacity: go ? 1 : 0,
                  transition: `opacity 0.5s ease ${0.5 + i * 0.45}s`,
                }}
              >
                <circle cx={cx} cy={cy} r="22" fill="#F5EDD8" stroke="#C9963A" strokeWidth="2" />
                <circle cx={cx} cy={cy} r="10" fill="#C9963A" />
                <text
                  x={cx}
                  y={cy}
                  fontSize="11"
                  fill="white"
                  fontFamily="sans-serif"
                  fontWeight="800"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Step cards */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-16">
          {steps.map(({ number, title, desc }, i) => (
            <div
              key={number}
              className="flex flex-col"
              style={{
                opacity: go ? 1 : 0,
                transform: go ? 'translateY(0)' : 'translateY(18px)',
                transition: `opacity 0.6s ease ${0.55 + i * 0.38}s, transform 0.6s ease ${0.55 + i * 0.38}s`,
              }}
            >
              <div className="md:hidden flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full border-2 border-[#C9963A] bg-[#F5EDD8] flex items-center justify-center shrink-0">
                  <span className="font-[family-name:var(--font-fraunces)] text-sm font-bold text-[#C9963A]">{number}</span>
                </div>
                {i < 2 && <div className="flex-1 h-px bg-gradient-to-r from-[#C9963A]/40 to-transparent" />}
              </div>

              <span className="hidden md:block font-[family-name:var(--font-fraunces)] text-[5.5rem] font-semibold leading-none select-none text-[#C9963A]/12 -mb-5">
                {number}
              </span>

              <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-[#1a1a1a] mb-2">
                {title}
              </h3>
              <p className="text-[#777] text-sm font-[family-name:var(--font-dm-sans)] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/assessment"
            className="bg-[#1A4A6B] text-white font-medium px-8 py-4 rounded-full hover:bg-[#153d5a] transition-colors font-[family-name:var(--font-dm-sans)] text-sm inline-flex items-center gap-2"
          >
            {t('cta')}
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
