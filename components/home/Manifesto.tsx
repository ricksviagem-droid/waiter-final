import { Link } from '@/i18n/navigation';

const pillars = [
  {
    icon: '🎯',
    title: 'Assessment + Road Map',
    desc: 'Diagnóstico gratuito do seu perfil real. Seu plano personalizado chega por e-mail em minutos.',
    color: '#1A4A6B',
  },
  {
    icon: '🤖',
    title: 'App com 9 módulos IA',
    desc: 'Entrevista, turno, nível de inglês, currículo internacional, POS, vocabulário — tudo simulado com IA.',
    color: '#C9963A',
  },
  {
    icon: '🎮',
    title: 'Shift Simulator',
    desc: 'Gamificado, com áudio real de hóspedes. XP, precisão, estrelas. O turno antes do turno.',
    color: '#2d6a4f',
  },
  {
    icon: '🌍',
    title: 'World Link',
    desc: 'Comunidade global de profissionais de hospitalidade. Networking real. Oportunidades compartilhadas.',
    color: '#7c3aed',
  },
  {
    icon: '💼',
    title: 'Vagas internacionais',
    desc: 'Oportunidades reais de cruzeiros, Dubai e Europa direto dos nossos parceiros recrutadores.',
    color: '#C9963A',
  },
  {
    icon: '🎓',
    title: 'Consultoria com Ricardo',
    desc: '15 anos em hospitalidade de luxo no exterior. Direto, honesto, sem enrolação.',
    color: '#1A4A6B',
  },
];

export default function Manifesto() {
  return (
    <section className="bg-[#07111a] py-24 px-5 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Glow top-left */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1A4A6B]/20 rounded-full blur-3xl pointer-events-none" />
      {/* Glow bottom-right */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#C9963A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">

        {/* Label */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#C9963A]/15 border border-[#C9963A]/30 text-[#C9963A] text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full font-[family-name:var(--font-dm-sans)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9963A]" />
            Por que Brazil Abroad
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl lg:text-5xl font-semibold text-white text-center leading-[1.1] mb-6 max-w-3xl mx-auto">
          A plataforma mais completa para brasileiros que querem trabalhar em{' '}
          <em className="text-[#C9963A] italic">hospitalidade no exterior.</em>
        </h2>

        {/* Subtext */}
        <p className="text-white/55 text-base md:text-lg text-center font-[family-name:var(--font-dm-sans)] leading-relaxed mb-16 max-w-2xl mx-auto">
          Não somos uma promessa. Somos um sistema completo — do diagnóstico ao emprego.
          Assessment real. Treinamento com IA. Comunidade global. Vagas dos melhores recrutadores.
          Consultoria de quem viveu 15 anos no exterior.
        </p>

        {/* Pillars grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {pillars.map(({ icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-white/[0.04] border border-white/[0.08] rounded-[16px] p-6 hover:bg-white/[0.07] hover:border-white/[0.15] transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
                >
                  {icon}
                </div>
                <h3 className="font-[family-name:var(--font-fraunces)] text-white font-semibold text-base leading-tight">
                  {title}
                </h3>
              </div>
              <p className="text-white/50 text-sm leading-relaxed font-[family-name:var(--font-dm-sans)]">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* The reveal */}
        <div className="border-t border-white/10 pt-14 text-center">
          <p className="text-white/40 text-sm font-[family-name:var(--font-dm-sans)] tracking-wider uppercase mb-4">
            Quanto custa tudo isso?
          </p>
          <p className="font-[family-name:var(--font-fraunces)] text-5xl md:text-7xl font-semibold text-[#C9963A] mb-4 leading-none">
            A maior parte: grátis.
          </p>
          <p className="text-white/40 text-sm font-[family-name:var(--font-dm-sans)] mb-10">
            Sem cartão de crédito. Sem compromisso. Aproveite enquanto está em desenvolvimento.
          </p>

          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#C9963A] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#b8872f] transition-colors font-[family-name:var(--font-dm-sans)] text-base"
          >
            Começar agora — é de graça
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
