'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RelatedProductCard } from './related-product-card';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface RelatedProductsProps {
  products: ShopifyProduct[];
}

const PAGE_SIZE = 4;

export function RelatedProducts({ products }: RelatedProductsProps) {
  const [startIndex, setStartIndex] = useState(0);

  if (products.length === 0) return null;

  const visible = products.slice(startIndex, startIndex + PAGE_SIZE);
  const canPrev = startIndex > 0;
  const canNext = startIndex + PAGE_SIZE < products.length;

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#141718]">You might also like</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
            className="w-10 h-10 rounded-full border border-[#E8ECEF] flex items-center justify-center text-[#141718] hover:bg-[#F3F5F7] disabled:opacity-30 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setStartIndex((i) => Math.min(Math.max(0, products.length - PAGE_SIZE), i + 1))}
            disabled={!canNext}
            className="w-10 h-10 rounded-full border border-[#E8ECEF] flex items-center justify-center text-[#141718] hover:bg-[#F3F5F7] disabled:opacity-30 transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {visible.map((product) => (
          <RelatedProductCard
            key={product.id}
            handle={product.handle}
            title={product.title}
            imageUrl={product.images.edges[0]?.node.url}
            imageAlt={product.images.edges[0]?.node.altText}
            price={product.priceRange.minVariantPrice}
          />
        ))}
      </div>
    </section>
  );
}
