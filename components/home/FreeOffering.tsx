import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const items = [
  {
    href: '/assessment' as const,
    icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>,
    key: 'item1',
  },
  {
    href: '/blog' as const,
    icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>,
    key: 'item4',
  },
  {
    href: '/exchange' as const,
    icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
    key: 'item5',
  },
  {
    href: null,
    icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>,
    key: 'item6',
  },
];

// Phone mockup SVG art
function PhoneMockup() {
  return (
    <svg viewBox="0 0 120 200" className="w-28 h-auto" fill="none">
      {/* Phone body */}
      <rect x="8" y="4" width="104" height="192" rx="16" fill="#0f2942" />
      <rect x="12" y="8" width="96" height="184" rx="13" fill="#1A4A6B" />
      {/* Screen */}
      <rect x="16" y="18" width="88" height="158" rx="8" fill="#0d1f33" />
      {/* Notch */}
      <rect x="40" y="8" width="40" height="8" rx="4" fill="#0f2942" />
      {/* Screen content — header bar */}
      <rect x="20" y="22" width="80" height="14" rx="4" fill="#1A4A6B" />
      <rect x="24" y="26" width="30" height="6" rx="2" fill="#C9963A" opacity="0.9" />
      {/* Chat bubbles */}
      <rect x="20" y="42" width="56" height="10" rx="5" fill="#1e3a52" />
      <rect x="44" y="56" width="52" height="10" rx="5" fill="#C9963A" opacity="0.85" />
      <rect x="20" y="70" width="48" height="10" rx="5" fill="#1e3a52" />
      <rect x="50" y="84" width="46" height="10" rx="5" fill="#C9963A" opacity="0.85" />
      {/* Score bar */}
      <rect x="20" y="102" width="76" height="18" rx="6" fill="#132d42" />
      <rect x="24" y="106" width="50" height="10" rx="4" fill="#2d6a4f" opacity="0.9" />
      <text x="56" y="115" fontSize="6" fill="white" fontFamily="sans-serif" fontWeight="bold">85%</text>
      {/* Module icons row */}
      {[0,1,2,3].map(i => (
        <rect key={i} x={20 + i * 20} y="128" width="16" height="16" rx="4" fill="#1e3a52" />
      ))}
      <rect x="20" y="128" width="16" height="16" rx="4" fill="#C9963A" opacity="0.7" />
      {/* Bottom bar */}
      <rect x="20" y="152" width="76" height="18" rx="6" fill="#C9963A" opacity="0.9" />
      <text x="34" y="164" fontSize="7" fill="white" fontFamily="sans-serif" fontWeight="bold">Treinar agora →</text>
      {/* Home indicator */}
      <rect x="44" y="178" width="32" height="4" rx="2" fill="#ffffff" opacity="0.3" />
    </svg>
  );
}

export default function FreeOffering() {
  const t = useTranslations('freeOffering');

  return (
    <section className="bg-[#1A4A6B] py-20 px-5">
      <div className="max-w-5xl mx-auto">

        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-white text-center mb-12">
          {t('title')}
        </h2>

        {/* App featured card — full width */}
        <a
          href="/simulator"
          className="group block bg-white/10 border border-white/20 rounded-[16px] p-6 md:p-8 mb-4 hover:bg-white/15 transition-colors"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Phone art */}
            <div className="shrink-0 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#C9963A]/20 blur-2xl rounded-full scale-150" />
                <PhoneMockup />
              </div>
            </div>
            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#C9963A]/20 border border-[#C9963A]/40 text-[#C9963A] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full font-[family-name:var(--font-dm-sans)] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9963A] animate-pulse" />
                App gratuito — criado pelo Ricardo
              </div>
              <h3 className="font-[family-name:var(--font-fraunces)] text-xl md:text-2xl font-semibold text-white mb-3">
                {t('app_title')}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed font-[family-name:var(--font-dm-sans)] mb-4 max-w-lg">
                {t('app_desc')}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-5">
                {['Entrevista com IA', 'Simulador de turno', 'Level scan', 'Daily drill', 'Currículo', 'Menu Master'].map((tag) => (
                  <span key={tag} className="text-[10px] text-white/60 border border-white/20 rounded-full px-3 py-1 font-[family-name:var(--font-dm-sans)]">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 text-[#C9963A] text-sm font-semibold font-[family-name:var(--font-dm-sans)] group-hover:gap-3 transition-all">
                Explorar o app completo
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
          </div>
        </a>

        {/* Shift Simulator — Bonus card */}
        <a
          href="/shift"
          className="group block bg-[#0d1f33] border border-[#C9963A]/30 rounded-[16px] p-6 mb-4 hover:border-[#C9963A]/60 transition-all relative overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9963A]/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Mini audio art */}
            <div className="shrink-0">
              <svg viewBox="0 0 140 100" className="w-40 h-auto" fill="none">
                <rect x="4" y="4" width="132" height="92" rx="12" fill="#132d42" />
                {/* Header */}
                <rect x="4" y="4" width="132" height="22" rx="12" fill="#1A4A6B" />
                <rect x="4" y="16" width="132" height="10" fill="#1A4A6B" />
                <circle cx="20" cy="15" r="7" fill="#C9963A" opacity="0.85" />
                <text x="32" y="19" fontSize="7" fill="white" fontFamily="sans-serif" fontWeight="700">SHIFT SIMULATOR</text>
                <circle cx="124" cy="15" r="4" fill="#ef4444" />
                {/* Guest audio label */}
                <text x="12" y="38" fontSize="6" fill="#C9963A" fontFamily="sans-serif" fontWeight="600">GUEST SPEAKING</text>
                {/* Audio wave */}
                {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map((i) => {
                  const hs = [5,9,14,7,18,12,16,9,20,11,16,7,18,13,9,14,7,11,5];
                  const h = hs[i] || 7;
                  return <rect key={i} x={12 + i * 6} y={48 - h/2} width="4" height={h} rx="2" fill="#C9963A" opacity={0.35 + (i%3)*0.2} />;
                })}
                {/* XP badge */}
                <rect x="12" y="62" width="52" height="22" rx="6" fill="#1e3a52" />
                <text x="18" y="72" fontSize="5" fill="#999" fontFamily="sans-serif">XP</text>
                <text x="18" y="80" fontSize="9" fill="#C9963A" fontFamily="sans-serif" fontWeight="800">+340</text>
                {/* Accuracy badge */}
                <rect x="76" y="62" width="52" height="22" rx="6" fill="#1e3a52" />
                <text x="82" y="72" fontSize="5" fill="#999" fontFamily="sans-serif">Precisão</text>
                <text x="82" y="80" fontSize="9" fill="#4ade80" fontFamily="sans-serif" fontWeight="800">92%</text>
                {/* Stars */}
                {[0,1,2,3,4].map(i => (
                  <text key={i} x={44 + i*10} y="96" fontSize="8" fill={i < 4 ? "#C9963A" : "#2a3a4a"} fontFamily="sans-serif">★</text>
                ))}
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                <span className="inline-flex items-center gap-1.5 bg-[#C9963A]/15 border border-[#C9963A]/40 text-[#C9963A] text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full font-[family-name:var(--font-dm-sans)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9963A] animate-pulse" />
                  Bônus Limitado
                </span>
                <span className="text-white/30 text-[9px] font-[family-name:var(--font-dm-sans)]">Fase de testes</span>
              </div>
              <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-white mb-2">
                Shift Simulator — Treino de turno real
              </h3>
              <p className="text-white/60 text-xs leading-relaxed font-[family-name:var(--font-dm-sans)] mb-3 max-w-md">
                Gamificado, com áudio real de hóspedes, avaliação por IA e pontuação por turno. Você treina conversações do dia a dia de hospitalidade — antes de encarar um turno de verdade.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[#C9963A] text-xs font-semibold font-[family-name:var(--font-dm-sans)] group-hover:gap-2.5 transition-all">
                Experimentar agora
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
          </div>
        </a>

        {/* World Link — Community Club Bonus */}
        <a
          href="https://worldlink-production.up.railway.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-gradient-to-br from-[#0d1f33] to-[#1a1035] border border-purple-500/30 rounded-[16px] p-6 mb-4 hover:border-purple-400/60 transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-48 h-48 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#C9963A]/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Community art */}
            <div className="shrink-0">
              <svg viewBox="0 0 140 100" className="w-40 h-auto" fill="none">
                <rect x="4" y="4" width="132" height="92" rx="12" fill="#0d0a1e" />
                {/* Globe ring */}
                <circle cx="70" cy="50" r="30" stroke="#7c3aed" strokeWidth="1" opacity="0.4" />
                <ellipse cx="70" cy="50" rx="18" ry="30" stroke="#7c3aed" strokeWidth="1" opacity="0.3" />
                <line x1="40" y1="50" x2="100" y2="50" stroke="#7c3aed" strokeWidth="1" opacity="0.3" />
                <line x1="44" y1="35" x2="96" y2="35" stroke="#7c3aed" strokeWidth="0.8" opacity="0.25" />
                <line x1="44" y1="65" x2="96" y2="65" stroke="#7c3aed" strokeWidth="0.8" opacity="0.25" />
                {/* Center glow */}
                <circle cx="70" cy="50" r="6" fill="#C9963A" opacity="0.9" />
                <circle cx="70" cy="50" r="10" fill="#C9963A" opacity="0.15" />
                {/* Node dots */}
                {[[50,32],[90,32],[40,50],[100,50],[50,68],[90,68]].map(([x,y],i) => (
                  <g key={i}>
                    <line x1={x} y1={y} x2="70" y2="50" stroke="#7c3aed" strokeWidth="0.8" opacity="0.35" />
                    <circle cx={x} cy={y} r="4" fill="#7c3aed" opacity="0.8" />
                    <circle cx={x} cy={y} r="7" fill="#7c3aed" opacity="0.15" />
                  </g>
                ))}
                {/* WORLD LINK label */}
                <text x="70" y="14" fontSize="7" fill="#a78bfa" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">WORLD LINK</text>
                {/* Members count */}
                <rect x="20" y="78" width="100" height="14" rx="5" fill="#1a1035" />
                <circle cx="32" cy="85" r="4" fill="#7c3aed" opacity="0.7" />
                <circle cx="40" cy="85" r="4" fill="#C9963A" opacity="0.7" />
                <circle cx="48" cy="85" r="4" fill="#4ade80" opacity="0.7" />
                <text x="58" y="89" fontSize="6" fill="#a78bfa" fontFamily="sans-serif">Comunidade global · Beta</text>
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                <span className="inline-flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/40 text-purple-300 text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full font-[family-name:var(--font-dm-sans)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  Bônus Exclusivo
                </span>
                <span className="text-white/30 text-[9px] font-[family-name:var(--font-dm-sans)]">Comunidade · Beta</span>
              </div>
              <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-white mb-2">
                World Link — O clube da carreira global
              </h3>
              <p className="text-white/60 text-xs leading-relaxed font-[family-name:var(--font-dm-sans)] mb-3 max-w-md">
                Comunidade exclusiva para profissionais de hospitalidade que querem trabalhar no exterior. Networking real, oportunidades compartilhadas, suporte mútuo. Em fase de testes — acesso gratuito agora.
              </p>
              <span className="inline-flex items-center gap-1.5 text-purple-300 text-xs font-semibold font-[family-name:var(--font-dm-sans)] group-hover:gap-2.5 transition-all">
                Entrar na comunidade
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
          </div>
        </a>

        {/* Other items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(({ href, icon, key }) => {
            const inner = (
              <>
                <div className="text-[#C9963A] shrink-0">{icon}</div>
                <p className="text-white text-sm leading-snug font-[family-name:var(--font-dm-sans)]">{t(key)}</p>
              </>
            );
            return href ? (
              <Link
                key={key}
                href={href}
                className="bg-white/10 border border-white/15 rounded-[12px] p-5 flex items-start gap-3 hover:bg-white/20 transition-colors"
              >
                {inner}
              </Link>
            ) : (
              <div key={key} className="bg-white/10 border border-white/15 rounded-[12px] p-5 flex items-start gap-3">
                {inner}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#C9963A] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b8872f] transition-colors font-[family-name:var(--font-dm-sans)]"
          >
            {t('badge')}
          </Link>
        </div>

      </div>
    </section>
  );
}
