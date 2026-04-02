'use client';

import { useState, useMemo } from 'react';
import { Heart, HelpCircle, Share2, Calendar, Truck } from 'lucide-react';
import { AddToCartButton } from './add-to-cart-button';
import type { ShopifyProductDetail } from '@/lib/shopify/types';

interface ProductInfoProps {
  product: ShopifyProductDetail;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const variants = useMemo(
    () => product.variants.edges.map((e) => e.node),
    [product.variants.edges]
  );
  const firstAvailable = useMemo(
    () => variants.find((v) => v.availableForSale) ?? variants[0],
    [variants]
  );

  // Build option map: { Color: ['Red', 'Blue'], Size: ['S', 'M', 'L'] }
  const optionMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const variant of variants) {
      for (const opt of variant.selectedOptions) {
        if (!map[opt.name]) map[opt.name] = [];
        if (!map[opt.name].includes(opt.value)) map[opt.name].push(opt.value);
      }
    }
    return map;
  }, [variants]);

  // Initial selection: first available variant's options
  const initialSelection = useMemo(() => {
    const sel: Record<string, string> = {};
    for (const opt of firstAvailable?.selectedOptions ?? []) {
      sel[opt.name] = opt.value;
    }
    return sel;
  }, [firstAvailable]);

  const [selection, setSelection] = useState<Record<string, string>>(initialSelection);
  const [quantity, setQuantity] = useState(1);

  // Find the variant matching all current selections
  const activeVariant = useMemo(() => {
    return variants.find((v) =>
      v.selectedOptions.every((opt) => selection[opt.name] === opt.value)
    ) ?? null;
  }, [variants, selection]);

  const variantId = activeVariant?.id ?? null;

  // Prices
  const currentPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtAmount = parseFloat(product.compareAtPriceRange.maxVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;

  const fmt = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  const showCompareAt = compareAtAmount > currentPrice;

  // SKU display — uses last 8 chars of variant GID as display approximation
  // TODO: use variant.sku once added to fragment
  const skuSource = variantId ?? firstAvailable?.id ?? '';
  const sku = skuSource.slice(-8).toUpperCase();

  // Short description
  const shortDesc = product.description.slice(0, 150);

  const hasOptions = Object.keys(optionMap).length > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-[#6C7275]">
        <span>Home</span>
        <span>›</span>
        {/* TODO: wire middle segment to collection once collection query is added */}
        <span>Clothing</span>
        <span>›</span>
        <span className="text-[#141718]">{product.productType || product.title}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-[#141718] leading-tight">{product.title}</h1>

      {/* Short description */}
      {shortDesc && (
        <p className="text-sm text-[#6C7275] leading-relaxed">{shortDesc}</p>
      )}

      {/* Star rating — static placeholder */}
      <div className="flex items-center gap-2">
        <div className="flex text-[#FF8A00]">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-[#6C7275]">23 Reviews</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-[#141718]">{fmt(currentPrice)}</span>
        {showCompareAt && (
          <span className="text-lg text-[#6C7275] line-through">{fmt(compareAtAmount)}</span>
        )}
      </div>

      {/* Variant selectors */}
      {hasOptions &&
        Object.entries(optionMap).map(([optionName, values]) => (
          <div key={optionName} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#141718]">{optionName}</label>
            <div className="relative">
              <select
                value={selection[optionName] ?? ''}
                onChange={(e) =>
                  setSelection((prev) => ({ ...prev, [optionName]: e.target.value }))
                }
                className="w-full h-11 px-4 pr-10 border border-[#E8ECEF] rounded text-sm text-[#141718] bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#141718]"
              >
                {values.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#141718]"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        ))}

      {/* Size guide + stock indicator */}
      {firstAvailable?.availableForSale && (
        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="flex items-center gap-1 text-[#141718] font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="10" rx="1" />
              <line x1="7" y1="7" x2="7" y2="17" />
              <line x1="12" y1="7" x2="12" y2="12" />
              <line x1="17" y1="7" x2="17" y2="17" />
            </svg>
            SIZE GUIDE
          </a>
          {/* TODO: wire to inventory count when admin API is available */}
          <span className="flex items-center gap-1 text-[#141718]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            ONLY 2 LEFT
          </span>
        </div>
      )}

      {/* Quantity stepper */}
      <div className="flex items-center border border-[#E8ECEF] rounded w-fit">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-11 h-11 flex items-center justify-center text-[#141718] hover:bg-[#F3F5F7] transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-12 text-center text-sm font-medium text-[#141718]">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(10, q + 1))}
          className="w-11 h-11 flex items-center justify-center text-[#141718] hover:bg-[#F3F5F7] transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Add to Cart */}
      <AddToCartButton variantId={variantId} quantity={quantity} />

      {/* Action links */}
      <div className="flex items-center gap-6 text-sm text-[#141718]">
        <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Heart size={16} /> Wishlist
        </button>
        <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <HelpCircle size={16} /> Ask question
        </button>
        <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Share2 size={16} /> Share
        </button>
      </div>

      <hr className="border-[#E8ECEF]" />

      {/* Delivery + Shipping */}
      <div className="flex flex-col gap-3 text-sm">
        {/* TODO: wire to real delivery estimate */}
        <div className="flex items-center gap-3 text-[#141718]">
          <Calendar size={16} className="shrink-0" />
          <span><strong>Delivery:</strong> 10 – 12 Oct, 2023</span>
        </div>
        <div className="flex items-center gap-3 text-[#141718]">
          <Truck size={16} className="shrink-0" />
          <span><strong>Shipping:</strong> Free for orders above $100</span>
        </div>
      </div>

      <hr className="border-[#E8ECEF]" />

      {/* Meta info */}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-[#6C7275] uppercase tracking-wide text-xs">SKU</dt>
        <dd className="text-[#141718]">{sku}</dd>
        <dt className="text-[#6C7275] uppercase tracking-wide text-xs">CATEGORY</dt>
        <dd className="text-[#141718]">{product.productType || '—'}</dd>
        <dt className="text-[#6C7275] uppercase tracking-wide text-xs">TAGS</dt>
        <dd className="text-[#141718]">{product.tags.length > 0 ? product.tags.join(', ') : '—'}</dd>
      </dl>
    </div>
  );
}
