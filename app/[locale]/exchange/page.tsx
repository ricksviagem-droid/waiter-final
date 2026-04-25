import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function ExchangePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 px-6 max-w-4xl mx-auto">
        <p className="text-[#777777] text-sm font-[family-name:var(--font-dm-sans)]">
          Exchange — coming soon
        </p>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
