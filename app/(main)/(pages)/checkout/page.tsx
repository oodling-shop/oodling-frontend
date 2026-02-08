import React from 'react';
import { Container } from '@/components/container';
import { CheckoutForm, OrderSummary } from '@/components/checkout';

export default function CheckoutPage() {
  return (
    <div className="py-12 md:py-20 bg-white">
      <Container>
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight">Checkout</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <CheckoutForm />
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <OrderSummary />
          </div>
        </div>
      </Container>
    </div>
  );
}
