export default function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl shadow-lg border border-gray-100 bg-white animate-pulse">
      {/* Header Area */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-100 rounded"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>

      {/* Temp Area */}
      <div className="mt-8 flex items-center justify-between">
        <div className="h-12 w-24 bg-gray-200 rounded"></div>
        <div className="h-16 w-16 bg-gray-100 rounded-full"></div>
      </div>

      {/* Bottom Grid */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <div className="h-10 bg-gray-50 rounded"></div>
        <div className="h-10 bg-gray-50 rounded"></div>
      </div>
    </div>
  );
}
