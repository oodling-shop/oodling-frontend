'use client';

import { useTransition } from 'react';
import { useCart } from '@/providers/cart-provider';

interface AddToCartButtonProps {
  variantId: string;
}

export function AddToCartButton({ variantId }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(async () => {
      await addItem(variantId, 1);
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending}
      className="h-14 w-full bg-[#141718] text-white font-semibold rounded-lg hover:bg-[#141718]/90 transition-all active:scale-[0.98] disabled:opacity-60"
    >
      {isPending ? 'Adding...' : 'Add to cart'}
    </button>
  );
}
