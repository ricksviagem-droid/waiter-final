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
          <a
            href="https://wa.me/5511962794747?text=Ol%C3%A1%20Ricardo!%20Vi%20o%20Brazil%20Abroad%20e%20quero%20saber%20como%20trabalhar%20no%20exterior%20em%20hospitalidade."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#1ebe5d] transition-colors font-[family-name:var(--font-dm-sans)] text-sm"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Falar com Ricardo no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
