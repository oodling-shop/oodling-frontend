'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/helpers';
import { Check, CreditCard, CaretDown } from '@phosphor-icons/react';
import { motion } from 'motion/react';

const Section = ({ title, children, className, delay = 0 }: { title?: string, children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={cn("mb-10 lg:mb-12", className)}
  >
    {title && <h3 className="text-xl font-medium text-slate-900 mb-6">{title}</h3>}
    {children}
  </motion.div>
);

export const CheckoutForm = () => {
  const [shippingMethod, setShippingMethod] = useState('free');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);

  return (
    <div className="w-full">
      {/* Login Prompt */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center lg:text-left"
      >
        <p className="text-slate-600">
          Returning customer? <button className="text-slate-900 font-medium hover:underline">Click here to login</button>
        </p>
      </motion.div>

      {/* Express Checkout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-slate-200 rounded-2xl p-8 mb-10 relative"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-xs font-medium text-slate-400 tracking-wider uppercase">
          Express Checkout
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-[#FFC439] h-12 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
          </button>
          <button className="bg-white border border-slate-200 h-12 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_Pay_Logo.svg" alt="GPay" className="h-5" />
          </button>
        </div>
      </motion.div>

      {/* Express Checkout footer/OR */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-12 text-center"
      >
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative">
          <span className="bg-white px-4 text-sm font-medium text-slate-400 uppercase tracking-widest">OR</span>
        </div>
      </motion.div>

      {/* Contact Information */}
      <Section title="Contact information" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">First name</label>
            <Input placeholder="First name" className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Last name</label>
            <Input placeholder="Last name" className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-700">Email address</label>
            <Input type="email" placeholder="Email address" className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl" />
          </div>
        </div>
      </Section>

      {/* Shipping Address */}
      <Section title="Shipping address" delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-700">Street address *</label>
            <Input placeholder="Street address" className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-700">Country *</label>
            <div className="relative">
              <select className="w-full h-12 border border-slate-200 focus:border-slate-900 focus:outline-none rounded-xl px-4 appearance-none text-slate-700">
                <option>Country</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
              </select>
              <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-700">Town / City *</label>
            <Input placeholder="Town / City" className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">State</label>
            <Input placeholder="State" className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Zip code</label>
            <Input placeholder="Zip code" className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl" />
          </div>
        </div>
        <div className="mt-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={useDifferentBilling} 
                onChange={() => setUseDifferentBilling(!useDifferentBilling)} 
              />
              <div className="w-5 h-5 border border-slate-200 rounded peer-checked:bg-slate-950 peer-checked:border-slate-950 transition-all"></div>
              <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 peer-checked:scale-100 transition-transform" size={12} weight="bold" />
            </div>
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Use a different billing address (optional)</span>
          </label>
        </div>
      </Section>

      {/* Shipping Method */}
      <Section title="Shipping method" delay={0.3}>
        <div className="space-y-3">
          {[
            { id: 'free', name: 'Free shipping', price: '$0.00' },
            { id: 'express', name: 'Express shipping', price: '+$15.00' },
          ].map((method) => (
            <label 
              key={method.id}
              className={cn(
                "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all",
                shippingMethod === method.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"
              )}
              onClick={() => setShippingMethod(method.id)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                  shippingMethod === method.id ? "border-slate-900" : "border-slate-300"
                )}>
                  {shippingMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
                </div>
                <span className="text-sm font-medium text-slate-700">{method.name}</span>
              </div>
              <span className="text-sm font-medium text-slate-900">{method.price}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Payment Information */}
      <Section title="Payment Information" delay={0.4}>
        <div className="space-y-3">
          {/* Card Option */}
          <div className={cn(
            "border rounded-xl transition-all overflow-hidden",
            paymentMethod === 'card' ? "border-slate-900" : "border-slate-200"
          )}>
            <label 
              className={cn(
                "flex items-center justify-between p-4 cursor-pointer",
                paymentMethod === 'card' ? "bg-slate-50" : "hover:bg-slate-50"
              )}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                  paymentMethod === 'card' ? "border-slate-900" : "border-slate-300"
                )}>
                  {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
                </div>
                <span className="text-sm font-medium text-slate-700">Pay by card</span>
              </div>
              <CreditCard size={20} className="text-slate-400" />
            </label>
            
            {paymentMethod === 'card' && (
              <div className="p-6 border-t border-slate-200 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 uppercase">Card number</label>
                  <Input placeholder="1234 1234 1234 1234" className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 uppercase">Expiry date</label>
                    <Input placeholder="MM/YY" className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 uppercase">CVC code</label>
                    <Input placeholder="CVC code" className="h-12 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-xl" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Monthly Option */}
          <label 
            className={cn(
              "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all",
              paymentMethod === 'monthly' ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"
            )}
            onClick={() => setPaymentMethod('monthly')}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                paymentMethod === 'monthly' ? "border-slate-900" : "border-slate-300"
              )}>
                {paymentMethod === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
              </div>
              <span className="text-sm font-medium text-slate-700">$30 monthly installment</span>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Klarna_Logo.svg/1200px-Klarna_Logo.svg.png" alt="Klarna" className="h-4" />
          </label>

          {/* PayPal Option */}
          <label 
            className={cn(
              "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all",
              paymentMethod === 'paypal' ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"
            )}
            onClick={() => setPaymentMethod('paypal')}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                paymentMethod === 'paypal' ? "border-slate-900" : "border-slate-300"
              )}>
                {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
              </div>
              <span className="text-sm font-medium text-slate-700">PayPal</span>
            </div>
          </label>
        </div>
      </Section>

      <p className="text-xs text-slate-500 text-center mb-8 leading-relaxed max-w-lg mx-auto">
        Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <button className="font-bold text-slate-900 hover:underline">privacy policy</button>.
      </p>

      <Button className="w-full h-16 bg-slate-950 text-white rounded-xl text-lg font-bold hover:bg-slate-800 transition-all shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.4)] active:scale-[0.99]">
        Place order
      </Button>
    </div>
  );
};
