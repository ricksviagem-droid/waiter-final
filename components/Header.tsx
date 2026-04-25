'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = () => {
    const next = locale === 'pt' ? 'en' : 'pt';
    router.replace(pathname, { locale: next });
  };

  const navLinks = [
    { href: '/simulator' as const, label: t('simulator') },
    { href: '/exchange' as const, label: t('exchange') },
    { href: '/consulting' as const, label: t('consulting') },
    { href: '/about' as const, label: t('about') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#e8e0d0] ${
        scrolled ? 'bg-[#FDFAF4]/90 backdrop-blur-md' : 'bg-[#FDFAF4]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#1A4A6B] flex items-center justify-center shrink-0 shadow-md ring-1 ring-[#C9963A]/20">
            <svg viewBox="0 0 22 22" fill="none" width="16" height="16">
              {/* Globe */}
              <circle cx="11" cy="11" r="8.5" stroke="white" strokeWidth="1.3" opacity="0.7"/>
              <ellipse cx="11" cy="11" rx="4" ry="8.5" stroke="white" strokeWidth="0.9" opacity="0.38"/>
              <line x1="2.5" y1="11" x2="19.5" y2="11" stroke="white" strokeWidth="0.9" opacity="0.38"/>
              <path d="M4 7.5 Q11 6 18 7.5" stroke="white" strokeWidth="0.7" opacity="0.22" fill="none"/>
              <path d="M4 14.5 Q11 16 18 14.5" stroke="white" strokeWidth="0.7" opacity="0.22" fill="none"/>
              {/* Flight path: Brasil → Dubai */}
              <path d="M8.5 13.5 Q13.5 4 17.5 8" stroke="#C9963A" strokeWidth="1.1" strokeDasharray="1.6 1.2" fill="none" opacity="0.95"/>
              {/* Brasil dot */}
              <circle cx="8.5" cy="13.5" r="2" fill="#C9963A"/>
              <circle cx="8.5" cy="13.5" r="0.8" fill="white" opacity="0.9"/>
              {/* Dubai dot */}
              <circle cx="17.5" cy="8" r="1.3" fill="white" opacity="0.9"/>
              <circle cx="17.5" cy="8" r="0.5" fill="#C9963A" opacity="0.7"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <span className="font-[family-name:var(--font-fraunces)] text-[0.55rem] font-semibold text-[#C9963A] tracking-[0.22em] uppercase">Consultoria</span>
            <span className="font-[family-name:var(--font-fraunces)] text-[1.1rem] font-semibold text-[#1a1a1a] tracking-tight leading-none">
              Brazil <span className="text-[#C9963A]">Abroad</span>
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-[#777777] hover:text-[#1a1a1a] transition-colors font-[family-name:var(--font-dm-sans)]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* PT/EN toggle */}
          <button
            onClick={switchLocale}
            className="flex items-center gap-1.5 text-sm text-[#777777] hover:text-[#1a1a1a] transition-colors font-[family-name:var(--font-dm-sans)]"
            aria-label="Switch language"
          >
            <span className="text-base leading-none">
              {locale === 'pt' ? '🇧🇷' : '🇺🇸'}
            </span>
            <span className="font-medium text-xs hidden sm:inline">
              {locale === 'pt' ? 'EN' : 'PT'}
            </span>
          </button>

          {/* CTA button */}
          <Link
            href="/assessment"
            className="hidden sm:inline-flex items-center bg-[#1A4A6B] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#153d5a] transition-colors font-[family-name:var(--font-dm-sans)]"
          >
            {t('cta')}
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 text-[#1a1a1a]"
            aria-label="Menu"
          >
            {isOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FDFAF4] border-t border-[#e8e0d0] px-5 py-6 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-[#1a1a1a] font-[family-name:var(--font-dm-sans)]"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/assessment"
            onClick={() => setIsOpen(false)}
            className="mt-2 bg-[#1A4A6B] text-white text-sm font-medium px-5 py-3 rounded-full text-center font-[family-name:var(--font-dm-sans)]"
          >
            {t('cta')}
          </Link>
        </div>
      )}
    </header>
  );
}
