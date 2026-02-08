'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/helpers';
import { useState } from 'react';
import { Asterisk } from '@phosphor-icons/react';

export default function SignInPage() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Left Side: Image Content */}
      <div className="relative hidden w-1/2 overflow-hidden bg-[#F3F3F3] md:block">
        {/* Logo Overlay */}
        <div className="absolute left-10 top-10 z-10 flex items-center gap-2">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
            <div className="flex items-center justify-center p-2">
               <Asterisk size={32} weight="bold" className="text-[#141718]" />
            </div>
          </Link>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          className="h-full w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop"
            alt="Sign In Hero"
            fill
            className="object-cover object-center grayscale-[0.1]"
            priority
          />
        </motion.div>
      </div>

      {/* Right Side: Sign In Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 md:px-16 lg:px-24 xl:px-32">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.1 }}
          className="mx-auto w-full max-w-[448px]"
        >
          {/* Mobile Logo */}
          <div className="mb-12 block md:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
               <Asterisk size={28} weight="bold" className="text-[#141718]" />
               <span className="text-xl font-bold tracking-tight text-[#141718]">NAYZAK</span>
            </Link>
          </div>

          <h1 className="mb-3 text-[40px] font-medium leading-[44px] tracking-tight text-[#141718]">
            Sign in
          </h1>
          <p className="mb-10 text-base text-[#6C7275]">
            Don't have an account yet?{' '}
            <Link href="/sign-up" className="font-semibold text-[#14ac4c] hover:underline transition-colors leading-[26px]">
              Sign up
            </Link>
          </p>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your username or email"
                  required
                  className="w-full border-b border-[#E8ECEF] bg-transparent py-4 text-base font-normal outline-none transition-all placeholder:text-[#A1A1A1] focus:border-[#141718]"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full border-b border-[#E8ECEF] bg-transparent py-4 text-base font-normal outline-none transition-all placeholder:text-[#A1A1A1] focus:border-[#141718]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex cursor-pointer items-center gap-3 group select-none">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className="h-5 w-5 rounded-sm border border-[#6C7275] transition-all peer-checked:bg-[#141718] peer-checked:border-[#141718] group-hover:border-[#141718]" />
                  <svg
                    className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-normal text-[#6C7275] transition-colors group-hover:text-[#141718]">
                  Remember me
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#141718] hover:text-[#141718]/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              className="h-[52px] w-full bg-[#141718] text-base font-semibold text-white hover:bg-[#141718]/90 rounded-md transition-all active:scale-[0.98]"
              size="lg"
            >
              Sign in
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
