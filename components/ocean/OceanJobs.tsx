'use client';

import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { PAL } from './constants';
import { useOcean } from './OceanProvider';
import { Eyebrow, DisplayHeading, MagneticButton, SocialIcon } from './shared';

const COMPANY_PHOTOS: Record<string, string> = {
  'Atlantis The Royal': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  'MSC Cruises': '/scenes/cruise-star.jpg',
  'Hilton 5★': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
  'Amazónico': 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&q=80',
  'Casa Blanca': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80',
  'Royal Caribbean': 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80',
  'Ling Ling': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  'Four Seasons': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
};

function JobCard({ job, delay, photo }: { job: { role: string; co: string; loc: string; salary: string; tax: string; tag: string; logo: string }; delay: number; photo: string }) {
  const { lang } = useOcean();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [hover, setHover] = useState(false);
  const tagColor = job.tag === 'Hot' ? PAL.coral : (job.tag === 'Senior' || job.tag === 'Lead') ? PAL.gold : PAL.cream;

  return (
    <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} data-cursor="link" style={{ position: 'relative', overflow: 'hidden', background: 'rgba(10,37,64,0.55)', border: `1px solid ${hover ? PAL.gold : 'rgba(212,165,116,0.18)'}`, opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, border-color 250ms`, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', aspectRatio: '5/3', overflow: 'hidden', background: PAL.oceanDeep }}>
        {photo && <img src={photo} alt={job.co} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: hover ? 'saturate(1) brightness(0.85)' : 'saturate(0.7) brightness(0.65)', transform: hover ? 'scale(1.06)' : 'scale(1)', transition: 'filter 350ms, transform 700ms cubic-bezier(.2,.8,.2,1)' }} />}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, rgba(5,28,54,0.85))` }} />
        <div style={{ position: 'absolute', top: 12, left: 12, width: 36, height: 36, borderRadius: '50%', background: PAL.cream, color: PAL.ocean, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 17, fontWeight: 600, boxShadow: `0 4px 14px ${PAL.oceanDeep}aa` }}>{job.logo}</div>
        <span style={{ position: 'absolute', top: 14, right: 14, fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: tagColor, padding: '5px 10px', border: `1px solid ${tagColor}55`, borderRadius: 999, background: `${tagColor}15`, backdropFilter: 'blur(8px)' }}>{job.tag}</span>
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
          <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 10, letterSpacing: '0.22em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{job.co}</div>
          <div style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 19, fontWeight: 500, color: PAL.cream, lineHeight: 1.2 }}>{job.role}</div>
        </div>
      </div>
      <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 12.5, color: 'rgba(248,241,229,0.7)' }}>
          <SocialIcon kind="pin" size={12} color={PAL.gold} />{job.loc}
        </div>
        <div style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 22, fontWeight: 500, color: PAL.cream, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{job.salary}</div>
        <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11.5, color: 'rgba(248,241,229,0.6)', paddingTop: 8, marginTop: 'auto', borderTop: `1px solid ${PAL.gold}22`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{job.tax}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: hover ? PAL.gold : 'rgba(248,241,229,0.45)', transition: 'color 200ms, transform 200ms', transform: hover ? 'translateX(3px)' : 'translateX(0)' }}>
            {lang === 'pt' ? 'Ver' : 'View'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OceanJobs() {
  const { t, lang } = useOcean();
  const [filter, setFilter] = useState('all');
  const filters = [
    { id: 'all',    label: lang === 'pt' ? 'Todas' : 'All' },
    { id: 'Dubai',  label: 'Dubai' },
    { id: 'Cruise', label: lang === 'pt' ? 'Cruzeiros' : 'Cruises' },
    { id: 'Europa', label: 'Europa' },
  ];
  const filtered = t.jobs.list.filter((j) => {
    if (filter === 'all') return true;
    if (filter === 'Dubai') return j.loc.includes('Dubai');
    if (filter === 'Cruise') return j.tag === 'Cruise' || j.co.includes('Cruise') || j.loc === 'Caribe' || j.loc === 'Caribbean' || j.loc.includes('Mediterr');
    if (filter === 'Europa') return j.tag === 'Europa' || j.tag === 'Europe';
    return true;
  });

  return (
    <section id="jobs" style={{ position: 'relative', padding: 'clamp(100px, 14vw, 180px) clamp(20px, 5vw, 80px)', background: `linear-gradient(180deg, ${PAL.oceanDeep} 0%, ${PAL.ocean} 50%, ${PAL.oceanDeep} 100%)`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '50%', height: '60%', background: `radial-gradient(circle, ${PAL.coral}25, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        <div style={{ marginBottom: 'clamp(40px, 6vw, 70px)', maxWidth: 820 }}>
          <Eyebrow color={PAL.gold}>{t.jobs.kicker}</Eyebrow>
          <div style={{ marginTop: 24 }}><DisplayHeading part1={t.jobs.title1} part2={t.jobs.title2} color1={PAL.cream} color2={PAL.gold} /></div>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(15px, 1.15vw, 17.5px)', color: 'rgba(248,241,229,0.75)', lineHeight: 1.65, fontWeight: 300, marginTop: 28, maxWidth: 640 }}>{t.jobs.sub}</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${PAL.gold}25` }}>
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} data-cursor="link" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, padding: '9px 16px', background: filter === f.id ? PAL.gold : 'transparent', color: filter === f.id ? PAL.ocean : PAL.cream, border: `1px solid ${filter === f.id ? PAL.gold : 'rgba(212,165,116,0.3)'}`, cursor: 'pointer', borderRadius: 999, transition: 'all 200ms' }}>
              {f.label}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', alignSelf: 'center', fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, color: 'rgba(248,241,229,0.5)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{filtered.length} {lang === 'pt' ? 'vagas abertas' : 'open jobs'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'clamp(16px, 1.8vw, 24px)' }}>
          {filtered.map((job, i) => <JobCard key={i} job={job} delay={i * 80} photo={COMPANY_PHOTOS[job.co] || ''} />)}
        </div>
        <div style={{ marginTop: 'clamp(60px, 8vw, 90px)', background: `linear-gradient(135deg, ${PAL.gold}30, ${PAL.coral}22)`, border: `1px solid ${PAL.gold}55`, padding: 'clamp(40px, 5vw, 64px) clamp(28px, 4vw, 56px)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, border: `1px solid ${PAL.gold}40`, borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 180, height: 180, border: `1px solid ${PAL.gold}30`, borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, letterSpacing: '0.32em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 700, marginBottom: 18 }}>{lang === 'pt' ? 'Passo 0 · 100% gratuito' : 'Step 0 · 100% free'}</div>
          <h3 style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(28px, 3.6vw, 52px)', color: PAL.cream, fontWeight: 500, lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em', maxWidth: '18ch', marginInline: 'auto' }}>
            {lang === 'pt' ? <>{`Faça sua `}<em style={{ color: PAL.gold, fontStyle: 'italic' }}>avaliação gratuita</em>{` e veja para quais vagas você se encaixa.`}</> : <>{`Take your `}<em style={{ color: PAL.gold, fontStyle: 'italic' }}>free assessment</em>{` and see which jobs fit you.`}</>}
          </h3>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 'clamp(14px, 1.05vw, 16px)', color: 'rgba(248,241,229,0.78)', fontWeight: 300, lineHeight: 1.6, margin: '20px auto 0', maxWidth: 600 }}>
            {lang === 'pt' ? '3 minutos. Diagnóstico de inglês + perfil profissional. Você recebe no e-mail as vagas compatíveis com seu nível, idioma e experiência.' : "3 minutes. English diagnostic + professional profile. You'll get matching jobs in your email based on your level, language and experience."}
          </p>
          <div style={{ marginTop: 32, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton primary style={{ padding: '20px 36px', fontSize: 13 }} href="/assessment">{t.jobs.cta}</MagneticButton>
            <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11.5, color: 'rgba(248,241,229,0.55)', alignSelf: 'center', letterSpacing: '0.04em' }}>
              {lang === 'pt' ? '✓ Sem compromisso  ✓ Sem cobrança  ✓ Resposta em 24h' : '✓ No strings  ✓ No fees  ✓ Reply in 24h'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
