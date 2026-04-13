'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '../container';
import { motion, useMotionValue, animate } from 'motion/react';
import { useTranslations } from 'next-intl';

const HERO_SLIDES = [
  { id: 1, title1: 'AirNags', title2: '®', image: '/images/shoes/nike.png', path: '/collection', key: 'slide1' },
  { id: 2, title1: 'AirKan', title2: '™', image: '/images/shoes/airkan_ii.png', path: '/collection', key: 'slide2' },
  { id: 3, title1: 'AeroDive', title2: ' Pro', image: '/images/shoes/aero_dive.png', path: '/collection', key: 'slide3' },
];

export const Hero = () => {
  const t = useTranslations('hero');
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

    updateWidthAndAnimate();

    const resizeObserver = new ResizeObserver(updateWidthAndAnimate);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [index, x]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg.png')" }}
    >
      <motion.div className="flex h-full w-full z-10" style={{ x }}>
        {HERO_SLIDES.map((slide) => (
          <div key={slide.id} className="w-full min-w-full shrink-0 flex items-center h-full">
            <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full py-20 w-full">

              <div className="flex flex-col items-start gap-6 max-w-xl">
                <h1 className="relative text-7xl md:text-8xl font-semibold tracking-tight text-neutral-900 leading-[1.1]">
                  {slide.title1}
                  <sup className="absolute top-4 -right-8 text-2xl md:text-3xl font-normal text-neutral-800">
                    {slide.title2}
                  </sup>
                </h1>

                <p className="text-lg md:text-xl text-neutral-600 max-w-md leading-relaxed">
                  {t(`${slide.key}.description`)}
                </p>

                <Link
                  href={slide.path}
                  className="group flex items-center gap-2 text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 mt-8 hover:opacity-70 transition-all"
                >
                  {t(`${slide.key}.cta`)}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
                </Link>
              </div>

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

      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center items-center gap-4">
        <div className="flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === index ? 'bg-neutral-900 w-8' : 'bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={t('goToSlide', { n: i + 1 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
