"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container } from '../container';
import { Mail } from 'lucide-react';
import Image from 'next/image';

export const Newsletter = () => {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="rounded-[32px] md:rounded-[40px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 w-full shadow-sm">
          
          {/* Right Side (Desktop) / Top Side (Mobile): Image and Glow */}
          <div className="order-1 lg:order-2 relative flex items-center justify-center p-8 md:p-12 lg:p-0 overflow-hidden min-h-[350px] bg-[#FFEFEB]">
             {/* Gradient Background matching the design (Pinkish/Orange to White/Blueish) 
                 The provided image shows a soft gradient. We'll use a CSS gradient. */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#F4F7FC] via-[#FFEFEB] to-[#FFDFC4] opacity-100" />
             
             {/* Subtle blobs if needed, but the linear gradient might be cleaner as per design */}
             <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-[#A3C4F3]/20 blur-[80px] rounded-full mix-blend-multiply" />
                <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-[#FFD1C1]/30 blur-[80px] rounded-full mix-blend-multiply" />
             </div>

            <div className="relative w-full h-[280px] md:h-[400px] lg:h-full lg:w-[120%] lg:-mr-[10%] flex items-center justify-center z-10">
              <div className="relative w-full h-full transition-transform duration-700 ease-out hover:scale-105">
                <Image
                  src="/images/shoes/airkan_ii.png"
                  alt="Nike Basketball Shoe"
                  fill
                  className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Left Side (Desktop) / Bottom Side (Mobile): Content */}
          <div className="order-2 lg:order-1 bg-white p-8 md:p-16 lg:p-20 flex flex-col justify-center gap-8 lg:gap-10 z-10">
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-[1.15]">
                Join our newsletter. <br />
                <span className="block md:inline lg:block">Enjoy big discounts.</span>
              </h2>
            </div>
            
            <form className="w-full max-w-md mx-auto lg:mx-0 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex items-center border-b border-black/10 pb-2 group transition-all focus-within:border-black/30">
                <Mail className="w-5 h-5 text-black/40 mr-3 group-focus-within:text-black transition-colors" />
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-transparent border-none outline-none flex-grow text-base md:text-lg text-black placeholder:text-black/40 focus-visible:ring-0 py-1 shadow-none h-auto px-0 rounded-none"
                  required
                />
                <Button 
                  type="submit" 
                  variant="ghost"
                  className="text-base md:text-lg font-semibold text-black hover:opacity-60 transition-opacity px-2 h-auto hover:bg-transparent"
                >
                  Signup
                </Button>
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer group select-none justify-center lg:justify-start">
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-5 h-5 rounded-full border border-black/20 peer-checked:bg-black peer-checked:border-black transition-all flex items-center justify-center group-hover:border-black/30">
                     <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                     </svg>
                  </div>
                </div>
                <span className="text-sm md:text-base text-black/60 transition-colors group-hover:text-black leading-tight">
                  I agree to receive marketing emails.
                </span>
              </label>
            </form>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default Newsletter;

