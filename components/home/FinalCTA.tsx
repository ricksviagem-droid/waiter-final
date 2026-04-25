import { Link } from '@/i18n/navigation';

const items = [
  'Diagnóstico gratuito do seu perfil real',
  'Road map personalizado por e-mail',
  'App com 9 módulos de treinamento com IA',
  'Shift Simulator gamificado — bônus exclusivo',
  'Comunidade World Link global — beta',
  'Vagas reais dos nossos parceiros internacionais',
];

export default function FinalCTA() {
  return (
    <section className="bg-[#1A4A6B] py-24 px-5 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#C9963A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">

        {/* Label */}
        <p className="text-[#C9963A] text-[11px] font-bold tracking-[0.2em] uppercase text-center mb-6 font-[family-name:var(--font-dm-sans)]">
          Você está a 3 minutos de receber
        </p>

        {/* Value list */}
        <div className="grid sm:grid-cols-2 gap-3 mb-12 max-w-xl mx-auto">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#C9963A]/20 border border-[#C9963A]/50 flex items-center justify-center shrink-0">
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#C9963A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-white/75 text-sm font-[family-name:var(--font-dm-sans)] leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* Big claim */}
        <div className="text-center mb-8">
          <h2 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-semibold text-white mb-2 leading-tight">
            Tudo isso.{' '}
            <em className="text-[#C9963A] italic">De graça.</em>
          </h2>
          <p className="text-white/45 text-sm font-[family-name:var(--font-dm-sans)]">
            Sem cartão de crédito. Sem compromisso. Começa agora.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#C9963A] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#b8872f] transition-colors font-[family-name:var(--font-dm-sans)] text-base"
          >
            Fazer assessment gratuito
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <a
            href="/simulator"
            className="text-white/55 text-sm font-[family-name:var(--font-dm-sans)] hover:text-white/80 transition-colors underline underline-offset-4"
          >
            ou explorar o app primeiro
          </a>
        </div>

      </div>
    </section>
  );
}
