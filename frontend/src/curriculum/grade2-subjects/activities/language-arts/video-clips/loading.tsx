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
          <Skeleton className="h-[800px] w-full rounded-lg mb-8" />
        </div>

        <div className="lg:col-span-1">
          <div>
            <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
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
