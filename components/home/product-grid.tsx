'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../container';
import { cn } from '@/helpers/cn';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { getRatingSummary } from '@/helpers/rating';
import { useTranslations } from 'next-intl';

type Props = {
  bestSellers: ShopifyProduct[]
  newArrivals: ShopifyProduct[]
  sale: ShopifyProduct[]
}

const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const image = product.images.edges[0]?.node
  const price = parseFloat(product.priceRange.minVariantPrice.amount)
  const currency = product.priceRange.minVariantPrice.currencyCode
  const rating = getRatingSummary(product)

  return (
    <Link href={`/products/${product.handle}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[4/5] bg-[#F3F5F7] rounded-[12px] overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-full transition-all duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3">
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={14}
                className={cn(
                  "transition-colors duration-300",
                  i <= Math.round(rating?.avg ?? 0) ? "fill-[#141718] text-[#141718]" : "fill-neutral-200 text-neutral-200"
                )}
              />
            ))}
          </div>
          {rating && <span className="text-xs text-[#6C7275]">({rating.count})</span>}
        </div>
        <h3 className="text-base font-semibold text-[#141718] leading-tight">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-[#141718]">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export const ProductGrid = ({ bestSellers, newArrivals, sale }: Props) => {
  const t = useTranslations('productGrid');

  type TabKey = 'bestSellers' | 'newArrivals' | 'sale';
  const TABS: TabKey[] = ['bestSellers', 'newArrivals', 'sale'];

  const [activeTab, setActiveTab] = useState<TabKey>('bestSellers');
  const [limit, setLimit] = useState(8);

  const tabProducts: Record<TabKey, ShopifyProduct[]> = {
    bestSellers,
    newArrivals,
    sale,
  };

  const products = tabProducts[activeTab];

  return (
    <section className="py-12 md:py-24 bg-white">
      <Container>
        <div className="flex justify-center mb-10 md:mb-16">
          <div className="flex items-center gap-8 md:gap-12 overflow-x-auto scrollbar-none py-2">
            {TABS.map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => {
                  setActiveTab(tab);
                  setLimit(8);
                }}
                className={cn(
                  "relative pb-2 text-lg md:text-xl transition-colors duration-300 whitespace-nowrap h-auto px-0 hover:bg-transparent rounded-none",
                  activeTab === tab
                    ? "text-[#141718] font-semibold"
                    : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                {t(`tabs.${tab}`)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#141718]" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 mb-12 md:mb-16">
            {products.slice(0, limit).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-400 py-16">{t('noProducts')}</p>
        )}

        {products.length > limit && (
          <div className="flex justify-center">
            <Button
              onClick={() => setLimit(prev => prev + 4)}
              className="bg-[#141718] text-white px-10 py-3.5 rounded-full font-semibold text-base transition-transform duration-300 hover:scale-105 active:scale-95 h-auto"
            >
              {t('loadMore')}
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default ProductGrid;
