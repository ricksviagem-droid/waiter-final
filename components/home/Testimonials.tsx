import { useTranslations } from 'next-intl';

const videos = [
  {
    id: 'ir7gkXlVIQw',
    label: 'Consultoria real #1',
    title: 'Garçom com experiência no Brasil',
  },
  {
    id: 'Y7SL63fiDU0',
    label: 'Consultoria real #2',
    title: 'Primeiro passo para o exterior',
  },
  {
    id: '6EAJYsQoCZs',
    label: 'Consultoria real #3 · The Work',
    title: 'Com nosso parceiro recrutador',
  },
];

export default function Testimonials() {
  const t = useTranslations('testimonials');

  return (
    <section className="bg-white py-20 px-5">
      <div className="max-w-5xl mx-auto">

        <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase text-center mb-4 font-[family-name:var(--font-dm-sans)]">
          Consultorias reais
        </p>
        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-[#1a1a1a] text-center mb-3">
          {t('title')}
        </h2>
        <p className="text-[#777] text-sm text-center mb-12 font-[family-name:var(--font-dm-sans)]">
          Sessões gravadas com permissão. Sem script, sem ator.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map(({ id, label, title }) => (
            <div key={id} className="flex flex-col gap-3">
              <div className="relative w-full aspect-video rounded-[12px] overflow-hidden shadow-[0_4px_24px_rgba(26,74,107,0.13)]">
                <iframe
                  src={`https://www.youtube.com/embed/${id}`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div>
                <p className="text-[#C9963A] text-[10px] font-semibold tracking-wider uppercase font-[family-name:var(--font-dm-sans)]">
                  {label}
                </p>
                <p className="text-[#1a1a1a] text-sm font-medium font-[family-name:var(--font-dm-sans)] leading-snug">
                  {title}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
