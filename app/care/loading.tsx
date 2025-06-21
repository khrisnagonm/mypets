import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CareLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      {/* Header Skeleton */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="hidden md:flex space-x-6">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header Skeleton */}
        <div className="mb-8 text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-14 w-14 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-24" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Care Categories Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-lg mr-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <div className="flex space-x-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full mt-6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
