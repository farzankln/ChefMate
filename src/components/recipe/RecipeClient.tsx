"use client";

import { useParams } from "next/navigation";
import RecipeSkeleton from "@/components/recipe/RecipeSkeleton";
import RecipeHeader from "@/components/recipe/RecipeHeader";
import RecipeTabs from "./navigationSection/RecipeTabs";
import RecipeSidebar from "@/components/recipe/RecipeSidebar";
import { useRecipeDetail } from "../../hooks/useRecipeDetail";
import { Recipe } from "@/types/recipe";

export default function RecipeClient() {
  const { id } = useParams();
  const { recipe, loading, error, similarRecipes } = useRecipeDetail(
    id as string
  );

  if (loading) return <RecipeSkeleton />;
  if (error || !recipe) throw new Error("Recipe not found");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <RecipeHeader recipe={recipe as Recipe} />
        <RecipeTabs recipe={recipe as Recipe} />
      </div>

      <RecipeSidebar
        recipe={recipe as Recipe}
        similarRecipes={similarRecipes}
      />
    </div>
  );
}
