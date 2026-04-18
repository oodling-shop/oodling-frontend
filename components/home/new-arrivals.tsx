'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Container } from '../container';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { getRatingSummary } from '@/helpers/rating';
import { useTranslations } from 'next-intl';

export const NewArrivals = ({ products }: { products: ShopifyProduct[] }) => {
  const t = useTranslations('newArrivals');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotsCount, setDotsCount] = useState(0);

  const calculateDots = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const items = Array.from(scrollContainer.children);
    if (items.length === 0) return;

    const firstItem = items[0] as HTMLElement;
    const itemWidth = firstItem.clientWidth + 24;
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const count = Math.max(1, Math.round(maxScroll / itemWidth) + 1);
    setDotsCount(count);
  };

  useEffect(() => {
    calculateDots();
    window.addEventListener('resize', calculateDots);
    return () => window.removeEventListener('resize', calculateDots);
  }, [products]);

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const items = Array.from(scrollContainer.children);
    if (items.length === 0) return;

    const scrollLeft = scrollContainer.scrollLeft;
    const firstItem = items[0] as HTMLElement;
    const itemWidth = firstItem.clientWidth + 24;

    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== activeIndex && newIndex < dotsCount) {
      setActiveIndex(newIndex);
    }
  };

  const scrollTo = (index: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const items = Array.from(scrollContainer.children);
    if (items.length === 0) return;

    const firstItem = items[0] as HTMLElement;
    const itemWidth = firstItem.clientWidth + 24;

    scrollContainer.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (isHovered) return;

      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const currentScroll = scrollContainer.scrollLeft;

      const firstItem = scrollContainer.firstElementChild as HTMLElement;
      const itemWidth = firstItem ? firstItem.clientWidth + 24 : 350;

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
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-[40px] font-semibold text-[#141718] tracking-tight">
            {t('title')}
          </h2>

          <div className="flex items-center gap-2">
            {[...Array(dotsCount)].map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  activeIndex === index
                    ? "w-6 h-6 rounded-full border border-[#141718]"
                    : "w-1.5 h-1.5 rounded-full bg-neutral-300 hover:bg-[#141718]/50"
                }`}
                aria-label={t('goToSlide', { n: index + 1 })}
              >
                {activeIndex === index && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#141718]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
          >
            {products.map((product) => {
              const rating = getRatingSummary(product);
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="flex-none w-70 md:w-81.25 snap-start group"
                >
                  <div className="relative aspect-4/5 bg-[#F3F5F7] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">
                    {product.images.edges[0]?.node && (
                      <Image
                        src={product.images.edges[0].node.url}
                        alt={product.images.edges[0].node.altText || product.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        priority
                      />
                    )}
                    <div className="absolute bottom-8 left-0 right-0 px-4 transform transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="bg-white rounded-3xl mx-auto px-6 py-3 shadow-sm transition-all duration-300 group-hover:shadow-md w-fit max-w-full flex flex-col items-center justify-center min-h-12 gap-1">
                        <p className="text-sm font-semibold text-[#141718] text-center leading-tight">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              width={11}
                              height={11}
                              className={i <= Math.round(rating?.avg ?? 0) ? 'fill-[#E8722A] text-[#E8722A]' : 'fill-[#E8ECEF] text-[#E8ECEF]'}
                            />
                          ))}
                          {rating && <span className="text-[10px] text-[#6C7275] ml-0.5">({rating.count})</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
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
