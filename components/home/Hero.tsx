import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

const venueImages = [
  {
    src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    alt: 'Luxury Dubai hotel',
    style: 'absolute top-0 left-0 w-[75%] h-[58%] rounded-[12px] shadow-xl z-10 overflow-hidden',
  },
  {
    src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    alt: 'Fine dining restaurant',
    style: 'absolute bottom-0 right-0 w-[68%] h-[52%] rounded-[12px] shadow-xl z-20 overflow-hidden',
  },
  {
    src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
    alt: 'Luxury cocktail bar',
    style: 'absolute top-[28%] left-[18%] w-[56%] h-[44%] rounded-[12px] shadow-2xl z-30 overflow-hidden',
  },
];

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="bg-[#FDFAF4] min-h-screen flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-5">
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase font-[family-name:var(--font-dm-sans)]">
              {t('eyebrow')}
            </p>

            <h1 className="font-[family-name:var(--font-fraunces)] text-[2.6rem] md:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] text-[#1a1a1a]">
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
          </div>

          {/* ── Right column — image collage + card ── */}
          <div className="relative flex justify-center md:justify-end">

            {/* Collage container */}
            <div className="relative w-full max-w-[380px] h-[420px] md:h-[460px]">

              {/* Venue images stacked */}
              {venueImages.map(({ src, alt, style }) => (
                <div key={alt} className={style}>
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover rounded-[12px]"
                    sizes="300px"
                    unoptimized
                  />
                  {/* subtle dark overlay */}
                  <div className="absolute inset-0 bg-[#1A4A6B]/10 rounded-[12px]" />
                </div>
              ))}

              {/* Badge */}
              <div className="absolute -top-3 right-0 z-40 bg-[#C9963A] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg font-[family-name:var(--font-dm-sans)] whitespace-nowrap">
                {t('card_badge')}
              </div>

              {/* Ricardo card pinned bottom-left */}
              <div className="absolute bottom-0 left-0 z-40 bg-white rounded-[12px] shadow-xl px-4 py-3 flex items-center gap-3 max-w-[240px]">
                <div className="w-10 h-10 rounded-full bg-[#1A4A6B] overflow-hidden shrink-0 relative">
                  <Image
                    src="/scenes/rick.jpeg"
                    alt="Ricardo Rogerio"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[#1a1a1a] leading-tight">
                    {t('card_name')}
                  </p>
                  <p className="text-[#777777] text-[11px] font-[family-name:var(--font-dm-sans)] leading-tight mt-0.5">
                    {t('card_sub')}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
