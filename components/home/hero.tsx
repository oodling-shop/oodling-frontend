'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '../container';
import { FramerCarousel } from '../framer-carousel';

export const Hero = () => {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#fafafa]">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-100/40 rounded-full blur-[120px] translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-100/40 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full py-20">
        
        {/* Left Content */}
        <div className="flex flex-col items-start gap-6 max-w-xl">
          <h1 className="relative text-7xl md:text-8xl font-semibold tracking-tight text-neutral-900 leading-[1.1]">
            AirNags
            <sup className="absolute top-4 -right-8 text-2xl md:text-3xl font-normal text-neutral-800">®</sup>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-600 max-w-md leading-relaxed">
            Keep your everyday style chic and on-trend with our selection 20+ styles to choose from.
          </p>
          
          <Link 
            href="/collection" 
            className="group flex items-center gap-2 text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 mt-8 hover:opacity-70 transition-all"
          >
            See Collection
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
          </Link>
        </div>

        {/* Right Content - Framer Carousel */}
        <div className="relative w-full aspect-square flex items-center justify-center max-w-[600px] mx-auto lg:mx-0">
          <FramerCarousel />
        </div>
        
      </Container>
    </section>
  );
};

export default Hero;
