'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ImageNode {
  url: string;
  altText: string;
}

interface ProductImageGalleryProps {
  images: ImageNode[];
  title: string;
  compareAtAmount?: string;
  currentAmount?: string;
}

export function ProductImageGallery({
  images,
  title,
  compareAtAmount,
  currentAmount,
}: ProductImageGalleryProps) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const showDiscount =
    compareAtAmount &&
    currentAmount &&
    parseFloat(compareAtAmount) > parseFloat(currentAmount);

  const discountPct = showDiscount
    ? Math.round(
        ((parseFloat(compareAtAmount!) - parseFloat(currentAmount!)) /
          parseFloat(compareAtAmount!)) *
          100
      )
    : 0;

  const openModal = (index: number) => setModalIndex(index);
  const closeModal = () => setModalIndex(null);

  const goPrev = () =>
    setModalIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));

  const goNext = () =>
    setModalIndex((i) => (i === null ? null : (i + 1) % images.length));

  useEffect(() => {
    if (modalIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIndex]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 h-fit">
        {images.map((image, index) => (
          <div
            key={image.url}
            className="relative aspect-3/4 bg-[#F3F5F7] overflow-hidden rounded-sm cursor-zoom-in"
            onClick={() => openModal(index)}
          >
            <Image
              src={image.url}
              alt={image.altText || title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
              priority={index === 0}
            />
            {index === 0 && (
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-white text-[#141718] text-xs font-semibold px-2 py-1 rounded">
                  NEW
                </span>
                {showDiscount && (
                  <span className="bg-[#38CB89] text-white text-xs font-semibold px-2 py-1 rounded">
                    -{discountPct}%
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {modalIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Modal container */}
          <div
            className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center px-4 py-8 sm:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main image */}
            <div className="relative w-full h-[70vh] sm:h-[80vh]">
              <Image
                src={images[modalIndex].url}
                alt={images[modalIndex].altText || title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Close button */}
            <button
              onClick={closeModal}
              aria-label="Close preview"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Prev button */}
            {images.length > 1 && (
              <button
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-2 sm:left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {/* Next button */}
            {images.length > 1 && (
              <button
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-2 sm:right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setModalIndex(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === modalIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Counter */}
            <span className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white/70 text-sm">
              {modalIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
