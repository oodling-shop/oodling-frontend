'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '../container';

export const FeaturedProduct = () => {
  return (
    <section className="py-20 bg-[#F8F8F8]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-start gap-6 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
              RUN SMART+
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed max-w-md">
              Phosfluor escently engage worldwide methodologies with web-enabled process-centric technology.
            </p>
            <Link 
              href="/products/apple-watch-ultra" 
              className="group flex items-center gap-2 text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 mt-4 hover:opacity-70 transition-all"
            >
              SHOP NOW
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
            </Link>
          </div>

          {/* Right Content - Image */}
          <div className="relative w-full aspect-square flex items-center justify-center">
            {/* 
                Using a cleaner placeholder.
            */}
            <div className="relative w-full h-full flex items-center justify-center">
                 <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                    <Image
                      src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop" 
                      alt="Smart Watch"
                      fill
                      className="object-contain drop-shadow-xl"
                    />
                 </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProduct;
