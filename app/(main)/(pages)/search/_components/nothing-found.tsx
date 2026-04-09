'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Container } from '@/components/container';

interface NothingFoundProps {
  query: string;
}

export function NothingFound({ query }: NothingFoundProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = () => {
    const q = inputRef.current?.value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <Container className="py-16 md:py-24 flex flex-col items-center text-center">
      <h2 className="text-2xl md:text-[32px] font-semibold text-[#141718] mb-4">
        Nothing Found
      </h2>
      <p className="text-neutral-500 text-sm md:text-base mb-10 max-w-md">
        Nothing matched your search terms. Please try again with different keywords.
      </p>

      {/* Search Form — inline on desktop, stacked on mobile */}
      <div className="w-full max-w-md flex flex-col sm:flex-row gap-3 sm:gap-0">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            defaultValue={query}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full h-14 pl-12 pr-4 border border-neutral-200 sm:border-r-0 text-sm text-[#141718] placeholder:text-neutral-400 focus:outline-none focus:border-[#141718] transition-colors bg-white"
          />
        </div>
        <button
          onClick={handleSearch}
          className="h-14 px-8 bg-[#141718] text-white text-sm font-semibold hover:bg-[#141718]/90 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </Container>
  );
}
