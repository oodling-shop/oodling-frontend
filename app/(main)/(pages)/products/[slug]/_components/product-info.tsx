'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, HelpCircle, Share2, Calendar, Truck, ChevronDown } from 'lucide-react';
import { AddToCartButton } from './add-to-cart-button';
import { AskQuestionForm } from './ask-question-form';
import { useAuth } from '@/providers/auth-provider';
import type { ShopifyProductDetail } from '@/lib/shopify/types';

const WISHLIST_KEY = 'oodling_wishlist';

function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function toggleWishlistItem(productId: string): boolean {
  const list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx === -1) {
    list.push(productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    return true;
  } else {
    list.splice(idx, 1);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    return false;
  }
}

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

  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [selection, setSelection] = useState<Record<string, string>>(initialSelection);
  const [quantity, setQuantity] = useState(1);
  const [openOption, setOpenOption] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [showAskForm, setShowAskForm] = useState(false);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Sync wishlist state from localStorage on mount
  useEffect(() => {
    setWishlisted(getWishlist().includes(product.id));
  }, [product.id]);

  function handleWishlist() {
    if (!isLoggedIn) {
      router.push('/sign-in');
      return;
    }
    const added = toggleWishlistItem(product.id);
    setWishlisted(added);
  }

  async function handleShare() {
    const url = `${window.location.origin}/products/${product.handle}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }

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
  const optionKeys = Object.keys(optionMap);

  return (
    <div className="flex flex-col gap-0 px-4 py-5">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-[#141718] leading-tight mb-3">{product.title}</h1>

      {/* Short description */}
      {shortDesc && (
        <p className="text-sm text-[#6C7275] leading-relaxed mb-4">{shortDesc}</p>
      )}

      {/* Star rating — static placeholder */}
      <div className="flex items-center gap-2 mb-4">
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
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl font-bold text-[#141718]">{fmt(currentPrice)}</span>
        {showCompareAt && (
          <span className="text-lg text-[#6C7275] line-through">{fmt(compareAtAmount)}</span>
        )}
      </div>

      <hr className="border-[#E8ECEF] mb-5" />

      {/* Variant selectors - Dropdown style */}
      {hasOptions && (
        <div className="flex flex-col mb-5">
          {optionKeys.map((optionName, idx) => {
            const values = optionMap[optionName];
            const selectedValue = selection[optionName];
            const isOpen = openOption === optionName;

            return (
              <div key={optionName}>
                <button
                  type="button"
                  onClick={() => setOpenOption(isOpen ? null : optionName)}
                  className="w-full flex items-center justify-between py-3.5 text-left"
                >
                  <span className="text-base font-medium text-[#141718]">{optionName}</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="flex flex-wrap gap-2 pb-4">
                    {values.map((val) => {
                      const isSelected = selection[optionName] === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setSelection((prev) => ({ ...prev, [optionName]: val }));
                            setOpenOption(null);
                          }}
                          className={[
                            'px-5 py-2.5 text-sm rounded border transition-colors',
                            isSelected
                              ? 'bg-[#141718] text-white border-[#141718]'
                              : 'bg-white text-[#141718] border-[#E8ECEF] hover:border-[#141718]',
                          ].join(' ')}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}
                {idx < optionKeys.length - 1 && <hr className="border-[#E8ECEF]" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Size guide + stock indicator */}
      {firstAvailable?.availableForSale && (
        <div className="flex items-center gap-6 text-sm mb-5">
          <a href="#" className="flex items-center gap-1.5 text-[#141718] font-medium uppercase text-xs tracking-wide">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="10" rx="1" />
              <line x1="7" y1="7" x2="7" y2="17" />
              <line x1="12" y1="7" x2="12" y2="12" />
              <line x1="17" y1="7" x2="17" y2="17" />
            </svg>
            SIZE GUIDE
          </a>
          {/* TODO: wire to inventory count when admin API is available */}
          <span className="flex items-center gap-1.5 text-[#141718] uppercase text-xs tracking-wide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            ONLY 2 LEFT
          </span>
        </div>
      )}

      {/* Quantity stepper */}
      <div className="flex items-center bg-[#F3F5F7] w-full justify-between px-5 py-3.5 mb-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-8 h-8 flex items-center justify-center text-[#141718] text-xl hover:opacity-70 transition-opacity"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="text-base font-medium text-[#141718]">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(10, q + 1))}
          className="w-8 h-8 flex items-center justify-center text-[#141718] text-xl hover:opacity-70 transition-opacity"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Add to Cart */}
      <AddToCartButton variantId={variantId} quantity={quantity} productTitle={product.title} />

      {/* Action links */}
      <div className="flex items-center justify-between text-sm text-[#141718] py-4">
        <button
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          onClick={handleWishlist}
        >
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} /> Wishlist
        </button>
        <button
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          onClick={() => { setShowAskForm((v) => !v); setQuestionSubmitted(false); }}
        >
          <HelpCircle size={18} /> Ask question
        </button>
        <button
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          onClick={handleShare}
        >
          <Share2 size={18} /> {shareCopied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Ask a question form */}
      {showAskForm && !questionSubmitted && (
        <AskQuestionForm
          productId={product.id}
          onClose={() => setShowAskForm(false)}
          onSuccess={() => { setQuestionSubmitted(true); setShowAskForm(false); }}
        />
      )}
      {questionSubmitted && (
        <p className="text-sm text-green-600 border-t border-[#E8ECEF] pt-4 mt-2">
          Thanks! Your question has been submitted.
        </p>
      )}

      <hr className="border-[#E8ECEF] mb-5" />

      {/* Delivery + Shipping */}
      <div className="flex flex-col gap-3 text-sm mb-5">
        {/* TODO: wire to real delivery estimate */}
        <div className="flex items-center gap-3 text-[#141718]">
          <Calendar size={18} className="shrink-0" />
          <span><strong>Delivery:</strong> 10 – 12 Oct, 2023</span>
        </div>
        <div className="flex items-center gap-3 text-[#141718]">
          <Truck size={18} className="shrink-0" />
          <span><strong>Shipping:</strong> Free for orders above $100</span>
        </div>
      </div>

      <hr className="border-[#E8ECEF] mb-5" />

      {/* Meta info */}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm mb-5">
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
