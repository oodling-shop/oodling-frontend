import type { ShopifyProduct } from '@/lib/shopify/types';

export function getRatingSummary(product: ShopifyProduct): { avg: number; count: number } | null {
  const metafield = product.metafields?.find(
    (m) => m && m.namespace === 'custom' && m.key === 'reviews'
  );
  if (!metafield?.value) return null;

  try {
    const reviews = JSON.parse(metafield.value) as { rating: number }[];
    if (!reviews.length) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return { avg: Math.round(avg * 10) / 10, count: reviews.length };
  } catch {
    return null;
  }
}
