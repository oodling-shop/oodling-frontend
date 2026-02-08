'use client';

import React, { useState } from 'react';
import { Container } from '@/components/container';
import { CartGoal } from '@/components/cart/cart-goal';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { CouponSection } from '@/components/cart/coupon-section';

// Mock data
const INITIAL_CART_ITEMS = [
  {
    id: 1,
    name: 'AirBrags® Sneakers',
    image: '/images/shoes/nike.png',
    price: 80.00,
    quantity: 1,
    details: 'Size: 2XL, Color: Green',
  },
  {
    id: 2,
    name: 'Luxury Kanzo Shoes',
    image: '/images/shoes/airkan_ii.png',
    price: 80.00,
    quantity: 1,
    details: 'Size: 2XL, Color: Green',
  },
];

export const CartContent = () => {
  const [items, setItems] = useState(INITIAL_CART_ITEMS);
  const totalRequiredForFreeShipping = 200;
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const amountToFreeShipping = Math.max(0, totalRequiredForFreeShipping - subtotal);

  const handleUpdateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const handleRemove = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="py-12 md:py-24 bg-white overflow-x-hidden">
      <Container>
        {/* Header Section */}
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
          {/* Cart Items Section */}
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
            {items.length > 0 ? (
              <>
                <div className="hidden md:grid grid-cols-12 pb-6 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="flex flex-col">
                  {items.map((item) => (
                    <CartItem 
                      key={item.id}
                      {...item}
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
                  <p className="text-slate-500">Looks like you haven't added anything to your cart yet.</p>
                </div>
                <a 
                  href="/shop" 
                  className="mt-4 px-8 py-3 bg-slate-950 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Start Shopping
                </a>
              </div>
            )}
          </div>

          {/* Cart Summary Section */}
          <div className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
            <CartSummary subtotal={subtotal} />
          </div>
        </div>
      </Container>
    </div>
  );
};
