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
          <a
            href="https://wa.me/5511962794747?text=Ol%C3%A1%20Ricardo!%20Vi%20o%20Brazil%20Abroad%20e%20quero%20saber%20como%20trabalhar%20no%20exterior%20em%20hospitalidade."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#1ebe5d] transition-colors font-[family-name:var(--font-dm-sans)] text-base"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Falar com Ricardo no WhatsApp
          </a>
          <Link
            href="/about"
            className="text-white/55 text-sm font-[family-name:var(--font-dm-sans)] hover:text-white/80 transition-colors underline underline-offset-4"
          >
            ou conhecer minha história
          </Link>
        </div>

      </div>
    </section>
  );
}
