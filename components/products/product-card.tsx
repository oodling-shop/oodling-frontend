import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { cn } from '@/helpers/cn';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface ProductCardProps {
  product: ShopifyProduct;
  layout?: 'grid' | 'list';
}

function getRatingSummary(product: ShopifyProduct): { avg: number; count: number } | null {
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

function StarRating({ avg, count }: { avg: number; count: number } = { avg: 0, count: 0 }) {
  const filled = Math.round(avg);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={12}
            height={12}
            className={i <= filled ? 'fill-[#E8722A] text-[#E8722A]' : 'fill-[#E8ECEF] text-[#E8ECEF]'}
          />
        ))}
      </div>
      {count > 0 && <span className="text-xs text-[#6C7275]">({count})</span>}
    </div>
  );
}

export const ProductCard = ({ product, layout = 'grid' }: ProductCardProps) => {
  const href = `/products/${product.handle}`;
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const rating = getRatingSummary(product);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);

  if (layout === 'list') {
    return (
      <Link href={href} className="group flex gap-8 py-6 border-b border-neutral-100 last:border-0 items-center">
        <div className="relative w-48 aspect-3/4 overflow-hidden bg-[#F3F5F7] shrink-0">
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="192px"
            />
          )}
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-xl font-bold text-[#141718]">{product.title}</h3>
          <StarRating avg={rating?.avg ?? 0} count={rating?.count ?? 0} />
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#141718]">{formattedPrice}</span>
          </div>
          {product.description && (
            <p className="text-neutral-500 line-clamp-2 max-w-xl text-sm">{product.description}</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group flex flex-col gap-3">
      <div className="relative aspect-3/4 overflow-hidden bg-[#F3F5F7]">
        {image && (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-[#141718]">{product.title}</h3>
        <StarRating avg={rating?.avg ?? 0} count={rating?.count ?? 0} />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#141718]">{formattedPrice}</span>
        </div>
      </div>
    </Link>
  );
};
