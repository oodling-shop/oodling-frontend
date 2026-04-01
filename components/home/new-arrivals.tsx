'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Container } from '../container';
import type { ShopifyProduct } from '@/lib/shopify/types';

export const NewArrivals = ({ products }: { products: ShopifyProduct[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (isHovered) return;

      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const currentScroll = scrollContainer.scrollLeft;
      
      // Calculate item width (desktop 325px + 24px gap = 349px, but dynamic is better)
      const firstItem = scrollContainer.firstElementChild as HTMLElement;
      // Default to 350 if not found, though it should be found
      const itemWidth = firstItem ? firstItem.clientWidth + 24 : 350; 

      // If we're near the end, scroll back to start
      if (currentScroll >= maxScroll - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    };

    const intervalId = setInterval(scroll, 3000);

    return () => clearInterval(intervalId);
  }, [isHovered]);

  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-[40px] font-semibold text-[#141718] tracking-tight">
            New Arrivals
          </h2>
          
          {/* Pagination Dots */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#141718]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#141718]" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[280px] md:w-[325px] snap-start"
              >
                <div className="relative aspect-[4/5] bg-[#F3F5F7] rounded-[12px] p-8 flex flex-col items-center justify-center group cursor-pointer transition-all duration-300 hover:shadow-lg">

                  {/* Shoe Image */}
                  <div className="relative w-full h-[60%] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3">
                    {product.images.edges[0]?.node && (
                      <Image
                        src={product.images.edges[0].node.url}
                        alt={product.images.edges[0].node.altText || product.title}
                        fill
                        className="object-contain"
                        priority
                      />
                    )}
                  </div>

                  {/* Product Pill Button */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-fit max-w-[90%]">
                    <div className="bg-white rounded-full px-8 py-3 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:px-10">
                      <span className="text-sm font-semibold text-[#141718] whitespace-nowrap">
                        {product.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default NewArrivals;
