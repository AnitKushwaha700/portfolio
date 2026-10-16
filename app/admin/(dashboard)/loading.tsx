import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="bg-card p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" rounded="lg" />
          <Skeleton className="h-4 w-72" rounded="md" />
        </div>
        <Skeleton className="h-10 w-28" rounded="lg" />
      </div>

      {/* Content / Table Skeleton */}
      <div className="bg-card border border-gray-800 rounded-2xl p-6 space-y-4">
        <Skeleton className="h-10 w-full" rounded="lg" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center py-2 border-b border-gray-800/40">
              <Skeleton className="h-5 w-1/4" rounded="md" />
              <Skeleton className="h-5 w-1/3" rounded="md" />
              <Skeleton className="h-5 w-1/5" rounded="md" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="w-8 h-8" rounded="md" />
                <Skeleton className="w-8 h-8" rounded="md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
