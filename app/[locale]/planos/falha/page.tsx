'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';

export default function FalhaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FDFAF4] flex flex-col items-center justify-center px-5 py-16">
        <div className="max-w-md w-full text-center">

          <div className="w-20 h-20 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto mb-6">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>

          <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1a1a1a] mb-3">
            Pagamento não concluído
          </h1>
          <p className="text-[#555] text-sm font-[family-name:var(--font-dm-sans)] leading-relaxed mb-8">
            Não foi possível processar seu pagamento. Nenhuma cobrança foi realizada. Você pode tentar novamente ou entrar em contato pelo WhatsApp.
          </p>

          <Link
            href="/planos"
            className="block w-full bg-[#C9963A] text-white font-semibold py-4 rounded-full text-sm text-center font-[family-name:var(--font-dm-sans)] hover:bg-[#b8872f] transition-colors mb-3"
          >
            Tentar novamente →
          </Link>

          <a
            href="https://wa.me/5511962794747?text=Olá%20Ricardo%2C%20tive%20um%20problema%20no%20pagamento%20do%20plano."
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border border-[#e8e0d0] text-[#555] font-medium py-4 rounded-full text-sm text-center font-[family-name:var(--font-dm-sans)] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors mb-3"
          >
            Falar com Ricardo no WhatsApp
          </a>

          <Link
            href="/"
            className="block text-[#aaa] text-sm font-[family-name:var(--font-dm-sans)] py-2 hover:text-[#777] transition-colors"
          >
            Voltar ao início
          </Link>

        </div>
      </main>
      <Footer />
    </>
  );
}
