import { cookies } from "next/headers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/providers/cart-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { getTokenFromCookie } from "@/lib/shopify/customer";
import { getShopLocales } from "@/lib/shopify/locale";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, locales, cookieStore] = await Promise.all([
    getTokenFromCookie(),
    getShopLocales(),
    cookies(),
  ]);
  const isLoggedIn = !!token;
  const defaultLocale = cookieStore.get('shopify_locale')?.value ?? locales[0]?.isoCode ?? 'EN';

  return (
    <AuthProvider isLoggedIn={isLoggedIn}>
      <LocaleProvider locales={locales} defaultLocale={defaultLocale}>
        <CartProvider>
          <Navbar />
          <div className="pt-20 min-h-screen flex flex-col">
            <div className="grow">
              {children}
            </div>
            <Footer />
          </div>
        </CartProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}
