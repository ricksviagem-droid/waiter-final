import Image from 'next/image';

const strips = [
  {
    src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=85',
    alt: 'Luxury hotel lobby',
    label: 'Hotel de Luxo',
    overlay: 'bg-[#1A4A6B]/50',
  },
  {
    src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=700&q=85',
    alt: 'Bartender at upscale bar',
    label: 'Bar Internacional',
    overlay: 'bg-[#C9963A]/45',
  },
  {
    src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=85',
    alt: 'Luxury cruise ship',
    label: 'Cruzeiro de Luxo',
    overlay: 'bg-[#1A4A6B]/50',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=85',
    alt: 'Fine dining waiter',
    label: 'Restaurante 5 Estrelas',
    overlay: 'bg-[#C9963A]/45',
  },
  {
    src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=85',
    alt: 'Dubai skyline',
    label: 'Dubai',
    overlay: 'bg-[#1A4A6B]/50',
  },
];

export default function PhotoStrip() {
  return (
    <div className="flex h-[240px] md:h-[320px] overflow-hidden">
      {strips.map(({ src, alt, label, overlay }) => (
        <div key={alt} className="relative flex-1 overflow-hidden group cursor-default">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover scale-110 group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="20vw"
            unoptimized
          />
          <div className={`absolute inset-0 ${overlay} group-hover:opacity-60 transition-opacity duration-500`} />
          {/* Thin gold line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9963A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          {/* Label */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
            <span className="text-white/80 text-[9px] font-bold tracking-[0.18em] uppercase font-[family-name:var(--font-dm-sans)]">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
