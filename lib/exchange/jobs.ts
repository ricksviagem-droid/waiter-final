export type JobCategory = 'cruise' | 'hotel' | 'restaurant' | 'bar';

export interface Job {
  id: string;
  title: string;
  titleEn: string;
  company: string;
  location: string;
  salary: string;
  category: JobCategory;
  tags: string[];
  tagsEn: string[];
  description: string;
  descriptionEn: string;
  link?: string;
  featured?: boolean;
}

// ─────────────────────────────────────────────
// Edite este arquivo para adicionar/remover vagas
// ─────────────────────────────────────────────
export const jobs: Job[] = [
  {
    id: '1',
    title: 'Garçom de Cruzeiro',
    titleEn: 'Cruise Ship Waiter',
    company: 'MSC Cruises',
    location: 'Internacional — Mediterrâneo',
    salary: '$2.800 – $3.500/mês',
    category: 'cruise',
    tags: ['Cruzeiro', 'Inglês intermediário', 'Experiência em restaurante'],
    tagsEn: ['Cruise', 'Intermediate English', 'Restaurant experience'],
    description: 'Atendimento em restaurante principal a bordo. Turno dividido, acomodação e alimentação incluídas. Contrato de 6 a 9 meses com retorno garantido.',
    descriptionEn: 'Main restaurant service on board. Split shift, accommodation and meals included. 6–9 month contract with guaranteed return.',
    featured: true,
  },
  {
    id: '2',
    title: 'Barman / Bartender',
    titleEn: 'Bartender',
    company: 'Atlantis The Royal',
    location: 'Dubai, UAE',
    salary: '$4.500 – $5.500/mês',
    category: 'bar',
    tags: ['Hotel 5★', 'Inglês avançado', 'Experiência em bar de luxo'],
    tagsEn: ['5★ Hotel', 'Advanced English', 'Luxury bar experience'],
    description: 'Bartender no rooftop bar do Atlantis The Royal. Ambiente de ultra-luxo, gorjetas altas, visto de trabalho patrocinado pela empresa.',
    descriptionEn: 'Bartender at Atlantis The Royal rooftop bar. Ultra-luxury environment, high tips, work visa sponsored by the company.',
    featured: true,
  },
  {
    id: '3',
    title: 'Hostess / Recepcionista',
    titleEn: 'Hostess / Receptionist',
    company: 'Amazónico Dubai',
    location: 'Dubai, UAE',
    salary: '$3.200 – $4.000/mês',
    category: 'restaurant',
    tags: ['Restaurante', 'Inglês avançado', 'Boa apresentação'],
    tagsEn: ['Restaurant', 'Advanced English', 'Good presentation'],
    description: 'Recepção de clientes em restaurante conceito latino no coração de Dubai. Ambiente cosmopolita, equipe internacional.',
    descriptionEn: 'Guest reception at a Latin concept restaurant in the heart of Dubai. Cosmopolitan environment, international team.',
    featured: false,
  },
  {
    id: '4',
    title: 'Sommelier / Wine Waiter',
    titleEn: 'Sommelier / Wine Waiter',
    company: 'Celebrity Cruises',
    location: 'Internacional — Caribe',
    salary: '$3.000 – $4.200/mês',
    category: 'cruise',
    tags: ['Cruzeiro', 'Conhecimento em vinhos', 'Inglês avançado'],
    tagsEn: ['Cruise', 'Wine knowledge', 'Advanced English'],
    description: 'Sommelier a bordo no restaurante especializado. Carreira com progressão rápida. Contrato renovável de 7 meses.',
    descriptionEn: 'On-board sommelier at the specialty restaurant. Fast career progression. Renewable 7-month contract.',
    featured: false,
  },
  {
    id: '5',
    title: 'Restaurant Manager',
    titleEn: 'Restaurant Manager',
    company: 'Four Seasons',
    location: 'Abu Dhabi, UAE',
    salary: '$6.000 – $8.000/mês',
    category: 'hotel',
    tags: ['Hotel 5★', 'Inglês avançado', '3+ anos de gestão'],
    tagsEn: ['5★ Hotel', 'Advanced English', '3+ years management'],
    description: 'Gestão de restaurante principal em hotel de luxo. Pacote com moradia, seguro saúde e voo anual para o Brasil.',
    descriptionEn: 'Main restaurant management at a luxury hotel. Package includes housing, health insurance and annual flight to Brazil.',
    featured: true,
  },
  {
    id: '6',
    title: 'Garçom de Hotel',
    titleEn: 'Hotel Waiter',
    company: 'Royal Caribbean',
    location: 'Internacional — Norte da Europa',
    salary: '$2.500 – $3.200/mês',
    category: 'cruise',
    tags: ['Cruzeiro', 'Inglês básico aceito', 'Primeiro emprego no exterior'],
    tagsEn: ['Cruise', 'Basic English accepted', 'First job abroad'],
    description: 'Ótima entrada para quem está começando. Treinamento completo a bordo, equipe brasileira presente, idioma não é barreira.',
    descriptionEn: 'Great entry point for beginners. Full on-board training, Brazilian team present, language is not a barrier.',
    featured: false,
  },
];

export const categories: { key: JobCategory | 'all'; labelPt: string; labelEn: string }[] = [
  { key: 'all', labelPt: 'Todas', labelEn: 'All' },
  { key: 'cruise', labelPt: 'Cruzeiros', labelEn: 'Cruises' },
  { key: 'hotel', labelPt: 'Hotéis', labelEn: 'Hotels' },
  { key: 'restaurant', labelPt: 'Restaurantes', labelEn: 'Restaurants' },
  { key: 'bar', labelPt: 'Bar', labelEn: 'Bar' },
];
