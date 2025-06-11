export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-600">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
      <p className="text-lg font-medium">Loading your cart...</p>
    </div>
  );
}