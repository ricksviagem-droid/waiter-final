'use client';

import { PAL, SOCIAL, BOOKING_URL } from './constants';
import { useOcean } from './OceanProvider';
import { SocialIcon } from './shared';

const NAV_SECTIONS: Record<string, string> = {
  mentors: '#mentors',
  road: '#road',
  apps: '#apps',
  blog: '#blog',
  contact: '#contact',
  about: '#about',
  partners: '#partners',
  jobs: '#jobs',
};

export default function OceanFooter() {
  const { t, lang } = useOcean();
  const socials = [
    { kind: 'whatsapp', href: SOCIAL.whatsapp },
    { kind: 'instagram', href: SOCIAL.instagram },
    { kind: 'youtube', href: SOCIAL.youtube },
    { kind: 'linkedin', href: SOCIAL.linkedin },
    { kind: 'tiktok', href: SOCIAL.tiktok },
  ];

  return (
    <footer style={{ position: 'relative', background: PAL.oceanDeep, borderTop: `1px solid ${PAL.gold}20`, overflow: 'hidden' }}>
      {/* Top glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 1, background: `linear-gradient(90deg, transparent, ${PAL.gold}50, transparent)` }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px) clamp(32px, 4vw, 48px)' }}>
        <div className="ocean-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'clamp(32px, 5vw, 64px)', marginBottom: 'clamp(40px, 6vw, 64px)' }}>

          {/* Brand column */}
          <div>
            {/* Wordmark */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 22, fontWeight: 500, color: PAL.cream, letterSpacing: '-0.02em', lineHeight: 1 }}>Brazil Abroad</div>
              <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 9, letterSpacing: '0.3em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 600, marginTop: 4 }}>Hub de Mentoria</div>
            </div>

            <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 13, color: 'rgba(248,241,229,0.55)', lineHeight: 1.65, fontWeight: 300, maxWidth: 300, margin: '0 0 28px' }}>
              {t.footer.tag}
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {socials.map((s) => (
                <a
                  key={s.kind}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    border: `1px solid ${PAL.gold}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 200ms, border-color 200ms',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = `${PAL.gold}18`;
                    el.style.borderColor = PAL.gold;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = 'transparent';
                    el.style.borderColor = `${PAL.gold}35`;
                  }}
                >
                  <SocialIcon kind={s.kind as 'whatsapp'} size={15} color={PAL.gold} />
                </a>
              ))}
            </div>

            {/* Contact details */}
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: 'phone', label: t.footer.contact.phone, href: SOCIAL.phone },
                { icon: 'whatsapp', label: t.footer.contact.wa, href: SOCIAL.whatsapp },
                { icon: 'email', label: t.footer.contact.email, href: SOCIAL.email },
                { icon: 'pin', label: t.footer.contact.addr, href: undefined },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target={item.href?.startsWith('http') ? '_blank' : undefined}
                  rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontSize: 12,
                    color: 'rgba(248,241,229,0.5)',
                    textDecoration: 'none',
                    transition: 'color 200ms',
                    lineHeight: 1.4,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = PAL.cream; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(248,241,229,0.5)'; }}
                >
                  <span style={{ flexShrink: 0, marginTop: 1 }}>
                    <SocialIcon kind={item.icon as 'pin'} size={12} color={PAL.gold} />
                  </span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {t.footer.cols.map((col, ci) => (
            <div key={ci}>
              <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 10, letterSpacing: '0.24em', color: PAL.gold, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>{col.t}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.l.map((link, li) => (
                  <li key={li}>
                    <a
                      href="#"
                      data-cursor="link"
                      style={{
                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                        fontSize: 13,
                        color: 'rgba(248,241,229,0.55)',
                        textDecoration: 'none',
                        transition: 'color 200ms',
                        display: 'inline-block',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = PAL.cream; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(248,241,229,0.55)'; }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${PAL.gold}18`, paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 11, color: 'rgba(248,241,229,0.3)', margin: 0, letterSpacing: '0.04em' }}>
            {t.footer.copy}
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              lang === 'pt' ? 'Privacidade' : 'Privacy',
              lang === 'pt' ? 'Termos' : 'Terms',
              'Cookies',
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontSize: 11,
                  color: 'rgba(248,241,229,0.3)',
                  textDecoration: 'none',
                  transition: 'color 200ms',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(248,241,229,0.65)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(248,241,229,0.3)'; }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ocean-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .ocean-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
