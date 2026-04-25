import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function FinalCTA() {
  const t = useTranslations('finalCta');

  return (
    <section className="bg-[#1A4A6B] py-24 px-5 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">

        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl font-semibold text-white leading-tight">
          {t('title')}
        </h2>

        <p className="text-white/70 text-base md:text-lg font-[family-name:var(--font-dm-sans)]">
          {t('subtitle')}
        </p>

        <Link
          href="/assessment"
          className="bg-[#C9963A] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#b8872f] transition-colors text-base font-[family-name:var(--font-dm-sans)] mt-2"
        >
          {t('cta')}
        </Link>

      </div>
    </section>
  );
}
