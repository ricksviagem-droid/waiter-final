'use client';

import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';

export default function SucessoPage() {
  const params = useSearchParams();
  const paymentId = params.get('payment_id');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FDFAF4] flex flex-col items-center justify-center px-5 py-16">
        <div className="max-w-md w-full">

          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#EDF5F0] flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#2d6a4f" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1a1a1a] mb-3">
              Pagamento confirmado!
            </h1>
            <p className="text-[#555] text-sm font-[family-name:var(--font-dm-sans)] leading-relaxed">
              Em poucos minutos você receberá um e-mail com o link para agendar sua aula. Verifique também a pasta de spam.
            </p>
          </div>

          <div className="bg-[#EBF2F8] rounded-[14px] p-6 mb-6">
            <p className="text-[#1A4A6B] text-sm font-semibold mb-3 font-[family-name:var(--font-dm-sans)]">Próximos passos:</p>
            <ol className="space-y-2">
              {[
                'Verifique sua caixa de entrada (e pasta de spam)',
                'Clique no link do e-mail para abrir o Calendly',
                'Escolha o dia e horário que preferir',
                'Receba o link do Zoom por e-mail e apareça 5 min antes',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm text-[#444] font-[family-name:var(--font-dm-sans)]">
                  <span className="w-5 h-5 rounded-full bg-[#1A4A6B] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <a
            href="https://calendly.com/ricardo-rogerios/diagnostico-gratuito-_-brazil-abroad"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#C9963A] text-white font-semibold py-4 rounded-full text-sm text-center font-[family-name:var(--font-dm-sans)] hover:bg-[#b8872f] transition-colors mb-3"
          >
            Agendar minha aula agora →
          </a>

          <Link
            href="/"
            className="block w-full text-center text-[#777] text-sm font-[family-name:var(--font-dm-sans)] py-2 hover:text-[#1a1a1a] transition-colors"
          >
            Voltar ao início
          </Link>

          {paymentId && (
            <p className="text-center text-[#bbb] text-xs mt-6 font-[family-name:var(--font-dm-sans)]">
              ID do pagamento: {paymentId}
            </p>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
