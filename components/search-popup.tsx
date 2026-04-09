'use client';

import { Container } from './container';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickSearchItems = ['Jumpsuits', 'Pants', 'Streetwear', 'Summer'];

export const SearchPopup = ({ isOpen, onClose }: SearchPopupProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSearch = () => {
    const query = inputRef.current?.value.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed inset-x-0 top-0 z-[60] bg-white pt-6 pb-12 sm:pb-16 shadow-xl"
          >
            <Container>
              {/* Header: Logo and Close Button */}
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <Link href="/" onClick={onClose}>
                  <Image
                    src="/images/logo.png"
                    alt="Nayzak Logo"
                    width={140}
                    height={40}
                    className="h-7 md:h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 text-foreground hover:scale-110 transition-transform cursor-pointer"
                  aria-label="Close search"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Centered Search Section */}
              <div className="max-w-3xl mx-auto w-full">
                <div className="relative">
                  <input
                    ref={inputRef}
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full h-16 pl-6 pr-16 text-xl md:text-2xl border border-black/20 rounded-lg focus:outline-none focus:border-black transition-colors bg-white"
                  />
                  <button
                    onClick={handleSearch}
                    aria-label="Submit search"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                  >
                    <MagnifyingGlass size={26} />
                  </button>
                </div>

                {/* Quick Search Below Input */}
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 justify-center">
                  <span className="text-[13px] md:text-sm text-[#888888]">Quick Search:</span>
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {quickSearchItems.map((item) => (
                      <Link
                        key={item}
                        href={`/search?q=${item.toLowerCase()}`}
                        onClick={onClose}
                        className="text-[13px] md:text-sm font-semibold hover:text-black transition-colors text-gray-700 decoration-1 hover:underline underline-offset-4"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
