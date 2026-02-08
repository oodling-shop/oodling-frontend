'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash, Minus, Plus, Tag } from '@phosphor-icons/react';
import { cn } from '@/helpers';

export const OrderSummary = () => {
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState('');
  
  const price: number = 50.00;
  const discount: number = 8.00;
  const shipping: number = 0;
  const subtotal: number = (price * quantity);
  const total: number = subtotal - discount + shipping;

  return (
    <div className="border border-slate-200 rounded-3xl p-6 md:p-8 bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)]">
      <h2 className="text-2xl font-medium text-slate-900 mb-8 pb-4 border-b border-slate-100">Order summary</h2>
      
      {/* Product Item */}
      <div className="flex gap-4 mb-8">
        <div className="relative w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" 
            alt="AirBags® Sneakers" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">AirBags® Sneakers</h4>
              <p className="text-xs text-slate-500">Size: 42, Color: Green</p>
            </div>
            <span className="text-sm font-bold text-slate-900">${price.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 flex items-center justify-center hover:bg-slate-50 rounded transition-colors"
              >
                <Minus size={12} weight="bold" />
              </button>
              <span className="text-xs font-bold w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 flex items-center justify-center hover:bg-slate-50 rounded transition-colors"
              >
                <Plus size={12} weight="bold" />
              </button>
            </div>
            <button className="text-slate-400 hover:text-red-500 transition-colors">
              <Trash size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Coupon Code */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Input 
            placeholder="Input" 
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl px-4" 
          />
        </div>
        <Button className="h-12 bg-slate-950 text-white px-8 rounded-xl font-bold hover:bg-slate-800 transition-all">
          Apply
        </Button>
      </div>

      {/* Breakdown */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-600">
            <Tag size={16} className="text-slate-400" />
            <span className="text-sm">Nayzak10</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-emerald-600">-${discount.toFixed(2)}</span>
            <button className="text-xs font-medium text-emerald-600 hover:underline">[Remove]</button>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-slate-600">
          <span className="text-sm">Shipping</span>
          <span className="text-sm font-bold text-slate-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between items-center text-slate-600">
          <span className="text-sm">Subtotal</span>
          <span className="text-sm font-bold text-slate-900">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xl font-bold text-slate-900">Total</span>
        <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};
