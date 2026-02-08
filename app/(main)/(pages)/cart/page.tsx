import React from 'react';
import { Metadata } from 'next';
import { CartContent } from '@/components/cart/cart-content';

export const metadata: Metadata = {
  title: 'Cart | Nayzak Shop',
  description: 'View and manage your shopping cart. Checkout securely with Nayzak.',
};

const CartPage = () => {
  return <CartContent />;
};

export default CartPage;
