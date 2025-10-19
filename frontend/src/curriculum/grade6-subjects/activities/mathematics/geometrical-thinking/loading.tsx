import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function GeometricalThinkingActivitiesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div>
              <Skeleton className="h-10 w-96 mb-2" />
              <Skeleton className="h-6 w-64" />
            </div>
          </div>
          <Skeleton className="h-6 w-full max-w-4xl mx-auto" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6 text-center">
                <Skeleton className="w-8 h-8 mx-auto mb-2" />
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Curriculum Outcomes Skeleton */}
        <Card className="mb-12">
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="space-y-1">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-3/4" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Activities Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <div className="grid grid-cols-2 gap-1">
                      {[...Array(4)].map((_, j) => (
                        <Skeleton key={j} className="h-8 w-full" />
                      ))}
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-12">
          <div className="flex space-x-1 mb-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Navigation Skeleton */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    </div>
  )
}
