import { BaseSkeleton, TextSkeleton, CardSkeleton } from "../index";

export function DashboardHeaderSkeleton() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <BaseSkeleton circle height="4rem" width="4rem" />
        <div className="space-y-2">
          <BaseSkeleton height="2rem" width="12rem" />
          <BaseSkeleton height="1.25rem" width="8rem" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <BaseSkeleton height="2rem" width="16rem" />
          <BaseSkeleton height="1.25rem" width="12rem" className="mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <BaseSkeleton height="1rem" width="8rem" />
        </div>
      </div>
    </div>
  );
}

export function SavedRecipesGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-liner-to-br from-gray-50 via-white to-blue-50/30 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeaderSkeleton />
        <SavedRecipesGridSkeleton />
      </div>
    </div>
  );
}

export function EmptyStateSkeleton() {
  return (
    <div className="text-center py-16">
      <BaseSkeleton
        height="4rem"
        width="4rem"
        className="mx-auto mb-4 rounded-full"
      />
      <BaseSkeleton height="1.5rem" width="16rem" className="mx-auto mb-2" />
      <BaseSkeleton height="1rem" width="20rem" className="mx-auto" />
    </div>
  );
}
