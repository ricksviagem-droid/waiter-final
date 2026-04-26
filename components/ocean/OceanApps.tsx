'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { PAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, DisplayHeading, MagneticButton } from './shared';

function PhoneMockup({ app, reverse, delay }: { app: { tag: string; name: string; d: string }; reverse?: boolean; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt({ x, y });
  };

  const isCareer = app.name === 'Career Simulator';

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : reverse ? 'translateY(40px)' : 'translateY(40px)',
        transition: `opacity 800ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 800ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
        display: 'flex',
        flexDirection: reverse ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 'clamp(40px, 6vw, 80px)',
      }}
      className="ocean-app-row"
    >
      {/* Phone */}
      <div
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          flex: '0 0 auto',
          width: 'clamp(200px, 22vw, 280px)',
          perspective: 1000,
        }}
      >
        <div style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: 'transform 200ms ease-out',
          transformStyle: 'preserve-3d',
          width: '100%',
        }}>
          {/* Phone shell */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '9/19',
            background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
            borderRadius: 'clamp(28px, 3vw, 40px)',
            border: `1px solid rgba(255,255,255,0.12)`,
            boxShadow: `0 50px 100px ${PAL.oceanDeep}, 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1)`,
            overflow: 'hidden',
            padding: '12px 10px',
          }}>
            {/* Notch */}
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 80, height: 20, background: '#0a0a14', borderRadius: 10, zIndex: 10 }} />

            {/* Screen content */}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: 'clamp(20px, 2.5vw, 32px)',
              background: isCareer
                ? `linear-gradient(160deg, #0a1628, #0d2244, #051C36)`
                : `linear-gradient(160deg, #0d1117, #0a2540, #051C36)`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: '28px 14px 14px',
              gap: 10,
            }}>
              {/* App tag pill */}
              <div style={{ alignSelf: 'center', background: `${PAL.gold}20`, border: `1px solid ${PAL.gold}50`, borderRadius: 999, padding: '4px 12px', fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 8, letterSpacing: '0.2em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 700 }}>
                {app.tag}
              </div>

              {/* App name */}
              <div style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 16, fontWeight: 500, color: PAL.cream, textAlign: 'center', lineHeight: 1.2 }}>{app.name}</div>

              {/* Simulated UI elements */}
              {isCareer ? (
                <>
                  {/* Interview simulation UI */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    {/* AI message bubble */}
                    <div style={{ background: `${PAL.gold}15`, border: `1px solid ${PAL.gold}30`, borderRadius: '12px 12px 12px 2px', padding: '10px 12px' }}>
                      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9, color: PAL.gold, fontWeight: 600, marginBottom: 4 }}>INTERVIEWER</div>
                      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, color: PAL.cream, lineHeight: 1.5 }}>Tell me about your experience with fine dining service standards.</div>
                    </div>
                    {/* User response area */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px 12px 2px 12px', padding: '10px 12px', marginLeft: 16 }}>
                      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9, color: PAL.coral, fontWeight: 600, marginBottom: 4 }}>YOU</div>
                      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, color: 'rgba(248,241,229,0.7)', lineHeight: 1.5 }}>I have 3 years of experience…</div>
                    </div>
                    {/* Score bar */}
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 8, color: 'rgba(248,241,229,0.5)', marginBottom: 6 }}>
                        <span>Confidence</span><span style={{ color: PAL.gold }}>87%</span>
                      </div>
                      <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <div style={{ width: '87%', height: '100%', background: `linear-gradient(90deg, ${PAL.gold}, ${PAL.coral})`, borderRadius: 2 }} />
                      </div>
                    </div>
                  </div>
                  {/* Record button */}
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${PAL.coral}, ${PAL.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${PAL.coral}60` }}>
                      <span style={{ fontSize: 18 }}>🎙️</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Shift simulator UI */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    {/* Scenario header */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 8, color: 'rgba(248,241,229,0.5)' }}>TABLE 12 · VIP GUEST</div>
                      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 8, color: PAL.coral, fontWeight: 600 }}>⏱ 0:23</div>
                    </div>
                    {/* Guest request */}
                    <div style={{ background: `${PAL.oceanMid}40`, border: `1px solid ${PAL.gold}25`, borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 8, color: PAL.gold, fontWeight: 600, marginBottom: 4 }}>🔊 GUEST AUDIO</div>
                      <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, color: PAL.cream, lineHeight: 1.5 }}>"Excuse me, this isn't what I ordered. I clearly said no garlic."</div>
                    </div>
                    {/* Response options */}
                    {['Apologize & replace immediately', 'Explain the dish', 'Call manager'].map((opt, i) => (
                      <div key={i} style={{ background: i === 0 ? `${PAL.gold}15` : 'rgba(255,255,255,0.04)', border: `1px solid ${i === 0 ? PAL.gold + '40' : 'rgba(255,255,255,0.08)'}`, borderRadius: 6, padding: '8px 10px', fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 8.5, color: i === 0 ? PAL.cream : 'rgba(248,241,229,0.5)' }}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Glow beneath */}
          <div style={{ position: 'absolute', bottom: -20, left: '20%', right: '20%', height: 30, background: isCareer ? `${PAL.gold}30` : `${PAL.coral}25`, filter: 'blur(20px)', borderRadius: '50%' }} />
        </div>
      </div>

      {/* Text */}
      <div style={{ flex: 1, maxWidth: 480 }}>
        <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, letterSpacing: '0.28em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>{app.tag}</div>
        <h3 style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(30px, 3.8vw, 52px)', fontWeight: 500, color: PAL.cream, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '0 0 20px' }}>{app.name}</h3>
        <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(14.5px, 1.1vw, 17px)', color: 'rgba(248,241,229,0.7)', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{app.d}</p>
        <div style={{ marginTop: 32, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, color: PAL.gold, border: `1px solid ${PAL.gold}40`, padding: '6px 14px', borderRadius: 999, background: `${PAL.gold}10` }}>
            {isCareer ? (app.name === 'Career Simulator' ? '🎙️ Voice AI' : '⏱ Real-time') : '🔊 Real guest audio'}
          </span>
          <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, color: PAL.coral, border: `1px solid ${PAL.coral}40`, padding: '6px 14px', borderRadius: 999, background: `${PAL.coral}10` }}>
            {isCareer ? '📊 Instant feedback' : '📝 Shift report'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OceanApps() {
  const { t, lang } = useOcean();
  const ref = useRef<HTMLElement>(null);

  return (
    <section id="apps" ref={ref} style={{ position: 'relative', padding: 'clamp(100px, 14vw, 180px) clamp(20px, 5vw, 80px)', background: `linear-gradient(180deg, ${PAL.oceanDeep} 0%, ${PAL.ocean} 50%, ${PAL.oceanDeep} 100%)`, overflow: 'hidden' }}>
      {/* Glows */}
      <div style={{ position: 'absolute', top: '15%', right: '-8%', width: '42%', height: '50%', background: `radial-gradient(circle, ${PAL.coral}22, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '38%', height: '45%', background: `radial-gradient(circle, ${PAL.gold}20, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(60px, 8vw, 100px)', maxWidth: 700, marginInline: 'auto' }}>
          <Eyebrow color={PAL.gold}>{t.apps.kicker}</Eyebrow>
          <div style={{ marginTop: 28 }}>
            <DisplayHeading part1={t.apps.title1} part2={t.apps.title2} color1={PAL.cream} color2={PAL.gold} center />
          </div>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(15px, 1.1vw, 17px)', color: 'rgba(248,241,229,0.7)', lineHeight: 1.6, fontWeight: 300, marginTop: 24, marginInline: 'auto' }}>
            {t.apps.sub}
          </p>
        </div>

        {/* Apps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(80px, 10vw, 130px)' }}>
          <PhoneMockup app={t.apps.app1} delay={0} />
          <PhoneMockup app={t.apps.app2} reverse delay={150} />
        </div>

        {/* CTA */}
        <div style={{ marginTop: 'clamp(70px, 9vw, 110px)', textAlign: 'center' }}>
          <MagneticButton primary href="/simulator" style={{ padding: '20px 40px', fontSize: 13 }}>
            {t.apps.cta}
          </MagneticButton>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11.5, color: 'rgba(248,241,229,0.45)', marginTop: 16 }}>
            {lang === 'pt' ? '✓ Sem cadastro  ✓ Sem custo  ✓ Funciona no celular' : '✓ No sign-up  ✓ No cost  ✓ Works on mobile'}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .ocean-app-row { flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}
