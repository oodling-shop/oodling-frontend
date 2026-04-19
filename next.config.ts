import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? 'oodling.myshopify.com';

const nextConfig: NextConfig = {
  transpilePackages: ['@phosphor-icons/react'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Proxy Shopify's native checkout paths to oodling.myshopify.com.
  // Shopify returns checkoutUrl using the primary custom domain (oodling.com),
  // but oodling.com serves Next.js — so /cart/c/... would 404.
  // These rewrites intercept those paths before route matching and forward
  // them transparently to Shopify's servers.
  async rewrites() {
    return [
      {
        source: '/cart/c/:path*',
        destination: `https://${SHOPIFY_DOMAIN}/cart/c/:path*`,
      },
      {
        source: '/checkouts/:path*',
        destination: `https://${SHOPIFY_DOMAIN}/checkouts/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

