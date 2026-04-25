import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="bg-[#FDFAF4] min-h-screen flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-5">

            {/* Eyebrow */}
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase font-[family-name:var(--font-dm-sans)]">
              {t('eyebrow')}
            </p>

            {/* H1 */}
            <h1 className="font-[family-name:var(--font-fraunces)] text-[2.6rem] md:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] text-[#1a1a1a]">
              {t('h1')}{' '}
              <em className="text-[#C9963A] italic">{t('h1_highlight')}</em>
            </h1>

            {/* Subtitle */}
            <p className="text-[#1a1a1a] text-lg leading-relaxed font-[family-name:var(--font-dm-sans)] max-w-md">
              {t('subtitle')}
            </p>

            {/* Honest note */}
            <p className="text-[#777777] text-sm italic font-[family-name:var(--font-fraunces)]">
              {t('honest')}
            </p>

            {/* CTAs */}
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
          </div>

          {/* ── Right column — card ── */}
          <div className="relative flex justify-center md:justify-end">

            {/* Floating badge */}
            <div className="absolute -top-3 right-2 md:right-0 z-10 bg-[#C9963A] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg font-[family-name:var(--font-dm-sans)] whitespace-nowrap">
              {t('card_badge')}
            </div>

            {/* Card */}
            <div className="bg-white rounded-[12px] shadow-[0_4px_32px_rgba(26,74,107,0.13)] p-5 w-full max-w-[340px]">

              {/* Photo placeholder */}
              <div className="w-full h-56 bg-[#1A4A6B] rounded-[8px] mb-5 flex items-center justify-center">
                <svg
                  width="52"
                  height="52"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <p className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-[#1a1a1a]">
                  {t('card_name')}
                </p>
                <p className="text-[#777777] text-sm font-[family-name:var(--font-dm-sans)]">
                  {t('card_sub')}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
