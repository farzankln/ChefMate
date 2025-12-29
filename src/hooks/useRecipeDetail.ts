import { useEffect, useState } from "react";
import { useSavedPostsContext } from "@/components/SavedPostsProvider";
import { getRecipeById, getSimilarRecipes } from "@/lib/spoonacular";
import { Recipe, UseRecipeDetailReturn, SimilarRecipe } from "@/types/recipe";

export function useRecipeDetail(recipeId: string): UseRecipeDetailReturn {
  const { savedPosts } = useSavedPostsContext();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [similarRecipes, setSimilarRecipes] = useState<SimilarRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // ✅ 1. snapshot first
        const snapshot = savedPosts?.find((p) => p.postId === recipeId)?.post;
        if (snapshot) {
          // Transform snapshot to Recipe format with fallbacks for optional fields
          const transformedSnapshot: Recipe = {
            id: snapshot.id || recipeId,
            title: snapshot.title || "Untitled Recipe",
            description: snapshot.description || "No description available",
            thumbnail: snapshot.thumbnail || "/placeholder-recipe.jpg",
            imageUrl: snapshot.imageUrl || "/placeholder-recipe.jpg",
            author: snapshot.author || "Unknown Author",
            category: snapshot.category || "General",
            prepTime: snapshot.prepTime || "10 min",
            cookTime: snapshot.cookTime || "15 min",
            servings: snapshot.servings || "4",
            difficulty: snapshot.difficulty || "Medium",
            tags: snapshot.tags || [],
            likes: snapshot.likes || 0,
            createdAt: snapshot.createdAt || new Date(),
          };
          setRecipe(transformedSnapshot);
          return;
        }

        // ✅ 2. api fallback
        const [recipeData, similar] = await Promise.all([
          getRecipeById(recipeId),
          getSimilarRecipes(Number(recipeId), 4),
        ]);

        setRecipe(recipeData);
        setSimilarRecipes(similar);
      } catch {
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [recipeId, savedPosts]);

  return { recipe, similarRecipes, loading, error };
}
