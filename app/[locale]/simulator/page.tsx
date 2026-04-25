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
                  className="group bg-white rounded-[14px] p-6 border border-[#e8e0d0] shadow-[0_4px_0_rgba(0,0,0,0.08),0_1px_8px_rgba(26,74,107,0.05)] hover:shadow-[0_1px_0_rgba(0,0,0,0.06),0_1px_4px_rgba(26,74,107,0.05)] hover:translate-y-[3px] transition-all duration-150 flex gap-4 items-start"
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

        {/* SHIFT SIMULATOR — Bonus limitado */}
        <section className="py-20 px-5 bg-[#0d1f33]">
          <div className="max-w-5xl mx-auto">

            {/* Badge */}
            <div className="flex justify-center mb-10">
              <span className="inline-flex items-center gap-2 bg-[#C9963A]/15 border border-[#C9963A]/50 text-[#C9963A] text-xs font-bold tracking-[0.15em] uppercase px-5 py-2 rounded-full font-[family-name:var(--font-dm-sans)]">
                <span className="w-2 h-2 rounded-full bg-[#C9963A] animate-pulse" />
                Bônus Limitado · Fase de Testes
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* Art side */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Outer glow */}
                  <div className="absolute inset-0 bg-[#C9963A]/15 blur-3xl rounded-full scale-150 pointer-events-none" />
                  <div className="absolute inset-0 bg-[#1A4A6B]/30 blur-2xl rounded-full scale-125 pointer-events-none" />

                  {/* Shift Simulator Art */}
                  <svg viewBox="0 0 260 220" className="w-72 h-auto relative z-10" fill="none">
                    {/* Background panel */}
                    <rect x="20" y="20" width="220" height="180" rx="20" fill="#132d42" stroke="#1A4A6B" strokeWidth="1.5" />

                    {/* Header bar */}
                    <rect x="20" y="20" width="220" height="36" rx="20" fill="#1A4A6B" />
                    <rect x="20" y="38" width="220" height="18" fill="#1A4A6B" />
                    <circle cx="42" cy="38" r="10" fill="#C9963A" opacity="0.9" />
                    <text x="57" y="43" fontSize="9" fill="white" fontFamily="sans-serif" fontWeight="700">SHIFT SIMULATOR</text>
                    {/* Live dot */}
                    <circle cx="218" cy="38" r="5" fill="#ef4444" />
                    <text x="205" y="35" fontSize="6" fill="#ef4444" fontFamily="sans-serif">LIVE</text>

                    {/* Guest audio wave */}
                    <rect x="30" y="68" width="200" height="40" rx="10" fill="#1e3a52" />
                    <text x="38" y="80" fontSize="7" fill="#C9963A" fontFamily="sans-serif" fontWeight="600">GUEST SPEAKING</text>
                    {/* Wave bars */}
                    {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map((i) => {
                      const heights = [6,10,16,8,20,14,18,10,22,12,18,8,20,14,10,16,8,12,6];
                      const h = heights[i] || 8;
                      return (
                        <rect
                          key={i}
                          x={38 + i * 10}
                          y={96 - h / 2}
                          width="5"
                          height={h}
                          rx="2.5"
                          fill="#C9963A"
                          opacity={0.4 + (i % 3) * 0.2}
                        />
                      );
                    })}

                    {/* You respond area */}
                    <rect x="30" y="118" width="200" height="32" rx="10" fill="#1e3a52" />
                    <text x="38" y="130" fontSize="7" fill="#4ade80" fontFamily="sans-serif" fontWeight="600">YOUR RESPONSE</text>
                    <rect x="38" y="134" width="100" height="8" rx="4" fill="#4ade80" opacity="0.5" />
                    <rect x="144" y="134" width="6" height="8" rx="1" fill="#4ade80" opacity="0.9" />

                    {/* Score / XP row */}
                    <rect x="30" y="160" width="94" height="30" rx="8" fill="#1e3a52" />
                    <text x="38" y="172" fontSize="7" fill="#777" fontFamily="sans-serif">Pontuação</text>
                    <text x="38" y="183" fontSize="12" fill="#C9963A" fontFamily="sans-serif" fontWeight="800">+340 XP</text>

                    <rect x="136" y="160" width="94" height="30" rx="8" fill="#1e3a52" />
                    <text x="144" y="172" fontSize="7" fill="#777" fontFamily="sans-serif">Precisão</text>
                    <text x="144" y="183" fontSize="12" fill="#4ade80" fontFamily="sans-serif" fontWeight="800">92%</text>

                    {/* Stars */}
                    {[0,1,2,3,4].map(i => (
                      <text key={i} x={77 + i * 14} y="208" fontSize="11" fill={i < 4 ? "#C9963A" : "#333"} fontFamily="sans-serif">★</text>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Text side */}
              <div>
                <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl font-semibold text-white mb-4 leading-tight">
                  O simulador que coloca você<br />
                  <em className="text-[#C9963A] italic">dentro de um turno real.</em>
                </h2>
                <p className="text-white/70 text-sm leading-relaxed font-[family-name:var(--font-dm-sans)] mb-5">
                  Você ouve um hóspede falando em inglês — sotaque real, ritmo real, pedido real. Tem que responder como um profissional faria no trabalho. Sem pausa, sem dicionário.
                </p>

                <div className="flex flex-col gap-3 mb-7">
                  {[
                    { icon: '🎮', title: '100% gamificado', desc: 'XP, precisão, estrelas — cada turno vira um desafio com pontuação real.' },
                    { icon: '🎧', title: 'Áudio autêntico', desc: 'Sotaques variados, pedidos complexos, situações do dia a dia de hotel e restaurante.' },
                    { icon: '🧠', title: 'IA avalia cada resposta', desc: 'Feedback imediato sobre vocabulário, fluência e adequação ao contexto.' },
                    { icon: '📈', title: 'Evolução visível', desc: 'Cada sessão mede seu progresso. Você vê a melhora acontecer.' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex gap-3 items-start">
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="text-white text-sm font-semibold font-[family-name:var(--font-dm-sans)]">{title}</p>
                        <p className="text-white/55 text-xs font-[family-name:var(--font-dm-sans)] leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#C9963A]/10 border border-[#C9963A]/30 rounded-[12px] p-4 mb-6">
                  <p className="text-[#C9963A] text-xs font-semibold font-[family-name:var(--font-dm-sans)]">
                    Bônus exclusivo da fase de testes
                  </p>
                  <p className="text-white/60 text-xs font-[family-name:var(--font-dm-sans)] mt-1">
                    Esse módulo é especial — foi construído com muito mais cuidado e detalhe que o usual. Está disponível gratuitamente agora porque queremos o seu feedback. Quando lançarmos a versão final, esse módulo será pago.
                  </p>
                </div>

                <a
                  href="/shift"
                  className="inline-flex items-center gap-2 bg-[#C9963A] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#b8872f] transition-colors font-[family-name:var(--font-dm-sans)] text-sm"
                >
                  Experimentar o Shift Simulator
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WORLD LINK — Community Club Bonus */}
        <section className="py-20 px-5 bg-gradient-to-br from-[#0d0a1e] to-[#0d1f33] relative overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C9963A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto relative">

            {/* Badge */}
            <div className="flex justify-center mb-10">
              <span className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/50 text-purple-300 text-xs font-bold tracking-[0.15em] uppercase px-5 py-2 rounded-full font-[family-name:var(--font-dm-sans)]">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Bônus Exclusivo · Comunidade · Beta
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* Art side */}
              <div className="flex justify-center order-2 md:order-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full scale-150 pointer-events-none" />
                  <div className="absolute inset-0 bg-[#C9963A]/10 blur-2xl rounded-full scale-125 pointer-events-none" />

                  <svg viewBox="0 0 260 240" className="w-72 h-auto relative z-10" fill="none">
                    {/* Background panel */}
                    <rect x="20" y="20" width="220" height="200" rx="20" fill="#0d0a1e" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.4" />

                    {/* Header bar */}
                    <rect x="20" y="20" width="220" height="36" rx="20" fill="#1a1035" />
                    <rect x="20" y="38" width="220" height="18" fill="#1a1035" />
                    <circle cx="42" cy="38" r="10" fill="#7c3aed" opacity="0.85" />
                    <text x="57" y="43" fontSize="9" fill="#a78bfa" fontFamily="sans-serif" fontWeight="700">WORLD LINK COMMUNITY</text>

                    {/* Globe */}
                    <circle cx="130" cy="115" r="42" stroke="#7c3aed" strokeWidth="1.2" opacity="0.5" />
                    <ellipse cx="130" cy="115" rx="25" ry="42" stroke="#7c3aed" strokeWidth="1" opacity="0.35" />
                    <line x1="88" y1="115" x2="172" y2="115" stroke="#7c3aed" strokeWidth="1" opacity="0.35" />
                    <line x1="93" y1="95" x2="167" y2="95" stroke="#7c3aed" strokeWidth="0.8" opacity="0.25" />
                    <line x1="93" y1="135" x2="167" y2="135" stroke="#7c3aed" strokeWidth="0.8" opacity="0.25" />

                    {/* Center gold dot */}
                    <circle cx="130" cy="115" r="8" fill="#C9963A" opacity="0.9" />
                    <circle cx="130" cy="115" r="14" fill="#C9963A" opacity="0.12" />

                    {/* Network nodes */}
                    {[[100,82],[160,82],[82,115],[178,115],[100,148],[160,148],[130,70],[130,160]].map(([x,y],i) => (
                      <g key={i}>
                        <line x1={x} y1={y} x2="130" y2="115" stroke="#7c3aed" strokeWidth="0.8" opacity="0.4" />
                        <circle cx={x} cy={y} r="5" fill="#7c3aed" opacity={0.7 + (i%3)*0.1} />
                        <circle cx={x} cy={y} r="9" fill="#7c3aed" opacity="0.12" />
                      </g>
                    ))}

                    {/* Members strip */}
                    <rect x="30" y="172" width="200" height="36" rx="10" fill="#1a1035" stroke="#7c3aed" strokeWidth="0.5" strokeOpacity="0.4" />
                    <text x="42" y="187" fontSize="7" fill="#a78bfa" fontFamily="sans-serif">Membros ativos</text>
                    <circle cx="42" cy="200" r="6" fill="#7c3aed" opacity="0.8" />
                    <circle cx="54" cy="200" r="6" fill="#C9963A" opacity="0.8" />
                    <circle cx="66" cy="200" r="6" fill="#4ade80" opacity="0.8" />
                    <circle cx="78" cy="200" r="6" fill="#f472b6" opacity="0.8" />
                    <circle cx="90" cy="200" r="6" fill="#60a5fa" opacity="0.8" />
                    <text x="104" y="204" fontSize="7" fill="#a78bfa" fontFamily="sans-serif" fontWeight="600">+128 profissionais · global</text>
                  </svg>
                </div>
              </div>

              {/* Text side */}
              <div className="order-1 md:order-2">
                <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl font-semibold text-white mb-4 leading-tight">
                  O clube dos profissionais<br />
                  <em className="text-purple-300 italic">que pensam global.</em>
                </h2>
                <p className="text-white/70 text-sm leading-relaxed font-[family-name:var(--font-dm-sans)] mb-5">
                  World Link é a comunidade exclusiva para quem quer ou já trabalha no exterior. Networking real, oportunidades compartilhadas, suporte de quem entende o caminho. Não é grupo de WhatsApp — é uma plataforma feita pra isso.
                </p>

                <div className="flex flex-col gap-3 mb-7">
                  {[
                    { icon: '🌍', title: 'Comunidade global', desc: 'Profissionais do Brasil e do mundo, todos buscando oportunidades no exterior.' },
                    { icon: '🎮', title: 'Gamificado para te engajar', desc: 'Conquistas, rankings e desafios que tornam o aprendizado e o networking mais dinâmicos.' },
                    { icon: '💬', title: 'Conversações reais do dia a dia', desc: 'Pratica situações reais de hospitalidade com outros profissionais — não com robôs.' },
                    { icon: '🔓', title: 'Acesso gratuito agora', desc: 'Estamos em fase de testes. Acesso 100% livre enquanto construímos a plataforma ideal.' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex gap-3 items-start">
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="text-white text-sm font-semibold font-[family-name:var(--font-dm-sans)]">{title}</p>
                        <p className="text-white/55 text-xs font-[family-name:var(--font-dm-sans)] leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-[12px] p-4 mb-6">
                  <p className="text-purple-300 text-xs font-semibold font-[family-name:var(--font-dm-sans)]">
                    Bônus exclusivo — fase beta
                  </p>
                  <p className="text-white/60 text-xs font-[family-name:var(--font-dm-sans)] mt-1">
                    O World Link é um projeto paralelo que criei porque acredito que comunidade é o que faz a diferença. Acesso gratuito agora — quando lançar oficialmente, haverá planos pagos.
                  </p>
                </div>

                <a
                  href="https://worldlink-production.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-purple-700 transition-colors font-[family-name:var(--font-dm-sans)] text-sm"
                >
                  Entrar no World Link
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
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
