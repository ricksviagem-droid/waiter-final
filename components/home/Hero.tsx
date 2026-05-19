import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="bg-[#FDFAF4] min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-5 relative z-10">
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase font-[family-name:var(--font-dm-sans)]">
              {t('eyebrow')}
            </p>

            <h1 className="font-[family-name:var(--font-fraunces)] text-[2.8rem] md:text-[3.8rem] lg:text-[4.8rem] font-semibold leading-[1.05] text-[#1a1a1a]">
              {t('h1')}{' '}
              <em className="text-[#C9963A] italic">{t('h1_highlight')}</em>
            </h1>

            <p className="text-[#1a1a1a] text-lg leading-relaxed font-[family-name:var(--font-dm-sans)] max-w-md">
              {t('subtitle')}
            </p>

            <p className="text-[#777777] text-sm italic font-[family-name:var(--font-fraunces)]">
              {t('honest')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/assessment"
                className="bg-[#1A4A6B] text-white font-medium text-sm px-7 py-3.5 rounded-full text-center hover:bg-[#153d5a] transition-colors font-[family-name:var(--font-dm-sans)]"
              >
                {t('cta_primary')}
              </Link>
              <Link
                href="/about"
                className="border border-[#1a1a1a] text-[#1a1a1a] font-medium text-sm px-7 py-3.5 rounded-full text-center hover:bg-[#1a1a1a] hover:text-white transition-colors font-[family-name:var(--font-dm-sans)]"
              >
                {t('cta_secondary')}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1">
              {[
                { icon: '⭐', label: '15 anos de expertise' },
                { icon: '🏨', label: 'Atlantis The Royal' },
                { icon: '🤖', label: 'App com IA — grátis' },
              ].map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-[#777] font-[family-name:var(--font-dm-sans)]">
                  <span>{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right column — YouTube video ── */}
          <div className="relative w-full">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
              style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://www.youtube.com/embed/KXnjAxuFS6M"
                title="Brazil Abroad — Seu mapa para o mundo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
            {/* Badge */}
            <div className="mt-3 flex justify-end">
              <span className="bg-[#C9963A] text-white text-xs font-semibold px-4 py-2 rounded-full shadow font-[family-name:var(--font-dm-sans)] whitespace-nowrap">
                {t('card_badge')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
