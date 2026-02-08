"use client";

import { Container } from '../container';
import { Mail } from 'lucide-react';
import Image from 'next/image';

export const Newsletter = () => {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="bg-[#F3F5F7] rounded-[40px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[460px] relative">
          {/* Left Side: Content */}
          <div className="p-10 md:p-20 flex flex-col justify-center gap-10 z-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-[1.1]">
                Join our newsletter. <br />
                Enjoy big discounts.
              </h2>
            </div>
            
            <form className="w-full max-w-md space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex items-center border-b border-black/10 pb-4 group transition-all focus-within:border-black/30">
                <Mail className="w-6 h-6 text-black/40 mr-4 group-focus-within:text-black transition-colors" />
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-transparent border-none outline-none flex-grow text-lg text-black placeholder:text-black/40 focus:ring-0 py-1"
                  required
                />
                <button 
                  type="submit" 
                  className="text-lg font-semibold text-black hover:opacity-60 transition-opacity px-2"
                >
                  Signup
                </button>
              </div>
              
              <label className="flex items-center gap-4 cursor-pointer group select-none">
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-6 h-6 rounded-full border-2 border-black/10 peer-checked:bg-black peer-checked:border-black transition-all flex items-center justify-center group-hover:border-black/30">
                    <div className="w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity scale-0 peer-checked:scale-100 duration-300" />
                  </div>
                </div>
                <span className="text-base text-black/50 transition-colors group-hover:text-black leading-none">
                  I agree to receive marketing emails.
                </span>
              </label>
            </form>
          </div>

          {/* Right Side: Image and Glow */}
          <div className="relative flex items-center justify-center p-12 lg:p-0 overflow-hidden min-h-[350px] lg:min-h-full bg-gradient-to-br from-transparent to-black/5 lg:bg-none">
            {/* Multi-color Glow Effect - More vibrant as per design */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-[#5E72E4] blur-[100px] opacity-20 rounded-full" />
              <div className="absolute bottom-[20%] right-[30%] w-80 h-80 bg-[#FF8D72] blur-[120px] opacity-25 rounded-full" />
              <div className="absolute top-[40%] right-[0%] w-60 h-60 bg-[#FFD700] blur-[100px] opacity-15 rounded-full" />
            </div>

            <div className="relative w-full h-[300px] md:h-[400px] lg:h-full lg:w-[120%] lg:-mr-[10%] flex items-center justify-center z-10">
              <div className="relative w-full h-full transition-transform duration-700 ease-out hover:scale-105">
                <Image
                  src="/images/shoes/airkan_ii.png"
                  alt="Nike Basketball Shoe"
                  fill
                  className="object-contain drop-shadow-[0_45px_50px_rgba(0,0,0,0.35)]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;

