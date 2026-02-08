'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { cn } from '@/helpers';

interface CartItemProps {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  details: string;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export const CartItem = ({
  id,
  name,
  image,
  price,
  quantity,
  details,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 py-8 border-b border-slate-100 gap-6 md:gap-0 items-center group animate-in fade-in duration-500">
      <div className="md:col-span-6 flex items-center gap-4 lg:gap-6">
        <div className="relative w-24 h-24 lg:w-28 lg:h-28 bg-slate-50 flex-shrink-0 rounded-lg overflow-hidden border border-slate-100">
          <Image 
            src={image} 
            alt={name} 
            fill 
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-lg text-slate-900 group-hover:text-black transition-colors">{name}</h3>
          <p className="text-sm text-slate-500">{details}</p>
          <button 
            onClick={() => onRemove(id)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-red-500 transition-all mt-2 w-fit"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove</span>
          </button>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-start md:justify-center">
        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
          <button 
            disabled={quantity <= 1}
            onClick={() => onUpdateQuantity(id, -1)}
            className="p-2.5 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold select-none">{quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(id, 1)}
            className="p-2.5 hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="md:col-span-2 text-left md:text-right">
        <span className="md:hidden text-sm text-slate-400 mr-2 font-normal text-[12px] uppercase tracking-wider">Price</span>
        <span className="font-medium text-lg text-slate-900">${price.toFixed(2)}</span>
      </div>

      <div className="md:col-span-2 text-right">
        <span className="md:hidden text-sm text-slate-400 mr-2 font-normal text-[12px] uppercase tracking-wider">Subtotal</span>
        <span className="font-semibold text-lg text-slate-900">${(price * quantity).toFixed(2)}</span>
      </div>
    </div>
  );
};
