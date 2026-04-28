'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Asterisk, ArrowLeft } from '@phosphor-icons/react';
import { requestPasswordReset } from '@/lib/shopify/auth-actions';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const result = await requestPasswordReset(email);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white">
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
            alt="Forgot Password Hero"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
      </div>

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
              <span className="text-xl font-bold tracking-tight text-[#141718]">Oodling</span>
            </Link>
          </div>

          <Link href="/sign-in" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#6C7275] hover:text-[#141718] transition-colors">
            <ArrowLeft size={16} />
            {t('backToSignIn')}
          </Link>

          <h1 className="mb-3 text-[40px] font-medium leading-[44px] tracking-tight text-[#141718]">
            {t('title')}
          </h1>
          <p className="mb-10 text-base text-[#6C7275]">
            {t('description')}
          </p>

          {error && (
            <p className="mb-6 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
          )}

          {success ? (
            <div className="bg-green-50 px-6 py-8 rounded-xl text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">{t('successTitle')}</h3>
              <p className="text-green-700 mb-6">{t('successDescription')}</p>
              <Button asChild className="w-full bg-green-800 hover:bg-green-900 text-white">
                <Link href="/sign-in">{t('backToSignIn')}</Link>
              </Button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative border-b border-[#E8ECEF]">
                <Input
                  name="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  required
                  className="w-full bg-transparent py-4 text-base font-normal outline-none transition-all placeholder:text-[#6C7275] focus:border-[#141718] border-none shadow-none h-auto px-0 rounded-none focus-visible:ring-0"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-[52px] cursor-pointer w-full bg-[#141718] text-base font-semibold text-white hover:bg-[#141718]/90 rounded-md transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {isLoading ? t('submitting') : t('submit')}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
