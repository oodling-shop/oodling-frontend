'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '../container';
import { ShopifyProductWithMetafields } from '@/lib/shopify/types';

interface FeaturedProductProps {
  product: ShopifyProductWithMetafields;
}

export const FeaturedProduct = ({ product }: FeaturedProductProps) => {
  const image = product.images.edges[0]?.node;
  const shortDescription = product.metafields?.find(
    (m) => m?.namespace === 'custom' && m?.key === 'short_description'
  )?.value;

  return (
    <section className="py-20 bg-[#F8F8F8]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-start gap-6 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 uppercase">
              {product.title}
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed max-w-md">
              {shortDescription || product.description}
            </p>
            <Link 
              href={`/products/${product.handle}`} 
              className="group flex items-center gap-2 text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 mt-4 hover:opacity-70 transition-all"
            >
              SHOP NOW
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
            </Link>
          </div>

          {/* Right Content - Image */}
          <div className="relative w-full aspect-square flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
                 <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                    {image && (
                      <Image
                        src={image.url} 
                        alt={image.altText || product.title}
                        fill
                        className="object-contain drop-shadow-xl"
                      />
                    )}
                 </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProduct;
