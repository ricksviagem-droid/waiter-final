import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const modules = [
  {
    href: '/interview',
    emoji: '🎙️',
    title: 'Simulador de Entrevista',
    desc: 'IA faz as perguntas reais de uma entrevista de hospitalidade em inglês. Você responde em voz ou texto. Recebe feedback detalhado em cada resposta.',
    tag: 'Mais usado',
    tagColor: '#1A4A6B',
  },
  {
    href: '/shift',
    emoji: '🎧',
    title: 'Simulador de Turno',
    desc: 'Você ouve um hóspede falando — sotaque real, ritmo real. Precisa entender e responder como num turno de verdade. Treina escuta ativa em inglês.',
    tag: 'Nível avançado',
    tagColor: '#C9963A',
  },
  {
    href: '/level-scan',
    emoji: '📊',
    title: 'Level Scan — Diagnóstico de Inglês',
    desc: 'Avalia seu nível real de inglês profissional em hospitalidade. Em 10 minutos você sabe exatamente onde está e o que precisa melhorar.',
    tag: 'Comece aqui',
    tagColor: '#2d6a4f',
  },
  {
    href: '/daily-drill',
    emoji: '⚡',
    title: 'Daily Drill',
    desc: 'Treino diário de vocabulário e frases essenciais em hospitalidade. 5 minutos por dia. Gamificado com pontos de XP para manter a consistência.',
    tag: 'Diário',
    tagColor: '#7c3d8c',
  },
  {
    href: '/training',
    emoji: '💬',
    title: 'Simulador de Conversas',
    desc: 'Pratica diálogos reais de restaurante e hotel com IA: receber mesa, tomar pedido, lidar com reclamações, recomendar pratos. Sem julgamento, sem pressa.',
    tag: 'Fundamental',
    tagColor: '#1A4A6B',
  },
  {
    href: '/resume',
    emoji: '📄',
    title: 'Gerador de Currículo',
    desc: 'Cria ou melhora seu currículo no formato internacional correto. A IA adapta para o padrão que recrutadores de Dubai e de cruzeiros esperam ver.',
    tag: 'Essencial',
    tagColor: '#C9963A',
  },
  {
    href: '/menu-master',
    emoji: '🍷',
    title: 'Menu Master',
    desc: 'Você cola o cardápio do restaurante — a IA cria um quiz personalizado sobre pratos, ingredientes, alérgenos e harmonização. Memoriza o menu em horas.',
    tag: 'Criativo',
    tagColor: '#2d6a4f',
  },
  {
    href: '/pos',
    emoji: '🖥️',
    title: 'POS Simulator',
    desc: 'Simula um sistema de ponto de venda real. Treina a sequência de serviço, comanda, lançamento e fechamento de mesa — sem medo de errar no trabalho.',
    tag: 'Técnico',
    tagColor: '#7c3d8c',
  },
];

export default function SimulatorPage() {
  return (
    <>
      <Header />
      <main className="bg-[#FDFAF4] pt-16">

        {/* Hero */}
        <section className="bg-[#1A4A6B] py-20 px-5 text-center overflow-hidden relative">
          {/* Decorative blur */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#C9963A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto">
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 font-[family-name:var(--font-dm-sans)]">
              Brazil Abroad · App Gratuito
            </p>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight">
              O simulador que eu gostaria<br />
              de ter tido quando comecei.
            </h1>
            <p className="text-white/75 text-base leading-relaxed font-[family-name:var(--font-dm-sans)] mb-8 max-w-xl mx-auto">
              Construí esse aplicativo do zero — sozinho, linha por linha — com tudo que aprendi em 15 anos de hospitalidade em Dubai. Cada módulo nasceu de uma dificuldade real que eu ou alguém que conheço enfrentou.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#C9963A]/20 border border-[#C9963A]/40 text-[#C9963A] text-xs font-semibold px-4 py-2 rounded-full font-[family-name:var(--font-dm-sans)]">
              <span className="w-2 h-2 rounded-full bg-[#C9963A] animate-pulse" />
              100% gratuito enquanto está em desenvolvimento
            </div>
          </div>
        </section>

        {/* The story */}
        <section className="py-16 px-5 border-b border-[#e8e0d0]">
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 font-[family-name:var(--font-dm-sans)]">
                Por que criei isso
              </p>
              <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1a1a1a] mb-4">
                15 anos de expertise<br />num único lugar.
              </h2>
              <p className="text-[#555] text-sm leading-relaxed font-[family-name:var(--font-dm-sans)] mb-4">
                Quando cheguei em Dubai pela primeira vez, não existia nada assim. Aprendi no erro — entrevistas que não dei bem, turnos que foram tensos, cardápios que não dominava. Cada módulo desse app representa uma batalha real que eu travei.
              </p>
              <p className="text-[#555] text-sm leading-relaxed font-[family-name:var(--font-dm-sans)]">
                Hoje, com inteligência artificial, dá pra simular tudo isso com segurança — antes de chegar no emprego de verdade. Ninguém precisa mais improvisar no primeiro turno.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { n: '8', label: 'Módulos de treinamento' },
                { n: '15+', label: 'Anos de experiência embutidos' },
                { n: '100%', label: 'Gratuito agora' },
              ].map(({ n, label }) => (
                <div key={label} className="bg-white rounded-[12px] p-5 shadow-sm flex items-center gap-4">
                  <span className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold text-[#1A4A6B]">{n}</span>
                  <span className="text-[#555] text-sm font-[family-name:var(--font-dm-sans)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules */}
        <section className="py-20 px-5">
          <div className="max-w-5xl mx-auto">
            <p className="text-[#777] text-[11px] font-semibold tracking-[0.18em] uppercase text-center mb-4 font-[family-name:var(--font-dm-sans)]">
              O que tem dentro
            </p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl font-semibold text-[#1a1a1a] text-center mb-12">
              8 módulos. Uma carreira transformada.
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {modules.map(({ href, emoji, title, desc, tag, tagColor }) => (
                <a
                  key={href}
                  href={href}
                  className="group bg-white rounded-[14px] p-6 shadow-[0_2px_16px_rgba(26,74,107,0.07)] hover:shadow-[0_6px_32px_rgba(26,74,107,0.14)] transition-all flex gap-4 items-start"
                >
                  <span className="text-3xl shrink-0">{emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-[family-name:var(--font-fraunces)] text-base font-semibold text-[#1a1a1a] group-hover:text-[#1A4A6B] transition-colors">
                        {title}
                      </h3>
                      <span
                        className="shrink-0 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full text-white font-[family-name:var(--font-dm-sans)]"
                        style={{ backgroundColor: tagColor }}
                      >
                        {tag}
                      </span>
                    </div>
                    <p className="text-[#777] text-sm leading-relaxed font-[family-name:var(--font-dm-sans)]">
                      {desc}
                    </p>
                  </div>
                  <svg className="shrink-0 text-[#C9963A] group-hover:translate-x-1 transition-transform mt-1" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Free while in beta + feedback */}
        <section className="bg-[#1A4A6B] py-20 px-5">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-[#C9963A]/20 border border-[#C9963A]/40 text-[#C9963A] text-xs font-semibold px-4 py-2 rounded-full font-[family-name:var(--font-dm-sans)] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C9963A] animate-pulse" />
              Aproveite enquanto é gratuito
            </span>
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl font-semibold text-white mb-4">
              Fiz com muito carinho.<br />Quero saber o que você achou.
            </h2>
            <p className="text-white/70 text-base leading-relaxed font-[family-name:var(--font-dm-sans)] mb-8">
              O app está em crescimento constante — novos módulos, novos cenários, novas línguas. Cada feedback que recebo vira uma melhoria real. Me conta o que você achou, o que faltou, o que surpreendeu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/interview"
                className="bg-[#C9963A] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#b8872f] transition-colors font-[family-name:var(--font-dm-sans)] text-sm"
              >
                Começar agora — é grátis
              </a>
              <a
                href="https://wa.me/971508108328?text=Olá%20Ricardo%2C%20testei%20o%20simulador%20e%20quero%20deixar%20meu%20feedback."
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 text-white font-medium px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors font-[family-name:var(--font-dm-sans)] text-sm flex items-center justify-center gap-2"
              >
                Deixar meu feedback no WhatsApp
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
