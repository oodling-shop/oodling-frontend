'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const [wishlistHandles, setWishlistHandles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      if (stored) setWishlistHandles(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  if (wishlistHandles.length === 0) {
    return (
      <div className="py-12 text-center text-[#6C7275]">
        <p className="text-lg">{t('empty')}</p>
        <a href="/products" className="mt-4 inline-block text-[#141718] font-semibold hover:underline">
          {t('browse')}
        </a>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-[#6C7275] mb-6">{t('savedItems', { count: wishlistHandles.length })}</p>
      <div className="flex flex-col gap-4">
        {wishlistHandles.map((handle) => (
          <a
            key={handle}
            href={`/products/${handle}`}
            className="py-4 border-b border-[#E8ECEF] text-[#141718] font-medium hover:underline"
          >
            {handle}
          </a>
        ))}
      </div>
    </div>
  );
}
