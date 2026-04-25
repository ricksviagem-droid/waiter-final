const items = [
  'Dubai',
  'Atlantis The Royal',
  '15 Anos de Expertise',
  'Cruzeiros de Luxo',
  '20+ Países',
  'App com IA',
  'World Link',
  'Shift Simulator',
  'MSC Cruises',
  'Hospitalidade de Luxo',
  'Road Map para o Mundo',
  'Amazónico Dubai',
];

export default function Ticker() {
  return (
    <div className="bg-[#07111a] py-3 overflow-hidden border-y border-[#C9963A]/15">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'ticker 40s linear infinite' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-white/40 text-[10px] font-semibold tracking-[0.18em] uppercase font-[family-name:var(--font-dm-sans)] px-5">
              {item}
            </span>
            <span className="text-[#C9963A]/60 text-[8px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
