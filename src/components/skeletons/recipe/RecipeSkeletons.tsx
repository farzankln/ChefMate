import { BaseSkeleton, TextSkeleton } from "../index";

export function RecipeHeaderSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <BaseSkeleton height="20rem" className="rounded-2xl" />

      {/* Title and Meta */}
      <div className="space-y-4">
        <BaseSkeleton height="2.5rem" width="80%" />
        <div className="flex flex-wrap gap-4">
          <BaseSkeleton height="1.5rem" width="6rem" />
          <BaseSkeleton height="1.5rem" width="5rem" />
          <BaseSkeleton height="1.5rem" width="4rem" />
          <BaseSkeleton height="1.5rem" width="7rem" />
        </div>
        <TextSkeleton lines={2} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <BaseSkeleton height="2.5rem" width="5rem" />
        <BaseSkeleton height="2.5rem" width="6rem" />
      </div>
    </div>
  );
}

export function RecipeTabsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 border-b">
        <BaseSkeleton height="2.5rem" width="6rem" />
        <BaseSkeleton height="2.5rem" width="7rem" />
        <BaseSkeleton height="2.5rem" width="5rem" />
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        <TextSkeleton lines={3} />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <BaseSkeleton
                height="1.5rem"
                width="1.5rem"
                className="rounded-full mt-1"
              />
              <div className="flex-1">
                <TextSkeleton lines={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RecipeSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Recipe Info Card */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <BaseSkeleton height="1.5rem" width="70%" />
        <div className="space-y-3">
          <div className="flex justify-between">
            <BaseSkeleton height="1rem" width="30%" />
            <BaseSkeleton height="1rem" width="40%" />
          </div>
          <div className="flex justify-between">
            <BaseSkeleton height="1rem" width="25%" />
            <BaseSkeleton height="1rem" width="35%" />
          </div>
          <div className="flex justify-between">
            <BaseSkeleton height="1rem" width="20%" />
            <BaseSkeleton height="1rem" width="30%" />
          </div>
        </div>
      </div>

      {/* Similar Recipes Card */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <BaseSkeleton height="1.5rem" width="60%" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3">
              <BaseSkeleton height="4rem" width="4rem" className="rounded" />
              <div className="flex-1 space-y-2">
                <TextSkeleton lines={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RecipePageSkeleton() {
  return (
    <div className="min-h-screen bg-liner-to-br from-gray-50 via-white to-blue-50/30 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <RecipeHeaderSkeleton />
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <RecipeTabsSkeleton />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <RecipeSidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
