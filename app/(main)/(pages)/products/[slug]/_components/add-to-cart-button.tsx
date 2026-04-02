'use client';

import { useTransition } from 'react';
import { useCart } from '@/providers/cart-provider';

interface AddToCartButtonProps {
  variantId: string | null;
  quantity?: number;
}

export function AddToCartButton({ variantId, quantity = 1 }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isPending, startTransition] = useTransition();

  const isUnavailable = variantId === null;

  const handleAddToCart = () => {
    if (!variantId) return;
    startTransition(async () => {
      await addItem(variantId, quantity);
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending || isUnavailable}
      className="h-14 w-full bg-[#141718] text-white font-semibold rounded-lg hover:bg-[#141718]/90 transition-all active:scale-[0.98] disabled:opacity-60"
    >
      {isPending ? 'Adding...' : isUnavailable ? 'Unavailable' : 'Add to Cart'}
    </button>
  );
}
