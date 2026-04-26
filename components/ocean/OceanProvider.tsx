'use client';

import { createContext, useContext, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { STR, type Lang, type Strings } from './constants';

interface OceanLangCtx {
  lang: Lang;
  t: Strings;
}

const OceanLangContext = createContext<OceanLangCtx>({ lang: 'pt', t: STR.pt });

export function OceanProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const lang: Lang = (locale === 'en' ? 'en' : 'pt') as Lang;
  const t = STR[lang];
  const value = useMemo(() => ({ lang, t }), [lang, t]);
  return (
    <OceanLangContext.Provider value={value}>
      {children}
    </OceanLangContext.Provider>
  );
}

export const useOcean = () => useContext(OceanLangContext);
