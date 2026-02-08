'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '../container';
import { cn } from '@/lib/utils';

export const Collections = () => {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Left Column: Kopla */}
          <div className="relative bg-[#F3F5F7] p-8 md:p-12 flex flex-col justify-start overflow-hidden min-h-[450px] md:min-h-[664px] group">
            <div className="relative z-10">
              <h3 className="text-3xl md:text-[34px] font-medium text-neutral-900 mb-1">Kopla</h3>
              <Link
                href="/shop/kopla"
                className="inline-flex items-center gap-1 text-sm md:text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-60 transition-opacity group/link"
              >
                Shop Now <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-8 pt-20 md:pt-24">
              <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
                <Image
                  src="/images/kopia.png"
                  alt="Kopla"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Column: Lola and Folka */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Top: Lola */}
            <div className="relative bg-[#F3F5F7] p-8 md:p-12 flex flex-col justify-end overflow-hidden min-h-[300px] md:h-[320px] group md:flex-1">
              <div className="relative z-10 max-w-[50%]">
                <h3 className="text-3xl md:text-[34px] font-medium text-neutral-900 mb-1">Lola</h3>
                <Link
                  href="/shop/lola"
                  className="inline-flex items-center gap-1 text-sm md:text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-60 transition-opacity group/link"
                >
                  Shop Now <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
              <div className="absolute inset-y-0 right-0 w-full md:w-[70%] flex items-center justify-end p-4 md:p-8">
                <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
                  <Image
                    src="/images/lola.png"
                    alt="Lola"
                    fill
                    className="object-contain object-right"
                  />
                </div>
              </div>
            </div>

            {/* Bottom: Folka */}
            <div className="relative bg-[#F3F5F7] p-8 md:p-12 flex flex-col justify-end overflow-hidden min-h-[300px] md:h-[320px] group md:flex-1">
              <div className="relative z-10 max-w-[50%]">
                <h3 className="text-3xl md:text-[34px] font-medium text-neutral-900 mb-1">Folka</h3>
                <Link
                  href="/shop/folka"
                  className="inline-flex items-center gap-1 text-sm md:text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-60 transition-opacity group/link"
                >
                  Shop Now <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
              <div className="absolute inset-y-0 right-0 w-full md:w-[70%] flex items-center justify-end p-4 md:p-8">
                <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
                  <Image
                    src="/images/folka.png"
                    alt="Folka"
                    fill
                    className="object-contain object-right"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Collections;
