'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/helpers';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
}

interface CartSummaryProps {
  subtotal: number;
  currency: string;
  checkoutUrl?: string;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'free', name: 'Free shipping', price: 0 },
  { id: 'express', name: 'Express shipping', price: 15 },
];

export const CartSummary = ({ subtotal, currency, checkoutUrl }: CartSummaryProps) => {
  const [selectedShipping, setSelectedShipping] = useState<string>('free');

  const shippingCost = SHIPPING_OPTIONS.find((opt) => opt.id === selectedShipping)?.price ?? 0;
  const total = subtotal + shippingCost;

  const fmt = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-6 md:p-8 sticky top-24 bg-white shadow-sm">
      <h2 className="text-2xl font-medium mb-8 text-slate-900 border-b border-slate-100 pb-4">Cart summary</h2>

      <div className="space-y-3 mb-10">
        {SHIPPING_OPTIONS.map((option) => (
          <label
            key={option.id}
            onClick={() => setSelectedShipping(option.id)}
            className={cn(
              'flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200',
              selectedShipping === option.id
                ? 'border-slate-950 bg-slate-50 shadow-sm'
                : 'border-slate-200 hover:border-slate-400'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
                selectedShipping === option.id ? 'border-slate-950' : 'border-slate-300'
              )}>
                <div className={cn(
                  'w-2.5 h-2.5 rounded-full bg-slate-950 transition-transform duration-200',
                  selectedShipping === option.id ? 'scale-100' : 'scale-0'
                )} />
              </div>
              <span className="text-sm font-medium text-slate-700">{option.name}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {option.price === 0 ? '$0.00' : `+${fmt(option.price)}`}
            </span>
          </label>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center text-slate-600">
          <span className="text-sm">Subtotal</span>
          <span className="font-semibold text-slate-900">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-slate-100">
          <span className="text-slate-900">Total</span>
          <span className="text-slate-900">{fmt(total)}</span>
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={!checkoutUrl}
        className="w-full mt-10 h-14 text-base font-bold bg-slate-950 text-white rounded-xl hover:bg-slate-800 transition-all shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Checkout
      </Button>

      <p className="text-center text-xs text-slate-400 mt-6 px-4">
        Secure checkout powered by Shopify.
      </p>
    </div>
  );
};
