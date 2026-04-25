'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import WhatsAppButton from '@/components/WhatsAppButton';

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
  const phone = '971508108328';
  const waMsg = encodeURIComponent(t('whatsapp_cta'));

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

          <p className="text-[#555] text-sm font-[family-name:var(--font-dm-sans)] mb-6">
            {t(`${profile}_desc`)}
          </p>

          <div className="bg-white/80 rounded-[10px] p-4 text-sm font-[family-name:var(--font-dm-sans)]">
            <p className="text-[#777] text-xs uppercase tracking-wider mb-1">Próximo passo</p>
            <p className="font-semibold" style={{ color: cfg.color }}>
              {t(`${profile}_next`)}
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <a
          href={`https://wa.me/${phone}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-white font-medium py-4 rounded-full text-center text-sm font-[family-name:var(--font-dm-sans)] hover:bg-[#1db954] transition-colors flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
          {t('whatsapp_cta')}
        </a>

        <Link
          href="/"
          className="w-full border border-[#e8e0d0] text-[#777] py-4 rounded-full text-center text-sm font-[family-name:var(--font-dm-sans)] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
        >
          Voltar ao início
        </Link>

      </div>
      <WhatsAppButton />
    </main>
  );
}
