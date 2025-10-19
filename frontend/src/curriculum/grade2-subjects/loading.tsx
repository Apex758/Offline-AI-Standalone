import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-6">
        <Skeleton className="h-40 w-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
        </div>
      </div>
    </div>
  )
}
