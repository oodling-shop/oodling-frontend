import { NextRequest, NextResponse } from 'next/server';
import { getCart } from '@/lib/shopify/cart';

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);

  try {
    const cart = await getCart();

    if (!cart?.checkoutUrl) {
      return NextResponse.redirect(`${origin}/cart`);
    }

    // Force the hostname to the myshopify.com domain.
    // Shopify's Storefront API returns checkoutUrl using the store's primary custom
    // domain (e.g. oodling.com). In a headless setup that domain serves Next.js, so
    // /cart/c/... hits the app router and 404s. The myshopify.com domain always serves
    // Shopify's native checkout regardless of custom-domain configuration.
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    let finalUrl = cart.checkoutUrl;

    if (shopifyDomain) {
      const parsed = new URL(cart.checkoutUrl);
      parsed.hostname = shopifyDomain;
      finalUrl = parsed.toString();
    }

    return NextResponse.redirect(finalUrl);
  } catch {
    return NextResponse.redirect(`${origin}/cart`);
  }
}
