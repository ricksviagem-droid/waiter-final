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

function WorldLinkPhoneMockup() {
  return (
    <svg viewBox="0 0 150 300" className="w-36 h-auto drop-shadow-2xl" fill="none">
      {/* Metal frame */}
      <rect x="1" y="1" width="148" height="298" rx="34" fill="#141418" />
      <rect x="2" y="2" width="146" height="296" rx="33" stroke="#3d3d44" strokeWidth="1" fill="none" />
      <rect x="7" y="7" width="136" height="286" rx="28" fill="#0a1e24" />
      {/* Buttons */}
      <rect x="0" y="90" width="2.5" height="20" rx="1.25" fill="#2c2c30" />
      <rect x="0" y="118" width="2.5" height="32" rx="1.25" fill="#2c2c30" />
      <rect x="147.5" y="112" width="2.5" height="42" rx="1.25" fill="#2c2c30" />
      {/* Dynamic Island */}
      <rect x="46" y="17" width="58" height="16" rx="8" fill="#0a1e24" />
      <circle cx="93" cy="25" r="3.5" fill="#141418" />

      {/* Game header */}
      <rect x="7" y="40" width="136" height="16" fill="#0d2030" />
      <circle cx="17" cy="48" r="6" fill="#7c3aed" opacity="0.9" />
      <text x="27" y="52" fontSize="5.5" fill="#a78bfa" fontFamily="sans-serif" fontWeight="800" letterSpacing="0.4">WORLD LINK</text>
      <circle cx="136" cy="48" r="4" fill="#ef4444" />
      <text x="122" y="45" fontSize="3.5" fill="#ef4444" fontFamily="sans-serif">LIVE</text>

      {/* Camera controls */}
      <rect x="7" y="56" width="136" height="11" fill="#080f18" />
      <rect x="9" y="57.5" width="18" height="8" rx="4" fill="#C9963A" />
      <text x="18" y="64" fontSize="4" fill="white" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">ISO</text>
      <text x="35" y="64" fontSize="4" fill="#555" fontFamily="sans-serif" textAnchor="middle">TOP</text>
      <text x="51" y="64" fontSize="4" fill="#555" fontFamily="sans-serif" textAnchor="middle">CLOSE</text>
      <text x="67" y="64" fontSize="4" fill="#555" fontFamily="sans-serif" textAnchor="middle">WIDE</text>
      <text x="82" y="64" fontSize="4" fill="#555" fontFamily="sans-serif" textAnchor="middle">POV</text>

      {/* ── GAME SCENE ── */}
      {/* Sandy floor */}
      <rect x="7" y="67" width="136" height="165" fill="#cbb98d" />
      {/* Teal back wall */}
      <rect x="7" y="67" width="136" height="26" fill="#2a7472" />
      <polygon points="7,67 62,84 62,93 7,93" fill="#1c5250" />
      <polygon points="143,67 88,84 88,93 143,93" fill="#1c5250" />
      {/* Floor grid lines */}
      <line x1="7" y1="118" x2="143" y2="118" stroke="#b8a06a" strokeWidth="0.4" opacity="0.45" />
      <line x1="7" y1="143" x2="143" y2="143" stroke="#b8a06a" strokeWidth="0.4" opacity="0.45" />
      <line x1="7" y1="168" x2="143" y2="168" stroke="#b8a06a" strokeWidth="0.4" opacity="0.45" />
      <line x1="7" y1="193" x2="143" y2="193" stroke="#b8a06a" strokeWidth="0.4" opacity="0.45" />
      <line x1="40" y1="67" x2="40" y2="232" stroke="#b8a06a" strokeWidth="0.4" opacity="0.3" />
      <line x1="75" y1="67" x2="75" y2="232" stroke="#b8a06a" strokeWidth="0.4" opacity="0.3" />
      <line x1="110" y1="67" x2="110" y2="232" stroke="#b8a06a" strokeWidth="0.4" opacity="0.3" />
      {/* Large red rug / area marker */}
      <circle cx="28" cy="195" r="20" fill="#c0392b" opacity="0.6" />
      {/* Green trees */}
      <circle cx="120" cy="115" r="14" fill="#27774a" opacity="0.82" />
      <circle cx="127" cy="145" r="9" fill="#2ecc71" opacity="0.7" />
      <circle cx="108" cy="200" r="8" fill="#27774a" opacity="0.72" />
      {/* Table */}
      <ellipse cx="65" cy="132" rx="11" ry="6.5" fill="#8b6a18" opacity="0.65" />
      {/* Character — green shirt */}
      <ellipse cx="40" cy="153" rx="5" ry="2.5" fill="rgba(0,0,0,0.12)" />
      <circle cx="40" cy="145" r="4.5" fill="#d4a46c" />
      <rect x="37" y="149" width="6" height="7.5" rx="2" fill="#27ae60" />
      {/* Character — red shirt */}
      <ellipse cx="58" cy="127" rx="4" ry="2" fill="rgba(0,0,0,0.1)" />
      <circle cx="58" cy="120" r="4" fill="#d4a46c" />
      <rect x="55.5" y="124" width="5" height="6.5" rx="1.5" fill="#e74c3c" />
      {/* Character — dark suit */}
      <ellipse cx="108" cy="155" rx="4" ry="2" fill="rgba(0,0,0,0.1)" />
      <circle cx="108" cy="148" r="4" fill="#d4a46c" />
      <rect x="105.5" y="152" width="5" height="6.5" rx="1.5" fill="#2c3e50" />
      {/* Rick — player */}
      <ellipse cx="75" cy="215" rx="6" ry="3" fill="rgba(0,0,0,0.14)" />
      <circle cx="75" cy="204" r="5.5" fill="#d4a46c" />
      <rect x="71.5" y="209" width="7" height="8.5" rx="2" fill="#f0e8d0" />
      <rect x="61" y="193" width="28" height="9" rx="4.5" fill="rgba(0,0,0,0.76)" />
      <text x="75" y="200.5" fontSize="5" fill="white" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">Rick</text>
      {/* TURNO EM CURSO panel */}
      <rect x="67" y="74" width="70" height="46" rx="6" fill="rgba(8,24,36,0.91)" />
      <text x="102" y="83" fontSize="3.8" fill="rgba(255,255,255,0.55)" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.6">TURNO EM CURSO</text>
      <text x="102" y="97" fontSize="14" fill="#C9963A" fontFamily="sans-serif" fontWeight="800" textAnchor="middle">2:52</text>
      <rect x="71" y="102" width="62" height="11" rx="5.5" fill="#C9963A" opacity="0.9" />
      <text x="102" y="110.5" fontSize="4.5" fill="white" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">Encerrar Turno</text>
      {/* Minimap */}
      <rect x="9" y="220" width="36" height="28" rx="4" fill="rgba(8,20,30,0.82)" />
      <rect x="11" y="222" width="32" height="24" rx="3" fill="#0f2b38" />
      <rect x="20" y="225" width="13" height="9" fill="#2a7472" opacity="0.65" />
      <circle cx="24" cy="238" r="2.5" fill="#C9963A" />

      {/* Bottom bar */}
      <rect x="7" y="232" width="136" height="18" fill="#060e18" />
      <circle cx="20" cy="241" r="3.5" fill="#7c3aed" opacity="0.9" />
      <circle cx="29" cy="241" r="3.5" fill="#C9963A" opacity="0.9" />
      <circle cx="38" cy="241" r="3.5" fill="#4ade80" opacity="0.9" />
      <text x="48" y="244.5" fontSize="4" fill="#a78bfa" fontFamily="sans-serif">+128 online</text>
      <rect x="95" y="234.5" width="40" height="11" rx="5.5" fill="#7c3aed" opacity="0.9" />
      <text x="115" y="242.5" fontSize="4.5" fill="white" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">Jogar</text>

      {/* Nav */}
      <rect x="7" y="250" width="136" height="18" fill="#040b14" />
      <circle cx="34" cy="259" r="4" fill="#7c3aed" opacity="0.85" />
      <circle cx="75" cy="259" r="4" fill="rgba(255,255,255,0.15)" />
      <circle cx="116" cy="259" r="4" fill="rgba(255,255,255,0.15)" />
      {/* Home indicator */}
      <rect x="52" y="271" width="46" height="3" rx="1.5" fill="white" opacity="0.18" />
    </svg>
  );
}

function PhoneMockup() {
  const rows = [
    { label: 'Entrevista com IA', color: '#C9963A', pct: 76 },
    { label: 'Shift Simulator',   color: '#4ade80', pct: 52 },
    { label: 'Daily Drill',       color: '#60a5fa', pct: 88 },
    { label: 'Level Scan',        color: '#f472b6', pct: 41 },
  ];
  return (
    <svg viewBox="0 0 150 300" className="w-36 h-auto drop-shadow-2xl" fill="none">
      {/* Metal body */}
      <rect x="1" y="1" width="148" height="298" rx="34" fill="#141418" />
      <rect x="2" y="2" width="146" height="296" rx="33" stroke="#3d3d44" strokeWidth="1" fill="none" />
      {/* Screen glass */}
      <rect x="7" y="7" width="136" height="286" rx="28" fill="#0b1a2d" />

      {/* Side buttons */}
      <rect x="0" y="90"  width="2.5" height="20" rx="1.25" fill="#2c2c30" />
      <rect x="0" y="118" width="2.5" height="32" rx="1.25" fill="#2c2c30" />
      <rect x="0" y="158" width="2.5" height="32" rx="1.25" fill="#2c2c30" />
      <rect x="147.5" y="112" width="2.5" height="42" rx="1.25" fill="#2c2c30" />

      {/* Dynamic Island */}
      <rect x="46" y="17" width="58" height="16" rx="8" fill="#0b1a2d" />
      <circle cx="93" cy="25" r="3.5" fill="#141418" />

      {/* App header */}
      <rect x="7" y="40" width="136" height="30" fill="#1A4A6B" />
      <circle cx="21" cy="55" r="8" fill="#C9963A" opacity="0.95" />
      <text x="33" y="52" fontSize="5.5" fill="#C9963A" fontFamily="sans-serif" fontWeight="800" letterSpacing="0.4">BRAZIL ABROAD · APP</text>
      <text x="33" y="64" fontSize="4.5" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">Seu app de carreira · grátis</text>

      {/* Banner strip */}
      <rect x="7" y="70" width="136" height="14" fill="#132d42" />
      <text x="14" y="80" fontSize="4.5" fill="#C9963A" fontFamily="sans-serif">Progresso desta semana</text>

      {/* Module rows */}
      {rows.map(({ label, color, pct }, i) => (
        <g key={label}>
          <rect x="7" y={88 + i * 38} width="136" height="30" fill="#0f2336" />
          <rect x="7" y={88 + i * 38} width="3" height="30" fill={color} />
          <text x="16" y={100 + i * 38} fontSize="5.5" fill={color} fontFamily="sans-serif" fontWeight="700">{label}</text>
          <rect x="16" y={105 + i * 38} width="100" height="4" rx="2" fill="rgba(255,255,255,0.07)" />
          <rect x="16" y={105 + i * 38} width={pct} height="4" rx="2" fill={color} opacity="0.65" />
          <text x="120" y={111 + i * 38} fontSize="4.5" fill={color} fontFamily="sans-serif" fontWeight="600">{pct}%</text>
        </g>
      ))}

      {/* CTA button */}
      <rect x="15" y="244" width="120" height="22" rx="11" fill="#C9963A" />
      <text x="75" y="259" fontSize="6" fill="white" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">Treinar agora →</text>

      {/* Bottom nav */}
      <rect x="7" y="270" width="136" height="18" fill="#09182a" />
      <circle cx="34" cy="279" r="4"  fill="#C9963A" opacity="0.9" />
      <circle cx="75" cy="279" r="4"  fill="rgba(255,255,255,0.2)" />
      <circle cx="116" cy="279" r="4" fill="rgba(255,255,255,0.2)" />

      {/* Home indicator */}
      <rect x="52" y="291" width="46" height="3" rx="1.5" fill="white" opacity="0.2" />
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
            {/* Game phone mockup */}
            <div className="shrink-0 flex justify-center relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full scale-150 pointer-events-none" />
              <WorldLinkPhoneMockup />
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
