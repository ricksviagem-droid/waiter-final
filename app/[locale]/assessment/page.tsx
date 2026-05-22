'use client';

import { useEffect } from 'react';

const WA_URL = 'https://wa.me/5511962794747?text=Ol%C3%A1%20Ricardo%2C%20assisti%20ao%20v%C3%ADdeo%20e%20quero%20saber%20mais%20sobre%20a%20consultoria.';

export default function AssessmentPage() {
  useEffect(() => {
    window.location.replace(WA_URL);
  }, []);

  return (
    <main className="min-h-screen bg-[#FDFAF4] flex items-center justify-center px-5">
      <div className="text-center">
        <p className="text-[#777] text-sm font-[family-name:var(--font-dm-sans)]">
          Redirecionando para o WhatsApp...
        </p>
      </div>
    </main>
  );
}
