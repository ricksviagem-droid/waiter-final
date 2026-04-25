import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function About() {
  const t = useTranslations('about');

  const tags = [t('tag1'), t('tag2'), t('tag3'), t('tag4')];

  return (
    <section className="bg-[#FDFAF4] py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Photo */}
          <div className="relative w-full aspect-[4/5] rounded-[12px] overflow-hidden bg-[#1A4A6B] max-w-sm mx-auto md:mx-0">
            <Image
              src="/scenes/rick.jpeg"
              alt="Ricardo Rogerio"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 45vw"
            />
            {/* subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A4A6B]/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-5">
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase font-[family-name:var(--font-dm-sans)]">
              {t('label')}
            </p>

            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight">
              {t('title')}
            </h2>

            <p className="text-[#444] text-base leading-relaxed font-[family-name:var(--font-dm-sans)]">
              {t('p1')}
            </p>

            <p className="text-[#444] text-base leading-relaxed font-[family-name:var(--font-dm-sans)]">
              {t('p2')}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[#1A4A6B] border border-[#1A4A6B]/30 px-3 py-1 rounded-full font-[family-name:var(--font-dm-sans)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex self-start items-center gap-2 border border-[#1a1a1a] text-[#1a1a1a] text-sm font-medium px-6 py-3 rounded-full hover:bg-[#1a1a1a] hover:text-white transition-colors mt-2 font-[family-name:var(--font-dm-sans)]"
            >
              {t('cta')}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
