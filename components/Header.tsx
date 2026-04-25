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
    { href: '/blog' as const, label: t('blog') },
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
        <Link href="/" className="flex items-center gap-0.5 shrink-0">
          <span className="font-[family-name:var(--font-fraunces)] text-[1.2rem] font-semibold text-[#1a1a1a] tracking-tight">
            Brazil&nbsp;
          </span>
          <span className="font-[family-name:var(--font-fraunces)] text-[1.2rem] font-semibold text-[#C9963A] tracking-tight">
            Abroad
          </span>
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
