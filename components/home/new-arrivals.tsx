'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '../container';
import { NEW_ARRIVALS as PRODUCTS } from '@/constants';

export const NewArrivals = () => {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#141718] tracking-tight">
            New Arrivals
          </h2>
          
          {/* Pagination Dots from Image */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#141718]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#141718]" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {PRODUCTS.map((product) => (
              <div 
                key={product.id} 
                className="flex-none w-[320px] md:w-[410px] snap-start"
              >
                <div className="relative aspect-[4/5] bg-[#F3F5F7] rounded-[32px] p-8 flex flex-col items-center justify-center group cursor-pointer transition-all duration-500 hover:shadow-xl">
                  
                  {/* Shoe Image */}
                  <div className="relative w-full h-[60%] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* Product Pill Button */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-fit">
                    <div className="bg-white rounded-full px-12 py-4 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:px-14">
                      <span className="text-base font-semibold text-[#141718] whitespace-nowrap">
                        {product.name}
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
