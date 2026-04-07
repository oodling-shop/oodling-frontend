'use client';

import { useTransition } from 'react';
import { useCart } from '@/providers/cart-provider';
import { showSuccessNotification } from '@/components/ui/notification';

interface AddToCartButtonProps {
  variantId: string | null;
  quantity?: number;
  productTitle?: string;
}

export function AddToCartButton({ variantId, quantity = 1, productTitle }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isPending, startTransition] = useTransition();

  const isUnavailable = variantId === null;

  const handleAddToCart = () => {
    if (!variantId) return;
    startTransition(async () => {
      await addItem(variantId, quantity);
      if (productTitle) {
        showSuccessNotification(`${productTitle} was successfully added to your cart.`);
      }
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending || isUnavailable}
      className="h-14 w-full bg-[#141718] text-white font-semibold hover:bg-[#141718]/90 transition-all active:scale-[0.98] disabled:opacity-60"
    >
      {isPending ? 'Adding...' : isUnavailable ? 'Unavailable' : 'Add to Cart'}
    </button>
  );
}
