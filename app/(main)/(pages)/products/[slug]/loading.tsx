export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-[3/4] bg-gray-100 rounded-lg" />
        <div className="flex flex-col gap-6 py-4">
          <div className="h-10 bg-gray-100 rounded w-3/4" />
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-4/6" />
          </div>
          <div className="h-14 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </main>
  );
}
