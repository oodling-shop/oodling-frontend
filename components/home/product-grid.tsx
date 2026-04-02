'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../container';
import { cn } from '@/helpers/cn';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ShopifyProduct } from '@/lib/shopify/types';

const TABS = ['Best Sellers', 'New Arrivals', 'Sale'] as const;

type Tab = typeof TABS[number];

type Props = {
  bestSellers: ShopifyProduct[]
  newArrivals: ShopifyProduct[]
  sale: ShopifyProduct[]
}

const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const image = product.images.edges[0]?.node
  const price = parseFloat(product.priceRange.minVariantPrice.amount)
  const currency = product.priceRange.minVariantPrice.currencyCode

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
        <div className="flex items-center gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={cn(
                "transition-colors duration-300",
                i < 5 ? "fill-[#141718] text-[#141718]" : "text-neutral-300"
              )}
            />
          ))}
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
  const [activeTab, setActiveTab] = useState<Tab>('Best Sellers');
  const [limit, setLimit] = useState(8);

  const tabProducts: Record<Tab, ShopifyProduct[]> = {
    'Best Sellers': bestSellers,
    'New Arrivals': newArrivals,
    'Sale': sale,
  }

  const products = tabProducts[activeTab]

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
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#141718]" />
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
          <p className="text-center text-neutral-400 py-16">No products found.</p>
        )}

        {products.length > limit && (
          <div className="flex justify-center">
            <Button 
              onClick={() => setLimit(prev => prev + 4)}
              className="bg-[#141718] text-white px-10 py-3.5 rounded-full font-semibold text-base transition-transform duration-300 hover:scale-105 active:scale-95 h-auto"
            >
              Load More
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default ProductGrid;
