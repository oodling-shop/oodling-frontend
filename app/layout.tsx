import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { NotificationBanner } from "@/components/ui/notification";
import { CookieBanner } from "@/components/ui/cookie-banner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oodling | Premium Digital Platform",
  description: "A premium Next.js project structure for professional web development.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased selection:bg-primary-500/30`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <NotificationBanner />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
