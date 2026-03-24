'use client';

import React from 'react';
import { Container } from '@/components/container';
import { CartGoal } from '@/components/cart/cart-goal';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { CouponSection } from '@/components/cart/coupon-section';
import { useCart } from '@/providers/cart-provider';

export const CartContent = () => {
  const { cart, isLoading, updateItem, removeItem } = useCart();

  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const subtotalAmount = cart?.cost.totalAmount.amount ?? '0';
  const subtotal = parseFloat(subtotalAmount);
  const currency = cart?.cost.totalAmount.currencyCode ?? 'USD';

  const totalRequiredForFreeShipping = 200;
  const amountToFreeShipping = Math.max(0, totalRequiredForFreeShipping - subtotal);

  const handleUpdateQuantity = async (lineId: string, delta: number) => {
    const line = lines.find((l) => l.id === lineId);
    if (!line) return;
    const newQty = Math.max(1, line.quantity + delta);
    await updateItem(lineId, newQty);
  };

  const handleRemove = async (lineId: string) => {
    await removeItem(lineId);
  };

  return (
    <div className="py-12 md:py-24 bg-white overflow-x-hidden">
      <Container>
        <div className="flex flex-col items-center mb-12 md:mb-20 space-y-10">
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-slate-900 animate-in slide-in-from-top-4 duration-700">
            Cart
          </h1>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 w-full flex justify-center">
            <CartGoal
              amountRemaining={amountToFreeShipping}
              totalRequired={totalRequiredForFreeShipping}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
            {isLoading && lines.length === 0 ? (
              <div className="py-20 text-center text-slate-400">Loading cart...</div>
            ) : lines.length > 0 ? (
              <>
                <div className="hidden md:grid grid-cols-12 pb-6 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>
                <div className="flex flex-col">
                  {lines.map((line) => (
                    <CartItem
                      key={line.id}
                      line={line}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
                <CouponSection />
              </>
            ) : (
              <div className="py-20 text-center border-y border-slate-100 flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <p className="text-4xl text-slate-300">🛒</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-medium text-slate-900">Your cart is empty</h3>
                  <p className="text-slate-500">Looks like you haven&#39;t added anything yet.</p>
                </div>
                <a
                  href="/products"
                  className="mt-4 px-8 py-3 bg-slate-950 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Start Shopping
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
            <CartSummary subtotal={subtotal} currency={currency} checkoutUrl={cart?.checkoutUrl} />
          </div>
        </div>
      </Container>
    </div>
  );
};
