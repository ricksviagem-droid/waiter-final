import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function HowItWorks() {
  const t = useTranslations('howItWorks');

  const steps = [
    { number: t('step1_number'), title: t('step1_title'), desc: t('step1_desc') },
    { number: t('step2_number'), title: t('step2_title'), desc: t('step2_desc') },
    { number: t('step3_number'), title: t('step3_title'), desc: t('step3_desc') },
  ];

  return (
    <section className="bg-[#F5EDD8] py-20 px-5">
      <div className="max-w-5xl mx-auto">

        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-[#1a1a1a] text-center mb-14">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12 mb-14">
          {steps.map(({ number, title, desc }) => (
            <div key={number} className="flex flex-col gap-3">
              <span className="font-[family-name:var(--font-fraunces)] text-6xl font-semibold text-[#C9963A] leading-none">
                {number}
              </span>
              <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-[#1a1a1a] mt-1">
                {title}
              </h3>
              <p className="text-[#777777] text-sm font-[family-name:var(--font-dm-sans)] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/assessment"
            className="bg-[#1A4A6B] text-white font-medium px-8 py-4 rounded-full hover:bg-[#153d5a] transition-colors font-[family-name:var(--font-dm-sans)] text-sm"
          >
            {t('cta')}
          </Link>
        </div>

      </div>
    </section>
  );
}
