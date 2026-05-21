'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';

const profileConfig = {
  ready:   { color: '#1A4A6B', bg: '#EBF2F8', border: '#1A4A6B' },
  almost:  { color: '#C9963A', bg: '#FDF6EC', border: '#C9963A' },
  builder: { color: '#2d6a4f', bg: '#EDF5F0', border: '#2d6a4f' },
};

export default function AssessmentResultPage() {
  const t = useTranslations('result');
  const params = useSearchParams();
  const profile = (params.get('profile') ?? 'builder') as 'ready' | 'almost' | 'builder';
  const name = params.get('name') ?? '';
  const cfg = profileConfig[profile];

  return (
    <main className="min-h-screen bg-[#FDFAF4] flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">

        {/* Profile card */}
        <div
          className="rounded-[16px] p-8 border-2 text-center"
          style={{ background: cfg.bg, borderColor: cfg.border }}
        >
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5 font-[family-name:var(--font-dm-sans)]"
            style={{ background: cfg.color, color: 'white' }}
          >
            {t(`${profile}_label`)}
          </span>

          {name && (
            <p className="text-[#777] text-sm mb-1 font-[family-name:var(--font-dm-sans)]">
              {name},
            </p>
          )}

          <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold mb-2" style={{ color: cfg.color }}>
            {t(`${profile}_title`)}
          </h1>

          <p className="text-[#555] text-sm font-[family-name:var(--font-dm-sans)] mb-4">
            {t(`${profile}_desc`)}
          </p>

          <p className="text-[#777] text-xs font-[family-name:var(--font-dm-sans)] mb-6 italic">
            📧 Verifique sua caixa de entrada — e também a pasta de spam caso não encontre nosso email.
          </p>

          <div className="bg-white/80 rounded-[10px] p-4 text-sm font-[family-name:var(--font-dm-sans)]">
            <p className="text-[#777] text-xs uppercase tracking-wider mb-1">Próximo passo</p>
            <p className="font-semibold" style={{ color: cfg.color }}>
              {t(`${profile}_next`)}
            </p>
          </div>
        </div>

        {/* Email sent notice */}
        <div className="rounded-[14px] border border-[#e8e0d0] bg-white px-6 py-5 flex gap-4 items-start">
          <span className="text-2xl mt-0.5">📧</span>
          <div>
            <p className="font-semibold text-sm text-[#1a1a1a] font-[family-name:var(--font-dm-sans)] mb-1">
              Seu diagnóstico foi enviado por email
            </p>
            <p className="text-xs text-[#777] font-[family-name:var(--font-dm-sans)] leading-relaxed">
              Enviamos uma avaliação personalizada do seu perfil com o próximo passo recomendado. Verifique sua caixa de entrada e também a pasta de spam.
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <a
          href="https://calendly.com/ricardo-rogerios/diagnostico-gratuito-_-brazil-abroad"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full font-medium py-4 rounded-full text-center text-sm font-[family-name:var(--font-dm-sans)] transition-colors"
          style={{ background: '#C9963A', color: 'white' }}
        >
          Agendar meu diagnóstico gratuito →
        </a>

        <a
          href="https://waiter-final-7bp6.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#1A4A6B] text-white font-medium py-4 rounded-full text-center text-sm font-[family-name:var(--font-dm-sans)] hover:bg-[#153d5a] transition-colors"
        >
          {t('simulator_cta')}
        </a>

        <Link
          href="/"
          className="w-full border border-[#e8e0d0] text-[#777] py-4 rounded-full text-center text-sm font-[family-name:var(--font-dm-sans)] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
        >
          Voltar ao início
        </Link>

      </div>
    </main>
  );
}
