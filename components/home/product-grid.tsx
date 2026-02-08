'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Container } from '../container';
import { cn } from '@/helpers/cn';
import { Star } from 'lucide-react';
import { Product } from '@/types';
import { PRODUCTS } from '@/constants';

const TABS = ['Best Sellers', 'New Arrivals', 'Sale'];

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group flex flex-col gap-3">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#F3F5F7] rounded-[32px] overflow-hidden flex items-center justify-center p-8">
        <div className="relative w-full h-full transition-all duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 px-1 mt-1">
        {/* Rating */}
        <div className="flex items-center gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={cn(
                "transition-colors duration-300",
                i < product.rating 
                  ? "fill-[#141718] text-[#141718]" 
                  : "text-neutral-300"
              )}
            />
          ))}
        </div>

        {/* Name */}
        <h3 className="text-base font-semibold text-[#141718] leading-tight">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-[#141718]">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-base text-neutral-400 font-medium line-through decoration-1">
              {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProductGrid = () => {
  const [activeTab, setActiveTab] = useState('Best Sellers');

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        {/* Tabs */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="flex items-center gap-8 sm:gap-12">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative pb-2 text-base sm:text-xl transition-colors duration-300",
                  activeTab === tab 
                    ? "text-[#141718] font-semibold" 
                    : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#141718]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <button className="bg-[#141718] text-white px-10 py-3.5 rounded-full font-semibold text-base transition-transform duration-300 hover:scale-105 active:scale-95">
            Load More
          </button>
        </div>
      </Container>
    </section>
  );
};

export default ProductGrid;
