'use client';

import { useEffect } from 'react';
import { OceanProvider } from './OceanProvider';
import { useSmoothScroll, PlaneCursor, LoadingCurtain } from './chrome';
import { WhatsAppFAB, SocialRail, MobileStickyBar, OceanScrollProgress } from './OceanWidgets';
import OceanHero from './OceanHero';
import OceanRoadmap from './OceanRoadmap';
import OceanAbout from './OceanAbout';
import OceanPackages from './OceanPackages';
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
        <OceanRoadmap />
        <OceanAbout />
        <OceanPackages />
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
