import { useTranslations } from 'next-intl';

const avatarColors = ['#1A4A6B', '#C9963A', '#2d6a4f'];

export default function Testimonials() {
  const t = useTranslations('testimonials');

  const items = [
    { name: t('t1_name'), result: t('t1_result'), initial: 'A' },
    { name: t('t2_name'), result: t('t2_result'), initial: 'C' },
    { name: t('t3_name'), result: t('t3_result'), initial: 'J' },
  ];

  return (
    <section className="bg-white py-20 px-5">
      <div className="max-w-5xl mx-auto">

        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-[#1a1a1a] text-center mb-12">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {items.map(({ name, result, initial }, i) => (
            <div
              key={name}
              className="bg-[#FDFAF4] rounded-[12px] p-6 shadow-[0_2px_16px_rgba(26,74,107,0.07)] flex flex-col gap-4"
            >
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold font-[family-name:var(--font-fraunces)]"
                style={{ backgroundColor: avatarColors[i] }}
              >
                {initial}
              </div>
              <div>
                <p className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[#1a1a1a]">
                  {name}
                </p>
                <p className="text-[#C9963A] text-sm font-semibold mt-1 font-[family-name:var(--font-dm-sans)]">
                  {result}
                </p>
              </div>
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="14" height="14" fill="#C9963A" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Video placeholder */}
        <div className="bg-[#1A4A6B] rounded-[12px] aspect-video max-w-2xl mx-auto flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-white/70 text-sm font-[family-name:var(--font-dm-sans)]">
            {t('video_placeholder')}
          </p>
        </div>

      </div>
    </section>
  );
}
