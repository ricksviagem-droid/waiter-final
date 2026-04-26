'use client';

import { useEffect } from 'react';
import { OceanProvider } from './OceanProvider';
import { useSmoothScroll, PlaneCursor, LoadingCurtain } from './chrome';
import { WhatsAppFAB, SocialRail, MobileStickyBar, OceanScrollProgress } from './OceanWidgets';
import OceanHero from './OceanHero';
import OceanStats from './OceanStats';
import OceanAbout from './OceanAbout';
import OceanMentors from './OceanMentors';
import OceanRoadmap from './OceanRoadmap';
import OceanEnglish from './OceanEnglish';
import OceanJobs from './OceanJobs';
import OceanApps from './OceanApps';
import OceanBlog from './OceanBlog';
import OceanTestimonials from './OceanTestimonials';
import OceanPartners from './OceanPartners';
import OceanCTA from './OceanCTA';
import OceanFooter from './OceanFooter';

function OceanInner() {
  useSmoothScroll();

  useEffect(() => {
    document.body.classList.add('ocean-page');
    return () => document.body.classList.remove('ocean-page');
  }, []);

  return (
    <>
      <LoadingCurtain />
      <PlaneCursor />
      <OceanScrollProgress />
      <SocialRail />

      <main>
        <OceanHero />
        <OceanStats />
        <OceanAbout />
        <OceanMentors />
        <OceanRoadmap />
        <OceanEnglish />
        <OceanJobs />
        <OceanApps />
        <OceanBlog />
        <OceanTestimonials />
        <OceanPartners />
        <OceanCTA />
      </main>

      <OceanFooter />
      <WhatsAppFAB />
      <MobileStickyBar />
    </>
  );
}

export default function OceanApp() {
  return (
    <OceanProvider>
      <OceanInner />
    </OceanProvider>
  );
}
