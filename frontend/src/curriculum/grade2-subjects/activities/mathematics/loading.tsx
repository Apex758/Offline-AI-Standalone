import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="h-10 w-24" />
      </div>

      <Skeleton className="h-40 w-full rounded-xl mb-8" />

      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {Array(7)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-md" />
          ))}
      </div>

      {Array(3)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(3)
                .fill(null)
                .map((_, j) => (
                  <div key={j} className="flex flex-col">
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <Skeleton className="h-8 w-3/4 mt-4 mx-4" />
                    <Skeleton className="h-4 w-1/2 mt-2 mx-4" />
                    <Skeleton className="h-20 w-full mt-4 mx-4" />
                    <Skeleton className="h-10 w-full mt-4 mx-4 mb-4" />
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}
