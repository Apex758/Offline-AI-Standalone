import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-8 w-32 mb-6" />

      <Skeleton className="w-full h-40 mb-8 rounded-xl" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>

      <Skeleton className="w-full h-48 rounded-xl mb-8" />

      <div className="flex justify-center">
        <Skeleton className="h-14 w-64" />
      </div>
    </div>
  )
}
