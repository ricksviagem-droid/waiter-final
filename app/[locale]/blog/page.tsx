import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const posts = [
  {
    slug: 'como-conseguir-emprego-cruzeiro-2025',
    category_pt: 'Cruzeiros',
    category_en: 'Cruises',
    title_pt: 'Como conseguir emprego num cruzeiro em 2025',
    title_en: 'How to land a cruise ship job in 2025',
    excerpt_pt: 'O guia completo sobre documentos, inglês necessário, agências e o que esperar a bordo.',
    excerpt_en: 'The complete guide on documents, required English, agencies and what to expect on board.',
    date: 'Jan 2025',
    readTime: '5 min',
    color: '#1A4A6B',
  },
  {
    slug: 'dubai-vs-cruzeiros-qual-escolher',
    category_pt: 'Destinos',
    category_en: 'Destinations',
    title_pt: 'Dubai vs Cruzeiros — qual escolher?',
    title_en: 'Dubai vs Cruises — which to choose?',
    excerpt_pt: 'Comparativo honesto de salários, custo de vida, progressão de carreira e qualidade de vida.',
    excerpt_en: 'Honest comparison of salaries, cost of living, career progression and quality of life.',
    date: 'Jan 2025',
    readTime: '4 min',
    color: '#C9963A',
  },
  {
    slug: '3-erros-brasileiros-rejeitados-exterior',
    category_pt: 'Carreira',
    category_en: 'Career',
    title_pt: '3 coisas que fazem brasileiros serem rejeitados no exterior',
    title_en: '3 things that get Brazilians rejected abroad',
    excerpt_pt: 'Erros que vi repetir centenas de vezes. Pequenos ajustes que mudam completamente o resultado.',
    excerpt_en: 'Mistakes I\'ve seen repeated hundreds of times. Small adjustments that completely change the outcome.',
    date: 'Jan 2025',
    readTime: '3 min',
    color: '#2d6a4f',
  },
];

export default function BlogPage() {
  const t = useTranslations('blog');

  return (
    <>
      <Header />
      <main className="bg-[#FDFAF4] pt-16 min-h-screen">

        {/* Hero */}
        <section className="bg-[#1A4A6B] py-16 px-5 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 font-[family-name:var(--font-dm-sans)]">
              Brazil Abroad · Blog
            </p>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-white">
              {t('title')}
            </h1>
          </div>
        </section>

        {/* Posts */}
        <section className="max-w-4xl mx-auto px-5 py-16">
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}` as '/blog/[slug]'}
                className="group bg-white rounded-[16px] p-6 md:p-8 shadow-[0_2px_16px_rgba(26,74,107,0.07)] hover:shadow-[0_4px_24px_rgba(26,74,107,0.13)] transition-shadow flex flex-col md:flex-row md:items-center gap-6"
              >
                {/* Color accent */}
                <div
                  className="w-1 h-16 rounded-full shrink-0 hidden md:block"
                  style={{ backgroundColor: post.color }}
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full text-white font-[family-name:var(--font-dm-sans)]"
                      style={{ backgroundColor: post.color }}
                    >
                      {post.category_pt}
                    </span>
                    <span className="text-[#999] text-xs font-[family-name:var(--font-dm-sans)]">
                      {post.date} · {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-[#1a1a1a] mb-2 group-hover:text-[#1A4A6B] transition-colors">
                    {post.title_pt}
                  </h2>
                  <p className="text-[#777] text-sm leading-relaxed font-[family-name:var(--font-dm-sans)]">
                    {post.excerpt_pt}
                  </p>
                </div>

                <div className="shrink-0 text-[#1A4A6B] group-hover:translate-x-1 transition-transform">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-[#1A4A6B] rounded-[16px] p-8 text-center">
            <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-white mb-3">
              Quer conteúdo personalizado para o seu perfil?
            </h2>
            <p className="text-white/70 text-sm mb-6 font-[family-name:var(--font-dm-sans)]">
              Faça o assessment e receba um road map feito para você.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-[#C9963A] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#b8872f] transition-colors font-[family-name:var(--font-dm-sans)] text-sm"
            >
              Fazer assessment gratuito
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
