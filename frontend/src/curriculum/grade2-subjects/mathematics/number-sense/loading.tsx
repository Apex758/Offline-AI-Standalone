import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-8 w-32 mb-6" />

      <Skeleton className="w-full h-40 mb-8 rounded-xl" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="p-4">
                {Array(5)
                  .fill(null)
                  .map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full mb-2" />
                  ))}
              </div>
            </div>
          ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(2)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="p-4">
                {Array(5)
                  .fill(null)
                  .map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full mb-2" />
                  ))}
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center mt-8">
        <Skeleton className="h-14 w-64" />
      </div>
    </div>
  )
}
