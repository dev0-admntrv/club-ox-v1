import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
  type: "card" | "list" | "profile" | "banner" | "grid"
  count?: number
  className?: string
}

export function LoadingSkeleton({ type, count = 1, className = "" }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className={`space-y-3 ${className}`}>
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )

      case "list":
        return (
          <div className={`space-y-4 ${className}`}>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              ))}
          </div>
        )

      case "profile":
        return (
          <div className={`space-y-6 ${className}`}>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        )

      case "banner":
        return <Skeleton className={`h-48 w-full rounded-xl ${className}`} />

      case "grid":
        return (
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
          </div>
        )

      default:
        return <Skeleton className={`h-10 w-full ${className}`} />
    }
  }

  return <>{renderSkeleton()}</>
}
