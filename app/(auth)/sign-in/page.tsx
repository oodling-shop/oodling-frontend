'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Asterisk, Eye, EyeSlash } from '@phosphor-icons/react';
import { login } from '@/lib/shopify/customer';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/my-account');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white">
      {/* Left Side: Image Content */}
      <div className="relative hidden w-1/2 overflow-hidden bg-[#F3F3F3] md:block">
        <div className="absolute left-10 top-10 z-10 flex items-center gap-2">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
            <div className="flex items-center justify-center p-2">
              <Asterisk size={32} weight="bold" className="text-[#141718]" />
            </div>
          </Link>
        </div>
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          className="h-full w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=1974&auto=format&fit=crop"
            alt="Sign In Hero"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
      </div>

      {/* Right Side: Sign In Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 md:px-16 lg:px-24 xl:px-40">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.1 }}
          className="mx-auto w-full max-w-[448px]"
        >
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
            Don&apos;t have an account yet?{' '}
            <Link href="/sign-up" className="font-semibold text-[#141718] hover:underline transition-colors leading-[26px]">
              Sign up
            </Link>
          </p>

          {error && (
            <p className="mb-6 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative border-b border-[#E8ECEF]">
              <Input
                name="email"
                type="email"
                placeholder="Your email address"
                required
                className="w-full bg-transparent py-4 text-base font-normal outline-none transition-all placeholder:text-[#6C7275] focus:border-[#141718] border-none shadow-none h-auto px-0 rounded-none focus-visible:ring-0"
              />
            </div>

            <div className="relative border-b border-[#E8ECEF]">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                className="w-full bg-transparent py-4 text-base font-normal outline-none transition-all placeholder:text-[#6C7275] focus:border-[#141718] border-none shadow-none h-auto px-0 rounded-none focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#6C7275] hover:text-[#141718] hover:bg-transparent h-auto w-auto p-0"
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </Button>
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
                <span className="text-sm font-normal text-[#6C7275]">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-semibold text-[#141718] hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-[52px] w-full bg-[#141718] text-base font-semibold text-white hover:bg-[#141718]/90 rounded-md transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
