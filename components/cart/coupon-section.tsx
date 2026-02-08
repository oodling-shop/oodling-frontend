'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export const CouponSection = () => {
  return (
    <div className="mt-12 md:mt-16 bg-slate-50/50 p-6 md:p-8 rounded-2xl border border-slate-100">
      <h3 className="text-xl font-medium mb-2 text-slate-900">Have a coupon?</h3>
      <p className="text-sm text-slate-500 mb-6">Add your code for an instant cart discount</p>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Input code" 
            className="w-full h-12 px-4 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-950 transition-all placeholder:text-slate-400"
          />
        </div>
        <Button className="h-12 px-8 text-sm font-semibold bg-white text-slate-950 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-950 transition-all active:scale-[0.98]">
          Apply
        </Button>
      </div>
    </div>
  );
};
