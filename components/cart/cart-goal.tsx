'use client';

import React from 'react';
import { Truck } from 'lucide-react';
import { cn } from '@/helpers';

interface CartGoalProps {
  amountRemaining: number;
  totalRequired: number;
}

export const CartGoal = ({ amountRemaining, totalRequired }: CartGoalProps) => {
  const percentage = Math.min(100, Math.max(0, ((totalRequired - amountRemaining) / totalRequired) * 100));

  return (
    <div className="w-full max-w-xl text-center">
      <p className="text-sm md:text-base mb-6 text-slate-900">
        Shop for <span className="font-semibold">${amountRemaining}</span> more to enjoy <span className="font-semibold uppercase">FREE Shipping</span>
      </p>
      <div className="relative h-2 w-full bg-slate-100 rounded-full">
        <div 
          className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out" 
          style={{ width: `${percentage}%` }} 
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 bg-white border border-slate-200 p-1.5 rounded-md shadow-sm z-10 hidden md:flex items-center justify-center transition-all duration-700 ease-out"
          style={{ left: `${percentage}%`, transform: `translate(-50%, -50%)` }}
        >
          <Truck className="w-4 h-4 text-slate-800" />
        </div>
      </div>
    </div>
  );
};
