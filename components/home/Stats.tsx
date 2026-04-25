import { useTranslations } from 'next-intl';

export default function Stats() {
  const t = useTranslations('stats');

  const items = [
    { number: t('s1_number'), label: t('s1_label') },
    { number: t('s2_number'), label: t('s2_label') },
    { number: t('s3_number'), label: t('s3_label') },
    { number: t('s4_number'), label: t('s4_label') },
  ];

  return (
    <section className="bg-white py-20 px-5">
      <div className="max-w-5xl mx-auto">

        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-[#1a1a1a] text-center mb-12">
          {t('title')}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {items.map(({ number, label }) => (
            <div
              key={label}
              className="bg-[#FDFAF4] rounded-[12px] p-6 text-center shadow-[0_2px_16px_rgba(26,74,107,0.07)]"
            >
              <p className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-semibold text-[#1A4A6B] mb-2 leading-none">
                {number}
              </p>
              <p className="text-[#777777] text-xs md:text-sm leading-snug font-[family-name:var(--font-dm-sans)] mt-2">
                {label}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-[#777777] text-sm mt-10 italic font-[family-name:var(--font-fraunces)]">
          {t('subtitle')}
        </p>

      </div>
    </section>
  );
}
