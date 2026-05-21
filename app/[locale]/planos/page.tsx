'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PACKAGES = [
  {
    id: 'starter',
    classes: '1 aula de 45 min',
    price: 'R$ 147',
    description: 'Para conhecer o método e dar o primeiro passo.',
    badge: null,
    highlight: false,
    features: [
      '1 sessão 1:1 com Ricardo',
      'Diagnóstico do seu inglês',
      'Feedback do currículo internacional',
      'Acesso vitalício às ferramentas do site',
      'Curso gravado de inglês na Hotmart — vitalício',
    ],
  },
  {
    id: 'pro',
    classes: '2 aulas de 45 min',
    price: 'R$ 247',
    description: 'O mais escolhido. Tempo suficiente para estruturar seu plano.',
    badge: 'Mais popular',
    highlight: true,
    features: [
      '2 sessões 1:1 com Ricardo',
      'Diagnóstico do seu inglês',
      'Feedback e reescrita do currículo',
      'Simulação de entrevista em inglês',
      'Acesso vitalício às ferramentas do site',
      'Curso gravado de inglês na Hotmart — vitalício',
    ],
  },
  {
    id: 'intensivo',
    classes: '4 aulas de 45 min',
    price: 'R$ 299',
    description: 'Melhor custo-benefício. Para quem quer avançar rápido.',
    badge: 'Melhor valor',
    highlight: false,
    features: [
      '4 sessões 1:1 com Ricardo',
      'Diagnóstico completo do seu inglês',
      'Reescrita do currículo internacional',
      'Simulação intensiva de entrevista',
      'Encaminhamento para vagas parceiras',
      'Acesso vitalício às ferramentas do site',
      'Curso gravado de inglês na Hotmart — vitalício',
    ],
  },
];

export default function PlanosPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy(packageId: string) {
    setLoading(packageId);
    setError(null);
    try {
      const res = await fetch('/api/mp-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json() as { init_point?: string; error?: string };
      if (!res.ok || !data.init_point) throw new Error(data.error ?? 'Erro ao iniciar pagamento');
      window.location.href = data.init_point;
    } catch (err) {
      setError(String(err));
      setLoading(null);
    }
  }

  return (
    <>
      <Header />
      <main className="bg-[#FDFAF4] pt-16">

        {/* Hero */}
        <section className="bg-[#1A4A6B] py-16 px-5 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 font-[family-name:var(--font-dm-sans)]">
              Programa Brazil Abroad
            </p>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-white mb-4">
              Escolha seu plano
            </h1>
            <p className="text-white/70 text-base font-[family-name:var(--font-dm-sans)]">
              Aulas 1:1 com Ricardo. Pagamento via Pix ou cartão. Agendamento automático após confirmação.
            </p>
          </div>
        </section>

        {/* Packages */}
        <section className="py-16 px-5">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-[16px] p-7 flex flex-col ${
                  pkg.highlight
                    ? 'ring-2 ring-[#C9963A] shadow-[0_8px_32px_rgba(201,150,58,0.18)]'
                    : 'shadow-[0_2px_16px_rgba(26,74,107,0.08)]'
                }`}
              >
                {pkg.badge && (
                  <span
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full font-[family-name:var(--font-dm-sans)] whitespace-nowrap ${
                      pkg.highlight ? 'bg-[#C9963A]' : 'bg-[#1A4A6B]'
                    }`}
                  >
                    {pkg.badge}
                  </span>
                )}

                <div className="mb-5 mt-2">
                  <p className="text-[#777] text-[11px] font-semibold tracking-[0.18em] uppercase mb-2 font-[family-name:var(--font-dm-sans)]">
                    {pkg.classes}
                  </p>
                  <p className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold text-[#1a1a1a] mb-2">
                    {pkg.price}
                  </p>
                  <p className="text-[#777] text-sm font-[family-name:var(--font-dm-sans)] leading-snug">
                    {pkg.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#444] font-[family-name:var(--font-dm-sans)]">
                      <span className="mt-0.5 text-[#C9963A] shrink-0 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuy(pkg.id)}
                  disabled={loading !== null}
                  className={`w-full font-semibold py-3.5 rounded-full text-sm font-[family-name:var(--font-dm-sans)] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    pkg.highlight
                      ? 'bg-[#C9963A] text-white hover:bg-[#b8872f]'
                      : 'bg-[#1A4A6B] text-white hover:bg-[#153d5a]'
                  }`}
                >
                  {loading === pkg.id ? 'Aguarde...' : 'Comprar agora →'}
                </button>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-center text-red-600 text-sm mt-6 font-[family-name:var(--font-dm-sans)]">
              {error}
            </p>
          )}

          <p className="text-center text-[#aaa] text-xs mt-8 font-[family-name:var(--font-dm-sans)]">
            Pagamento seguro via Pix ou cartão · Processado por Mercado Pago · Dados protegidos
          </p>
        </section>

        {/* What's included in all */}
        <section className="py-14 px-5 bg-white">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#777] text-[11px] font-semibold tracking-[0.18em] uppercase text-center mb-10 font-[family-name:var(--font-dm-sans)]">
              Incluído em todos os planos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Mentoria com Ricardo — 15 anos em hospitalidade de luxo',
                'Acesso vitalício a todos os aplicativos do site',
                'Curso gravado de inglês para hospitalidade na Hotmart',
                'Parceria com ÉS English School — referência para Dubai e Londres',
                'Acesso a agências recrutadoras internacionais parceiras',
                'Nunca cobramos por vagas em hipótese alguma',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[#C9963A] mt-0.5 shrink-0 font-bold">✓</span>
                  <p className="text-sm text-[#444] font-[family-name:var(--font-dm-sans)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-5 bg-[#F5EDD8]">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#777] text-[11px] font-semibold tracking-[0.18em] uppercase text-center mb-12 font-[family-name:var(--font-dm-sans)]">
              Como funciona
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { n: '01', text: 'Escolha seu plano e pague via Pix ou cartão' },
                { n: '02', text: 'Receba o link por e-mail para agendar sua aula' },
                { n: '03', text: 'Agende no horário que quiser pelo Calendly' },
                { n: '04', text: 'Receba o link do Zoom e comece sua jornada' },
              ].map(({ n, text }) => (
                <div key={n} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1A4A6B] flex items-center justify-center mx-auto mb-3">
                    <span className="font-[family-name:var(--font-fraunces)] text-white font-semibold text-sm">{n}</span>
                  </div>
                  <p className="text-[#1a1a1a] text-sm font-medium font-[family-name:var(--font-dm-sans)] leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust / About Ricardo */}
        <section className="py-16 px-5 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 font-[family-name:var(--font-dm-sans)]">
              Por que Brazil Abroad?
            </p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-4">
              Conduzido por quem vive isso todos os dias.
            </h2>
            <p className="text-[#555] text-sm font-[family-name:var(--font-dm-sans)] leading-relaxed mb-8">
              Ricardo tem 15 anos de experiência em hospitalidade de luxo e é atualmente Supervisor ativo no Atlantis The Royal, Dubai. Cada aula é uma mentoria real — sem script, sem teoria vazia.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Atlantis The Royal', 'Amazónico Dubai', 'Casa Blanca', '15 anos de experiência'].map((tag) => (
                <span
                  key={tag}
                  className="bg-[#EBF2F8] text-[#1A4A6B] text-xs font-semibold px-4 py-2 rounded-full font-[family-name:var(--font-dm-sans)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
