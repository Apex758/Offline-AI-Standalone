import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-8 w-full max-w-md mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <Skeleton className="h-40 w-full rounded-xl mb-6" />
          <Skeleton className="h-64 w-full rounded-lg mb-6" />
          <div className="flex flex-wrap gap-4 mb-6">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>
        </div>

        <div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>

      <div className="mb-8">
        <Skeleton className="h-12 w-full rounded-lg mb-4" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>

      <div className="mb-8">
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>
  )
}
