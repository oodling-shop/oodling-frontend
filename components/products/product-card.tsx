import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/helpers/cn';

export interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  originalPrice?: string;
  rating: number;
}

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard = ({ product, layout = 'grid' }: ProductCardProps) => {
  if (layout === 'list') {
    return (
      <div className="group flex gap-8 py-6 border-b border-neutral-100 last:border-0 items-center">
        {/* Image Container */}
        <div className="relative w-48 aspect-[3/4] overflow-hidden bg-[#F3F5F7] flex-shrink-0 rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="192px"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-3 flex-1">
          {/* Stars */}
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-4",
                  i < product.rating ? "fill-[#FFAB00] text-[#FFAB00]" : "text-neutral-200"
                )}
              />
            ))}
          </div>

          {/* Name */}
          <h3 className="text-xl font-bold text-[#141718]">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#141718]">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-neutral-400 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>

          {/* Description Placeholder */}
          <p className="text-neutral-500 line-clamp-2 max-w-xl text-sm">
            High-quality product crafted with precision and care, perfect for your daily needs and style.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-3">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F3F5F7]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1.5 mt-1">
        {/* Stars */}
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-3.5",
                i < product.rating ? "fill-[#FFAB00] text-[#FFAB00]" : "text-neutral-200"
              )}
            />
          ))}
        </div>

        {/* Name */}
        <h3 className="text-sm md:text-base font-semibold text-[#141718]">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-semibold text-[#141718]">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs md:text-sm text-neutral-400 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
