import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="absolute -inset-3 bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-lg pointer-events-none" />
        <LoadingSpinner size="xl" variant="primary" />
      </div>
      <p className="text-sm font-medium text-gray-400 tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
}
