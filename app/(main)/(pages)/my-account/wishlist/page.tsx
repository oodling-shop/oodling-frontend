'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/products/product-card';
import type { ShopifyProduct } from '@/lib/shopify/types';

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      try {
        const res = await fetch('/api/wishlist?includeProducts=true', { cache: 'no-store' });
        if (!res.ok) return;

        const data = (await res.json()) as { products?: ShopifyProduct[] };
        if (!cancelled) {
          setProducts(data.products ?? []);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadWishlist();

    return () => {
      cancelled = true;
    };
  }, []);

  async function removeProduct(productId: string) {
    if (pendingProductId) return;

    setPendingProductId(productId);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          action: 'remove',
        }),
      });

      if (!res.ok) return;

      setProducts((current) => current.filter((product) => product.id !== productId));
    } finally {
      setPendingProductId(null);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-[#6C7275]">{t('loading')}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-[#6C7275]">
        <p className="text-lg">{t('empty')}</p>
        <Link href="/products" className="mt-4 inline-block text-[#141718] font-semibold hover:underline">
          {t('browse')}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-[#6C7275] mb-6">{t('savedItems', { count: products.length })}</p>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col gap-4">
            <ProductCard product={product} />
            <button
              type="button"
              onClick={() => removeProduct(product.id)}
              disabled={pendingProductId === product.id}
              className="self-start text-sm font-semibold text-[#141718] hover:underline disabled:opacity-50"
            >
              {pendingProductId === product.id ? t('removing') : t('remove')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
