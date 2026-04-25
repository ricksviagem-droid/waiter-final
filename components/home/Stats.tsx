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
    <section className="bg-[#FDFAF4] py-20 px-5">
      <div className="max-w-5xl mx-auto">

        <p className="text-[#777] text-[11px] font-semibold tracking-[0.18em] uppercase text-center mb-16 font-[family-name:var(--font-dm-sans)]">
          {t('title')}
        </p>

        {/* Editorial number strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-[#e8e0d0]">
          {items.map(({ number, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center text-center py-8 px-4 md:px-8 ${
                i < 2 ? 'border-b md:border-b-0 border-[#e8e0d0]' : ''
              } ${i % 2 === 0 && i < 2 ? 'border-r md:border-r-0 border-[#e8e0d0]' : ''}`}
            >
              <span className="font-[family-name:var(--font-fraunces)] text-[3.8rem] md:text-[5rem] lg:text-[5.5rem] font-semibold text-[#1A4A6B] leading-none mb-4">
                {number}
              </span>
              <span className="text-[#888] text-xs md:text-sm leading-snug font-[family-name:var(--font-dm-sans)] max-w-[120px]">
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-[#999] text-sm mt-14 italic font-[family-name:var(--font-fraunces)]">
          {t('subtitle')}
        </p>

      </div>
    </section>
  );
}
