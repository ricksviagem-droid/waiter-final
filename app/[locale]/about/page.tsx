import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const credentials = [
  { org: 'Atlantis The Royal', role_pt: 'Supervisor On Duty', role_en: 'Supervisor On Duty', location: 'Dubai, UAE' },
  { org: 'ÉS English School', role_pt: 'Consultor Oficial', role_en: 'Official Consultant', location: 'Dubai, UAE' },
  { org: 'The Work', role_pt: 'Agência Parceira', role_en: 'Partner Agency', location: 'International' },
];

const timeline = [
  { year: '2009', pt: 'Início na hospitalidade no Brasil', en: 'Started in hospitality in Brazil' },
  { year: '2015', pt: 'Primeira temporada internacional — Europa', en: 'First international season — Europe' },
  { year: '2018', pt: 'Chegada a Dubai — setor de luxo', en: 'Arrived in Dubai — luxury sector' },
  { year: '2021', pt: 'Supervisor no Atlantis The Royal', en: 'Supervisor at Atlantis The Royal' },
  { year: '2025', pt: 'Fundação da Brazil Abroad', en: 'Founded Brazil Abroad' },
];

const venues = ['Atlantis The Royal', 'Amazónico Dubai', 'Casa Blanca', 'Ling Ling', 'MSC Cruises'];

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <>
      <Header />
      <main className="bg-[#FDFAF4] pt-16">

        {/* Hero */}
        <section className="bg-[#1A4A6B] py-20 px-5">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 font-[family-name:var(--font-dm-sans)]">
                {t('label')}
              </p>
              <h1 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-white mb-6 leading-tight">
                {t('title')}
              </h1>
              <p className="text-white/75 text-base leading-relaxed font-[family-name:var(--font-dm-sans)] mb-4">
                {t('p1')}
              </p>
              <p className="text-white/75 text-base leading-relaxed font-[family-name:var(--font-dm-sans)]">
                {t('p2')}
              </p>
            </div>

            {/* Photo */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[#C9963A] shadow-2xl">
                <Image
                  src="/scenes/rick.jpeg"
                  alt="Ricardo Rogerio"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-5">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase mb-10 font-[family-name:var(--font-dm-sans)]">
              Trajetória
            </p>
            <div className="relative">
              <div className="absolute left-12 top-0 bottom-0 w-px bg-[#e8e0d0]" />
              <div className="flex flex-col gap-8">
                {timeline.map(({ year, pt }) => (
                  <div key={year} className="flex items-start gap-6">
                    <div className="w-24 shrink-0 text-right">
                      <span className="font-[family-name:var(--font-fraunces)] text-[#C9963A] font-semibold text-sm">{year}</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-[#1A4A6B] border-2 border-[#FDFAF4] shadow" />
                      <p className="text-[#1a1a1a] font-[family-name:var(--font-dm-sans)] text-sm leading-snug pl-2">{pt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="bg-[#F5EDD8] py-16 px-5">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#777] text-[11px] font-semibold tracking-[0.18em] uppercase text-center mb-10 font-[family-name:var(--font-dm-sans)]">
              Vínculos oficiais
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {credentials.map(({ org, role_pt, location }) => (
                <div key={org} className="bg-white rounded-[12px] p-5 text-center shadow-sm">
                  <p className="font-[family-name:var(--font-fraunces)] text-[#1a1a1a] font-semibold mb-1">{org}</p>
                  <p className="text-[#C9963A] text-[10px] font-semibold tracking-wider uppercase font-[family-name:var(--font-dm-sans)]">{role_pt}</p>
                  <p className="text-[#777] text-xs mt-1 font-[family-name:var(--font-dm-sans)]">{location}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-[#777] text-[11px] font-semibold tracking-[0.18em] uppercase mb-5 font-[family-name:var(--font-dm-sans)]">
              Também presente em
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {venues.map((v) => (
                <span key={v} className="text-sm text-[#555] border border-[#d5c9b0] rounded-full px-4 py-1.5 font-[family-name:var(--font-dm-sans)]">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-6">
              Por que a Brazil Abroad existe.
            </h2>
            <p className="text-[#555] text-base leading-relaxed font-[family-name:var(--font-dm-sans)] mb-4">
              Vi centenas de brasileiros talentosos ficarem presos por falta de informação — currículos errados, inglês insuficiente, sem contatos no lugar certo.
            </p>
            <p className="text-[#555] text-base leading-relaxed font-[family-name:var(--font-dm-sans)] mb-10">
              A Brazil Abroad existe para encurtar esse caminho. Tudo que levei anos para aprender, você acessa hoje.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/assessment"
                className="bg-[#1A4A6B] text-white font-medium text-sm px-7 py-3.5 rounded-full text-center hover:bg-[#153d5a] transition-colors font-[family-name:var(--font-dm-sans)]"
              >
                Fazer assessment gratuito
              </Link>
              <a
                href="https://wa.me/971508108328?text=Olá%20Ricardo%2C%20li%20sua%20história%20e%20quero%20saber%20mais."
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#1a1a1a] text-[#1a1a1a] font-medium text-sm px-7 py-3.5 rounded-full text-center hover:bg-[#1a1a1a] hover:text-white transition-colors font-[family-name:var(--font-dm-sans)]"
              >
                Falar com Ricardo
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
