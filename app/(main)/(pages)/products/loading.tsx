export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-white pb-20 pt-10">
      <div className="lg:px-12 px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 rounded" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
