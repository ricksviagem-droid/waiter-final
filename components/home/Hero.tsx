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
              <a
                href="https://wa.me/5511962794747?text=Ol%C3%A1%20Ricardo!%20Vi%20o%20Brazil%20Abroad%20e%20quero%20saber%20como%20trabalhar%20no%20exterior%20em%20hospitalidade."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold text-sm px-7 py-3.5 rounded-full text-center hover:bg-[#1ebe5d] transition-colors font-[family-name:var(--font-dm-sans)]"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Falar com Ricardo no WhatsApp
              </a>
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
