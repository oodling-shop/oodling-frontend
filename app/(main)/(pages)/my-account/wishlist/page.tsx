'use client';

import { useEffect, useState } from 'react';

export default function WishlistPage() {
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
        <p className="text-lg">Your wishlist is empty.</p>
        <a href="/products" className="mt-4 inline-block text-[#141718] font-semibold hover:underline">
          Browse products
        </a>
      </div>
    );
  }

  // For now render handles — full product data fetch can be wired in a follow-up
  return (
    <div className="w-full">
      <p className="text-[#6C7275] mb-6">{wishlistHandles.length} saved item(s)</p>
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
