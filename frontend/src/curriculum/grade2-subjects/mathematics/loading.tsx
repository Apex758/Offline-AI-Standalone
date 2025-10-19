import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-8 w-32 mb-6" />

      <Skeleton className="w-full h-40 mb-8 rounded-xl" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
              </div>
              <div className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
      </div>

      <Skeleton className="w-full h-48 rounded-xl mb-8" />

      <div className="flex justify-center">
        <Skeleton className="h-14 w-64" />
      </div>
    </div>
  )
}
