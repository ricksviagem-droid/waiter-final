import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const included = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    title_pt: 'Sessão 1:1 com Ricardo',
    title_en: '1:1 session with Ricardo',
    desc_pt: '60 minutos de consultoria focada no seu perfil, objetivos e próximos passos.',
    desc_en: '60-minute consultation focused on your profile, goals and next steps.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      </svg>
    ),
    title_pt: 'Revisão de currículo',
    title_en: 'CV review',
    desc_pt: 'Feedback detalhado e ajustes no seu currículo para o mercado internacional.',
    desc_en: 'Detailed feedback and adjustments to your CV for the international market.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    title_pt: 'Simulação de entrevista',
    title_en: 'Interview simulation',
    desc_pt: 'Prática real de entrevista em inglês com feedback imediato e dicas específicas.',
    desc_en: 'Real interview practice in English with immediate feedback and specific tips.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
      </svg>
    ),
    title_pt: 'Road map personalizado',
    title_en: 'Personalized road map',
    desc_pt: 'Plano de ação claro com prazos e prioridades para o seu perfil específico.',
    desc_en: 'Clear action plan with timelines and priorities for your specific profile.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
    title_pt: 'Indicação de vagas',
    title_en: 'Job referrals',
    desc_pt: 'Acesso a vagas exclusivas via rede de parceiros do Ricardo em Dubai e no mundo.',
    desc_en: 'Access to exclusive openings via Ricardo\'s partner network in Dubai and beyond.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    title_pt: 'Suporte pós-sessão',
    title_en: 'Post-session support',
    desc_pt: 'Acompanhamento por WhatsApp por 7 dias após a sessão para dúvidas e ajustes.',
    desc_en: '7-day WhatsApp follow-up after the session for questions and adjustments.',
  },
];

const steps = [
  { n: '01', pt: 'Faça o assessment gratuito', en: 'Complete the free assessment' },
  { n: '02', pt: 'Ricardo analisa seu perfil', en: 'Ricardo reviews your profile' },
  { n: '03', pt: 'Agende sua sessão no WhatsApp', en: 'Book your session via WhatsApp' },
  { n: '04', pt: 'Sessão 1:1 — 60 minutos', en: '1:1 session — 60 minutes' },
];

export default function ConsultingPage() {
  const t = useTranslations('pages');

  return (
    <>
      <Header />
      <main className="bg-[#FDFAF4] pt-16">

        {/* Hero */}
        <section className="bg-[#1A4A6B] py-16 px-5 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 font-[family-name:var(--font-dm-sans)]">
              Consultoria Personalizada
            </p>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-white mb-4">
              {t('consulting_title')}
            </h1>
            <p className="text-white/70 text-base font-[family-name:var(--font-dm-sans)] mb-8">
              Uma sessão com Ricardo vale mais que meses de tentativa e erro.
            </p>
            <a
              href="https://wa.me/971508108328?text=Olá%20Ricardo%2C%20quero%20agendar%20uma%20consultoria."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C9963A] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#b8872f] transition-colors font-[family-name:var(--font-dm-sans)] text-sm"
            >
              Agendar consultoria
            </a>
          </div>
        </section>

        {/* What's included */}
        <section className="py-20 px-5">
          <div className="max-w-5xl mx-auto">
            <p className="text-[#777] text-[11px] font-semibold tracking-[0.18em] uppercase text-center mb-12 font-[family-name:var(--font-dm-sans)]">
              O que está incluído
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {included.map(({ icon, title_pt, desc_pt }) => (
                <div key={title_pt} className="bg-white rounded-[12px] p-6 shadow-[0_2px_16px_rgba(26,74,107,0.07)]">
                  <div className="text-[#1A4A6B] mb-4">{icon}</div>
                  <h3 className="font-[family-name:var(--font-fraunces)] text-base font-semibold text-[#1a1a1a] mb-2">
                    {title_pt}
                  </h3>
                  <p className="text-[#777] text-sm leading-relaxed font-[family-name:var(--font-dm-sans)]">
                    {desc_pt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-[#F5EDD8] py-16 px-5">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#777] text-[11px] font-semibold tracking-[0.18em] uppercase text-center mb-12 font-[family-name:var(--font-dm-sans)]">
              Como funciona
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {steps.map(({ n, pt }) => (
                <div key={n} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1A4A6B] flex items-center justify-center mx-auto mb-3">
                    <span className="font-[family-name:var(--font-fraunces)] text-white font-semibold text-sm">{n}</span>
                  </div>
                  <p className="text-[#1a1a1a] text-sm font-medium font-[family-name:var(--font-dm-sans)] leading-snug">{pt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-20 px-5 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-4">
              Pronto para dar o próximo passo?
            </h2>
            <p className="text-[#777] text-sm mb-8 font-[family-name:var(--font-dm-sans)]">
              Não precisa ter tudo pronto. Precisa dar o primeiro passo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/971508108328?text=Olá%20Ricardo%2C%20quero%20agendar%20uma%20consultoria."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A4A6B] text-white font-medium text-sm px-7 py-3.5 rounded-full text-center hover:bg-[#153d5a] transition-colors font-[family-name:var(--font-dm-sans)]"
              >
                Falar com Ricardo
              </a>
              <Link
                href="/assessment"
                className="border border-[#1a1a1a] text-[#1a1a1a] font-medium text-sm px-7 py-3.5 rounded-full text-center hover:bg-[#1a1a1a] hover:text-white transition-colors font-[family-name:var(--font-dm-sans)]"
              >
                Fazer assessment gratuito
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
