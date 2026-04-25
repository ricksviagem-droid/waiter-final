import { useTranslations } from 'next-intl';

// Official partners — with role description
const officialPartners = [
  {
    name: 'ÉS English School',
    role_pt: 'Consultor Oficial',
    role_en: 'Official Consultant',
    location: 'Dubai, UAE',
    logo: (
      <svg viewBox="0 0 120 40" className="w-24 h-8" fill="none">
        <text x="4" y="28" fontFamily="serif" fontSize="22" fontWeight="700" fill="#1A4A6B">ÉS</text>
        <text x="34" y="28" fontFamily="sans-serif" fontSize="11" fill="#444">English</text>
        <text x="34" y="39" fontFamily="sans-serif" fontSize="9" fill="#777">School Dubai</text>
      </svg>
    ),
  },
  {
    name: 'The Work',
    role_pt: 'Agência de Recrutamento',
    role_en: 'Recruitment Agency',
    location: 'International',
    logo: (
      <svg viewBox="0 0 140 40" className="w-28 h-8" fill="none">
        <text x="4" y="28" fontFamily="sans-serif" fontSize="15" fontWeight="700" fill="#1a1a1a">THE</text>
        <text x="44" y="28" fontFamily="sans-serif" fontSize="15" fontWeight="700" fill="#C9963A">WORK</text>
      </svg>
    ),
  },
  {
    name: 'Atlantis The Royal',
    role_pt: 'Supervisor On Duty',
    role_en: 'Supervisor On Duty',
    location: 'Dubai, UAE',
    logo: (
      <svg viewBox="0 0 160 40" className="w-32 h-8" fill="none">
        <text x="4" y="20" fontFamily="serif" fontSize="11" fontWeight="600" fill="#1A4A6B">ATLANTIS</text>
        <text x="4" y="35" fontFamily="serif" fontSize="9" fill="#C9963A" letterSpacing="2">THE ROYAL</text>
      </svg>
    ),
  },
];

// Display-only logos (places worked)
const venueLogos = [
  {
    name: 'Amazónico',
    sub: 'Dubai',
    logo: (
      <svg viewBox="0 0 120 36" className="w-24 h-7" fill="none">
        <text x="4" y="24" fontFamily="serif" fontSize="13" fontWeight="600" fill="#2d6a4f" fontStyle="italic">Amazónico</text>
      </svg>
    ),
  },
  {
    name: 'Casa Blanca',
    sub: 'Dubai',
    logo: (
      <svg viewBox="0 0 130 36" className="w-28 h-7" fill="none">
        <text x="4" y="24" fontFamily="serif" fontSize="12" fontWeight="600" fill="#1a1a1a" letterSpacing="1">CASA BLANCA</text>
      </svg>
    ),
  },
  {
    name: 'Ling Ling',
    sub: 'Dubai',
    logo: (
      <svg viewBox="0 0 110 36" className="w-24 h-7" fill="none">
        <text x="4" y="24" fontFamily="serif" fontSize="13" fontWeight="600" fill="#7c3d8c" letterSpacing="1">Ling Ling</text>
      </svg>
    ),
  },
  {
    name: 'MSC Cruises',
    sub: 'International',
    logo: (
      <svg viewBox="0 0 120 36" className="w-24 h-7" fill="none">
        <text x="4" y="22" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="#003087">MSC</text>
        <text x="52" y="22" fontFamily="sans-serif" fontSize="10" fill="#777">CRUISES</text>
      </svg>
    ),
  },
];

export default function Partners() {
  const t = useTranslations('partners');

  return (
    <section className="bg-[#F5EDD8] py-16 px-5">
      <div className="max-w-5xl mx-auto">

        {/* Official partners */}
        <p className="text-[#777777] text-[11px] font-semibold tracking-[0.18em] uppercase text-center mb-8 font-[family-name:var(--font-dm-sans)]">
          {t('title')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {officialPartners.map(({ name, role_pt, location, logo }) => (
            <div
              key={name}
              className="bg-white rounded-[12px] p-5 flex flex-col items-center gap-3 text-center shadow-[0_2px_12px_rgba(26,74,107,0.07)]"
            >
              <div className="h-10 flex items-center justify-center">
                {logo}
              </div>
              <div>
                <p className="text-[#C9963A] text-[10px] font-semibold tracking-wider uppercase font-[family-name:var(--font-dm-sans)]">
                  {role_pt}
                </p>
                <p className="text-[#777] text-xs mt-0.5 font-[family-name:var(--font-dm-sans)]">
                  {location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider + venue logos */}
        <div className="text-center mb-6">
          <p className="text-[#999] text-[11px] font-semibold tracking-[0.18em] uppercase font-[family-name:var(--font-dm-sans)]">
            Também presente em
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 items-center">
          {venueLogos.map(({ name, logo }) => (
            <div key={name} className="opacity-60 hover:opacity-100 transition-opacity">
              {logo}
            </div>
          ))}
        </div>

        <p className="text-center text-[#777777] text-sm mt-10 font-[family-name:var(--font-dm-sans)]">
          {t('subtitle')}
        </p>

      </div>
    </section>
  );
}
