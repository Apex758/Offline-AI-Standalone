import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="h-10 w-24" />
      </div>

      <Skeleton className="h-40 w-full rounded-xl mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <Skeleton key={i} className="h-6 w-24 rounded-full" />
                ))}
            </div>

            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />

            <Skeleton className="h-8 w-64 mb-4" />
            <div className="pl-6 mb-6">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full mb-2" />
                ))}
            </div>

            <Skeleton className="h-8 w-64 mb-4" />
            <div className="pl-6 mb-6">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full mb-2" />
                ))}
            </div>

            <Skeleton className="h-8 w-64 mb-4" />
            <div className="pl-6 mb-6">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full mb-2" />
                ))}
            </div>

            <Skeleton className="h-8 w-64 mb-4" />
            <div className="pl-6 mb-6">
              {Array(4)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="mb-3">
                    <Skeleton className="h-5 w-48 mb-1" />
                    <div className="pl-6">
                      {Array(4)
                        .fill(null)
                        .map((_, j) => (
                          <Skeleton key={j} className="h-4 w-full mb-1" />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <Skeleton className="h-48 w-full mb-4 rounded-lg" />
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-3">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="flex items-start">
                      <Skeleton className="h-5 w-5 mr-2 mt-0.5 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-4">
                {Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="pb-3 border-b border-gray-100">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <div className="flex justify-end">
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
