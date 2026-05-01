'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/cart-provider';
import { useAuth } from '@/providers/auth-provider';
import { showErrorNotification, showSuccessNotification } from '@/components/ui/notification';

interface AddToCartButtonProps {
  variantId: string | null;
  availableForSale?: boolean;
  quantity?: number;
  productTitle?: string;
}

export function AddToCartButton({
  variantId,
  availableForSale = false,
  quantity = 1,
  productTitle,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isUnavailable = variantId === null || !availableForSale;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push('/sign-in');
      return;
    }
    if (!variantId || !availableForSale) return;
    startTransition(async () => {
      try {
        await addItem(variantId, quantity);
        if (productTitle) {
          showSuccessNotification(`${productTitle} was successfully added to your cart.`);
        }
      } catch (err) {
        showErrorNotification(err instanceof Error ? err.message : 'Failed to add item to cart');
      }
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending || isUnavailable}
      className="h-14 w-full bg-[#141718] text-white font-semibold hover:bg-[#141718]/90 transition-all active:scale-[0.98] disabled:opacity-60"
    >
      {isPending ? 'Adding...' : isUnavailable ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}
