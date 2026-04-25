import { useTranslations } from 'next-intl';

const partners = [
  { name: 'Atlantis The Royal', sub: 'Dubai, UAE' },
  { name: 'ÉS English School', sub: 'Dubai, UAE' },
  { name: 'Infinity Brasil', sub: 'Recrutadora Internacional' },
  { name: 'Amazónico Dubai', sub: 'Dubai, UAE' },
];

export default function Partners() {
  const t = useTranslations('partners');

  return (
    <section className="bg-[#F5EDD8] py-16 px-5">
      <div className="max-w-5xl mx-auto">

        <p className="text-[#777777] text-xs font-semibold tracking-[0.18em] uppercase text-center mb-8 font-[family-name:var(--font-dm-sans)]">
          {t('title')}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partners.map(({ name, sub }) => (
            <div
              key={name}
              className="bg-white rounded-[12px] p-5 flex flex-col items-center justify-center gap-2 text-center shadow-[0_2px_12px_rgba(26,74,107,0.06)] min-h-[90px]"
            >
              <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[#1A4A6B] leading-tight">
                {name}
              </p>
              <p className="text-[#777777] text-[11px] font-[family-name:var(--font-dm-sans)]">
                {sub}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-[#777777] text-sm mt-8 font-[family-name:var(--font-dm-sans)]">
          {t('subtitle')}
        </p>

      </div>
    </section>
  );
}
