'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { jobs, categories, type JobCategory } from '@/lib/exchange/jobs';

const categoryColors: Record<JobCategory, string> = {
  cruise: '#1A4A6B',
  hotel: '#C9963A',
  restaurant: '#2d6a4f',
  bar: '#7c3d8c',
};

export default function ExchangePage() {
  const locale = useLocale();
  const isPt = locale === 'pt';
  const [active, setActive] = useState<JobCategory | 'all'>('all');

  const filtered = active === 'all' ? jobs : jobs.filter((j) => j.category === active);
  const featured = filtered.filter((j) => j.featured);
  const regular = filtered.filter((j) => !j.featured);

  return (
    <>
      <Header />
      <main className="bg-[#FDFAF4] min-h-screen pt-16">

        {/* Hero */}
        <section className="bg-[#1A4A6B] py-16 px-5 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 font-[family-name:var(--font-dm-sans)]">
              {isPt ? 'Vagas Curadas' : 'Curated Jobs'}
            </p>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-white mb-4">
              {isPt ? 'Oportunidades reais no exterior.' : 'Real opportunities abroad.'}
            </h1>
            <p className="text-white/70 text-base font-[family-name:var(--font-dm-sans)]">
              {isPt
                ? 'Vagas verificadas por Ricardo. Salários reais. Sem enganação.'
                : 'Verified by Ricardo. Real salaries. No BS.'}
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-5 py-12">

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(({ key, labelPt, labelEn }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all font-[family-name:var(--font-dm-sans)] ${
                  active === key
                    ? 'bg-[#1A4A6B] text-white'
                    : 'bg-white border border-[#e8e0d0] text-[#777] hover:border-[#1A4A6B] hover:text-[#1A4A6B]'
                }`}
              >
                {isPt ? labelPt : labelEn}
              </button>
            ))}
          </div>

          {/* Featured jobs */}
          {featured.length > 0 && (
            <div className="mb-8">
              <p className="text-[#C9963A] text-[11px] font-semibold tracking-widest uppercase mb-4 font-[family-name:var(--font-dm-sans)]">
                {isPt ? '⭐ Destaque' : '⭐ Featured'}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {featured.map((job) => (
                  <JobCard key={job.id} job={job} isPt={isPt} />
                ))}
              </div>
            </div>
          )}

          {/* Regular jobs */}
          {regular.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {regular.map((job) => (
                <JobCard key={job.id} job={job} isPt={isPt} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-center text-[#777] py-16 font-[family-name:var(--font-dm-sans)]">
              {isPt ? 'Nenhuma vaga nessa categoria no momento.' : 'No jobs in this category right now.'}
            </p>
          )}

          {/* CTA */}
          <div className="mt-16 bg-[#1A4A6B] rounded-[16px] p-8 text-center">
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-white mb-3">
              {isPt ? 'Não encontrou a vaga certa?' : "Didn't find the right job?"}
            </h2>
            <p className="text-white/70 text-sm mb-6 font-[family-name:var(--font-dm-sans)]">
              {isPt
                ? 'Fala com Ricardo. Ele pode te indicar vagas que não estão listadas aqui.'
                : 'Talk to Ricardo. He can point you to unlisted opportunities.'}
            </p>
            <a
              href={`https://wa.me/971508108328?text=${encodeURIComponent(isPt ? 'Olá Ricardo, vi as vagas no Brazil Abroad e quero saber mais.' : 'Hello Ricardo, I saw the jobs on Brazil Abroad and want to know more.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C9963A] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#b8872f] transition-colors font-[family-name:var(--font-dm-sans)] text-sm"
            >
              {isPt ? 'Falar com Ricardo' : 'Talk to Ricardo'}
            </a>
          </div>

        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function JobCard({ job, isPt }: { job: (typeof jobs)[0]; isPt: boolean }) {
  const color = categoryColors[job.category];
  const title = isPt ? job.title : job.titleEn;
  const description = isPt ? job.description : job.descriptionEn;
  const tags = isPt ? job.tags : job.tagsEn;

  return (
    <div className="bg-white rounded-[12px] p-6 shadow-[0_2px_16px_rgba(26,74,107,0.07)] flex flex-col gap-4 hover:shadow-[0_4px_24px_rgba(26,74,107,0.13)] transition-shadow">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[#1a1a1a] leading-tight">
            {title}
          </h3>
          <p className="text-[#777] text-sm mt-0.5 font-[family-name:var(--font-dm-sans)]">
            {job.company}
          </p>
        </div>
        <span
          className="shrink-0 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full text-white font-[family-name:var(--font-dm-sans)]"
          style={{ backgroundColor: color }}
        >
          {isPt
            ? job.category === 'cruise' ? 'Cruzeiro'
              : job.category === 'hotel' ? 'Hotel'
              : job.category === 'restaurant' ? 'Restaurante'
              : 'Bar'
            : job.category.charAt(0).toUpperCase() + job.category.slice(1)}
        </span>
      </div>

      {/* Location + salary */}
      <div className="flex items-center gap-4 text-sm font-[family-name:var(--font-dm-sans)]">
        <span className="flex items-center gap-1.5 text-[#777]">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {job.location}
        </span>
        <span className="font-semibold" style={{ color }}>
          {job.salary}
        </span>
      </div>

      {/* Description */}
      <p className="text-[#555] text-sm leading-relaxed font-[family-name:var(--font-dm-sans)]">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-1 rounded-full border font-[family-name:var(--font-dm-sans)]"
            style={{ color, borderColor: `${color}40` }}
          >
            {tag}
          </span>
        ))}
      </div>

    </div>
  );
}
