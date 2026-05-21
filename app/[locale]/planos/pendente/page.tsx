'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';

export default function PendentePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FDFAF4] flex flex-col items-center justify-center px-5 py-16">
        <div className="max-w-md w-full text-center">

          <div className="w-20 h-20 rounded-full bg-[#FDF6EC] flex items-center justify-center mx-auto mb-6">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#C9963A" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>

          <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1a1a1a] mb-3">
            Pagamento em processamento
          </h1>
          <p className="text-[#555] text-sm font-[family-name:var(--font-dm-sans)] leading-relaxed mb-4">
            Seu pagamento está sendo processado. Assim que confirmado, você receberá um e-mail com o link para agendar sua aula.
          </p>
          <p className="text-[#777] text-sm font-[family-name:var(--font-dm-sans)] mb-8">
            Pix geralmente é confirmado em segundos. Boleto pode levar até 2 dias úteis.
          </p>

          <Link
            href="/planos"
            className="inline-block bg-[#1A4A6B] text-white font-medium text-sm px-7 py-3.5 rounded-full hover:bg-[#153d5a] transition-colors font-[family-name:var(--font-dm-sans)] mb-3"
          >
            Voltar aos planos
          </Link>
          <br />
          <Link
            href="/"
            className="inline-block text-[#777] text-sm font-[family-name:var(--font-dm-sans)] py-2 hover:text-[#1a1a1a] transition-colors"
          >
            Ir para o início
          </Link>

        </div>
      </main>
      <Footer />
    </>
  );
}
