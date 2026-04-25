import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80',
    alt: 'Dubai skyline',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    alt: 'Fine dining service',
  },
  {
    src: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=900&q=80',
    alt: 'Cruise ship',
  },
];

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

          {/* ── Right column — washed photo panel ── */}
          <div className="relative h-[460px] md:h-[540px]">

            {/* Photo grid — 3 cells with brand-color wash */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1.5 rounded-2xl overflow-hidden">

              {/* Top — full width */}
              <div className="col-span-2 relative overflow-hidden">
                <Image
                  src={photos[0].src}
                  alt={photos[0].alt}
                  fill
                  className="object-cover scale-105"
                  sizes="600px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[#1A4A6B]/55" />
              </div>

              {/* Bottom-left */}
              <div className="relative overflow-hidden">
                <Image
                  src={photos[1].src}
                  alt={photos[1].alt}
                  fill
                  className="object-cover scale-105"
                  sizes="300px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[#C9963A]/50" />
              </div>

              {/* Bottom-right */}
              <div className="relative overflow-hidden">
                <Image
                  src={photos[2].src}
                  alt={photos[2].alt}
                  fill
                  className="object-cover scale-105"
                  sizes="300px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[#1A4A6B]/55" />
              </div>
            </div>

            {/* ── Vignette — dissolves the panel into the page ── */}
            {/* Left edge: fades fully into page bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FDFAF4] via-[#FDFAF4]/10 to-transparent pointer-events-none z-10" />
            {/* Top edge */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDFAF4] via-transparent to-transparent pointer-events-none z-10" />
            {/* Bottom edge */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFAF4] via-transparent to-transparent pointer-events-none z-10" />

            {/* ── Badge ── */}
            <div className="absolute top-6 right-4 z-20 bg-[#C9963A] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg font-[family-name:var(--font-dm-sans)] whitespace-nowrap">
              {t('card_badge')}
            </div>

            {/* ── Ricardo card ── */}
            <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-sm rounded-[12px] shadow-xl px-4 py-3 flex items-center gap-3 max-w-[230px]">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative border-2 border-[#C9963A]">
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
    </section>
  );
}
