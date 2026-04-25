import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import HowItWorks from '@/components/home/HowItWorks';
import Ticker from '@/components/home/Ticker';
import Manifesto from '@/components/home/Manifesto';
import FreeOffering from '@/components/home/FreeOffering';
import About from '@/components/home/About';
import Testimonials from '@/components/home/Testimonials';
import BlogPreview from '@/components/home/BlogPreview';
import Partners from '@/components/home/Partners';
import FinalCTA from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Stats />
        <HowItWorks />
        <Manifesto />
        <FreeOffering />
        <About />
        <Testimonials />
        <BlogPreview />
        <Partners />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
