'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ShopLocale } from '@/lib/shopify/locale';

const LOCALE_COOKIE = 'shopify_locale';

type LocaleContextType = {
  locale: string;
  setLocale: (isoCode: string) => void;
  locales: ShopLocale[];
};

const LocaleContext = createContext<LocaleContextType>({
  locale: 'EN',
  setLocale: () => {},
  locales: [],
});

export function LocaleProvider({
  children,
  locales,
  defaultLocale,
}: {
  children: React.ReactNode;
  locales: ShopLocale[];
  defaultLocale: string;
}) {
  const [locale, setLocaleState] = useState(defaultLocale);
  const router = useRouter();

  const setLocale = useCallback((isoCode: string) => {
    setLocaleState(isoCode);
    document.cookie = `${LOCALE_COOKIE}=${isoCode}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh(); // re-renders server components with new locale
  }, [router]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, locales }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
