import { Container } from '@/components/container';

export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="bg-[#F3F5F7] py-10">
        <Container className="flex flex-col items-center gap-3">
          <div className="h-8 w-72 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        </Container>
      </div>

      {/* Grid skeleton */}
      <div className="px-4 lg:px-12 py-8 mx-auto max-w-7xl">
        <div className="h-12 border-b border-neutral-100 mb-6 flex items-center justify-between animate-pulse">
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-[3/4] bg-gray-100" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
