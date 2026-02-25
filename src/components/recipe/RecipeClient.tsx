"use client";

import { RecipePageSkeleton } from "@/components/skeletons";
import RecipeHeader from "@/components/recipe/RecipeHeader";
import RecipeTabs from "./navigationSection/RecipeTabs";
import RecipeSidebar from "@/components/recipe/RecipeSidebar";
import { useRecipeDetail } from "../../hooks/useRecipeDetail";
import { Recipe } from "@/types/recipe";
import { Badge } from "@/components/ui";

interface RecipeClientProps {
  id: string;
}

export default function RecipeClient({ id }: RecipeClientProps) {
  const { recipe, loading, error, similarRecipes, setSavingState } =
    useRecipeDetail(id);

  if (loading) return <RecipePageSkeleton />;

  // If no recipe data at all, show error
  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Recipe Not Found
          </h1>
          <p className="text-gray-600">
            {error || "The requested recipe could not be found."}
          </p>
        </div>
      </div>
    );
  }

  const isUsingSavedData = error && !error.includes("Failed to load");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show notification when using saved data */}
        {isUsingSavedData && (
          <div className="mb-6">
            <Badge
              variant="default"
              className="bg-yellow-50 border border-yellow-200 text-yellow-800 hover:bg-yellow-100"
            >
              ⚠️ {error}
            </Badge>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <RecipeHeader recipe={recipe} setSavingState={setSavingState} />
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <RecipeTabs recipe={recipe} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <RecipeSidebar recipe={recipe} similarRecipes={similarRecipes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
