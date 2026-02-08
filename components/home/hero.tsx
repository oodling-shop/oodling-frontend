'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '../container';
import { motion, useMotionValue, animate } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/helpers/cn';

const HERO_SLIDES = [
  {
    id: 1,
    title1: 'AirNags',
    title2: '®',
    description: 'Keep your everyday style chic and on-trend with our selection 20+ styles to choose from.',
    image: '/images/shoes/nike.png',
    cta: 'See Collection',
    path: '/collection',
    bgGradient: 'bg-blue-100/40' // Example specific prop if needed, currently using shared gradients
  },
  {
    id: 2,
    title1: 'AirKan',
    title2: '™',
    description: 'Experience ultimate comfort and performance with our latest AirKan series.',
    image: '/images/shoes/airkan_ii.png',
    cta: 'Shop Now',
    path: '/collection'
  },
  {
    id: 3,
    title1: 'AeroDive',
    title2: ' Pro',
    description: 'Push your limits with the new AeroDive Pro. Designed for speed and agility.',
    image: '/images/shoes/aero_dive.png',
    cta: 'Learn More',
    path: '/collection'
  }
];

export const Hero = () => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    const updateWidthAndAnimate = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const targetX = -index * containerWidth;
        
        animate(x, targetX, {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        });
      }
    };

    // Initial animation
    updateWidthAndAnimate();

    // Resize observer to keep carousel aligned
    const resizeObserver = new ResizeObserver(updateWidthAndAnimate);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [index, x]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-[#fafafa]"
    >
      {/* Background Gradients - Static for now, could be animated per slide */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-100/40 rounded-full blur-[120px] translate-y-1/3 translate-x-1/4 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-100/40 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none z-0" />

      {/* Slides Container */}
      <motion.div 
        className="flex h-full w-full z-10"
        style={{ x }}
      >
        {HERO_SLIDES.map((slide) => (
          <div key={slide.id} className="w-full min-w-full shrink-0 flex items-center h-full">
            <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full py-20 w-full">
              
              {/* Left Content */}
              <div className="flex flex-col items-start gap-6 max-w-xl">
                <h1 className="relative text-7xl md:text-8xl font-semibold tracking-tight text-neutral-900 leading-[1.1]">
                  {slide.title1}
                  <sup className="absolute top-4 -right-8 text-2xl md:text-3xl font-normal text-neutral-800">
                    {slide.title2}
                  </sup>
                </h1>
                
                <p className="text-lg md:text-xl text-neutral-600 max-w-md leading-relaxed">
                  {slide.description}
                </p>
                
                <Link 
                  href={slide.path} 
                  className="group flex items-center gap-2 text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 mt-8 hover:opacity-70 transition-all"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
                </Link>
              </div>

              {/* Right Content - Image */}
              <div className="relative w-full aspect-square flex items-center justify-center max-w-[600px] mx-auto lg:mx-0">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-neutral-100/50 rounded-full blur-2xl" />
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={slide.image} 
                    alt={slide.title1}
                    className="relative w-[120%] h-[120%] object-contain drop-shadow-2xl z-10"
                  />
                </div>
              </div>
              
            </Container>
          </div>
        ))}
      </motion.div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center items-center gap-4">
          {/* <Button 
            variant="ghost"
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors bg-white/80 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-700" />
          </Button> */}
          
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button 
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? 'bg-neutral-900 w-8' : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
{/* 
          <Button 
            variant="ghost"
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors bg-white/80 backdrop-blur-sm"
             aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-neutral-700" />
          </Button> */}
      </div>

    </section>
  );
};

export default Hero;
