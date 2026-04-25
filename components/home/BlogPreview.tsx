import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const postImages = [
  'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&q=80', // cruise ship
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', // Dubai
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', // restaurant
];

export default function BlogPreview() {
  const t = useTranslations('blog');

  const posts = [
    { category: t('post1_category'), title: t('post1_title'), date: t('post1_date'), img: postImages[0] },
    { category: t('post2_category'), title: t('post2_title'), date: t('post2_date'), img: postImages[1] },
    { category: t('post3_category'), title: t('post3_title'), date: t('post3_date'), img: postImages[2] },
  ];

  return (
    <section className="bg-[#FDFAF4] py-20 px-5">
      <div className="max-w-5xl mx-auto">

        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-[#1a1a1a] text-center mb-12">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {posts.map(({ category, title, date, img }) => (
            <Link
              key={title}
              href="/blog"
              className="bg-white rounded-[12px] overflow-hidden shadow-[0_2px_16px_rgba(26,74,107,0.07)] hover:shadow-[0_4px_24px_rgba(26,74,107,0.13)] transition-shadow group"
            >
              {/* Image */}
              <div className="relative w-full h-44 overflow-hidden">
                <Image
                  src={img}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 90vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-2">
                <span className="text-[#C9963A] text-[11px] font-semibold tracking-widest uppercase font-[family-name:var(--font-dm-sans)]">
                  {category}
                </span>
                <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[#1a1a1a] leading-snug">
                  {title}
                </h3>
                <p className="text-[#777777] text-xs font-[family-name:var(--font-dm-sans)]">
                  {date}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/blog"
            className="border border-[#1a1a1a] text-[#1a1a1a] text-sm font-medium px-7 py-3 rounded-full hover:bg-[#1a1a1a] hover:text-white transition-colors font-[family-name:var(--font-dm-sans)]"
          >
            {t('cta')}
          </Link>
        </div>

      </div>
    </section>
  );
}
