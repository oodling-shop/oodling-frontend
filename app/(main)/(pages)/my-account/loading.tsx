export default function MyAccountLoading() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[60vh] animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-48 mb-12" />
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="w-full md:w-[260px] space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}
