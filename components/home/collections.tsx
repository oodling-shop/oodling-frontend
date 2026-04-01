'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '../container';
import { cn } from '@/lib/utils';
import type { ShopifyCollection } from '@/lib/shopify/types';

type Props = {
  collections: ShopifyCollection[]
}

const CollectionCard = ({
  collection,
  className,
  textClassName,
  imageClassName,
  imageObjectClass = 'object-contain',
}: {
  collection: ShopifyCollection
  className?: string
  textClassName?: string
  imageClassName?: string
  imageObjectClass?: string
}) => (
  <div className={cn('relative bg-[#F3F5F7] p-8 md:p-12 flex flex-col justify-start overflow-hidden group', className)}>
    <div className={cn('relative z-10', textClassName)}>
      <h3 className="text-3xl md:text-[34px] font-medium text-neutral-900 mb-1">{collection.title}</h3>
      <Link
        href={`/shop/${collection.handle}`}
        className="inline-flex items-center gap-1 text-sm md:text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-60 transition-opacity group/link"
      >
        Shop Now <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
      </Link>
    </div>
    {collection.image && (
      <div className={cn('absolute inset-0 flex items-center justify-center p-8 pt-20 md:pt-24', imageClassName)}>
        <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            className={imageObjectClass}
            priority
          />
        </div>
      </div>
    )}
  </div>
)

export const Collections = ({ collections }: Props) => {
  if (collections.length === 0) return null

  const [left, ...right] = collections

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Left: first collection — large */}
          <CollectionCard
            collection={left}
            className="min-h-[450px] md:min-h-[664px]"
          />

          {/* Right: remaining collections stacked */}
          {right.length > 0 && (
            <div className="flex flex-col gap-4 md:gap-6">
              {right.map((col) => (
                <CollectionCard
                  key={col.handle}
                  collection={col}
                  className="min-h-[300px] md:h-[320px] md:flex-1 justify-end"
                  textClassName="max-w-[50%]"
                  imageClassName="inset-y-0 right-0 w-full md:w-[70%] items-center justify-end p-4 md:p-8 pt-8"
                  imageObjectClass="object-contain object-right"
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Collections;
