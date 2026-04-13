import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get('shopify_locale')?.value ?? 'EN';
  const locale = raw.toLowerCase(); // next-intl uses lowercase: 'en', 'ar'

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
