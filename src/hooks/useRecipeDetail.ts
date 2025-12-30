import { useEffect, useState } from "react";
import { useSavedPostsContext } from "@/components/SavedPostsProvider";
import { getRecipeById, getSimilarRecipes } from "@/lib/spoonacular";
import { Recipe, UseRecipeDetailReturn, SimilarRecipe } from "@/types/recipe";
import { normalizeInstructions } from "@/lib/utils/normalizeInstructions";

export function useRecipeDetail(recipeId: string): UseRecipeDetailReturn {
  const { savedPosts } = useSavedPostsContext();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [similarRecipes, setSimilarRecipes] = useState<SimilarRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!recipeId) return;

    async function load() {
      try {
        // Only show loading if not in the middle of a save operation
        if (!isSaving) {
          setLoading(true);
        }
        setError(null);

        // Check if this recipe is saved by the user first
        const savedPost = savedPosts?.find((p) => p.postId === recipeId);
        const snapshot = savedPost?.post;

        // Try to fetch fresh data from API for complete recipe information
        let recipeData = null;
        let similar = [];
        let apiFailed = false;

        try {
          [recipeData, similar] = await Promise.all([
            getRecipeById(recipeId),
            getSimilarRecipes(Number(recipeId), 4),
          ]);
        } catch (apiError) {
          console.warn("API failed, attempting to use saved data:", apiError);
          apiFailed = true;
        }

        // If recipe is saved, use it as fallback when API fails or enhance API data
        if (snapshot) {
          // Transform saved snapshot to Recipe format with enhanced recipe data
          const savedRecipe: Recipe = {
            id: recipeId,
            title: snapshot.title || "Unknown Recipe",
            description: snapshot.description || "No description available",
            thumbnail: snapshot.thumbnail || "/placeholder-recipe.jpg",
            imageUrl: snapshot.imageUrl || "/placeholder-recipe.jpg",
            author: snapshot.author || "Unknown Author",
            category: snapshot.category || "General",
            prepTime: snapshot.prepTime || "0 min",
            cookTime: snapshot.cookTime || "0 min",
            servings: snapshot.servings || "1",
            difficulty: snapshot.difficulty || "Medium",
            tags: snapshot.tags || [],
            createdAt: new Date(),
            // Add original recipe data if available in saved post
            originalRecipe:
              savedPost?.ingredients ||
              savedPost?.instructions ||
              savedPost?.nutrition
                ? ({
                    id: Number(recipeId),
                    title: snapshot.title || "Unknown Recipe",
                    image: snapshot.imageUrl || "/placeholder-recipe.jpg",
                    imageType: "jpg",
                    servings: Number(snapshot.servings) || 1,
                    readyInMinutes: 0,
                    pricePerServing: 0,
                    aggregatedLikes: 0,
                    healthScore: 0,
                    spoonacularScore: 0,
                    summary: snapshot.description || "No description available",
                    cuisines: [],
                    dishTypes: [],
                    diets: [],
                    occasions: [],
                    instructions: [],
                    analyzedInstructions: savedPost?.instructions
                      ? [
                          {
                            steps: normalizeInstructions(
                              savedPost.instructions
                            ).map((stepText: string, index: number) => ({
                              number: index + 1,
                              step: stepText,
                              ingredients: [],
                              equipment: [],
                            })),
                          },
                        ]
                      : [],
                    nutrition: {
                      nutrients:
                        (savedPost?.nutrition as { nutrients?: unknown })
                          ?.nutrients ||
                        savedPost?.nutrition ||
                        [],
                    },
                    author: snapshot.author || "Unknown Author",
                    difficulty: snapshot.difficulty || "Medium",
                    tags: snapshot.tags || [],
                    extendedIngredients: savedPost?.ingredients || [],
                  } as unknown as import("@/types/recipe").SpoonacularRecipe)
                : undefined,
          };

          if (apiFailed) {
            // API failed, use saved data as primary source
            console.log("Using saved recipe data as fallback");
            setRecipe(savedRecipe);
            setSimilarRecipes([]);
            setError("Recipe loaded from saved data (API unavailable)");
          } else {
            // API succeeded, enhance with saved metadata
            const enhancedRecipe: Recipe = {
              ...recipeData!,
              // Use saved metadata when available, fallback to API data
              title: snapshot.title || recipeData!.title,
              description: snapshot.description || recipeData!.description,
              thumbnail: snapshot.thumbnail || recipeData!.thumbnail,
              imageUrl: snapshot.imageUrl || recipeData!.imageUrl,
              author: snapshot.author || recipeData!.author,
              category: snapshot.category || recipeData!.category,
              prepTime: snapshot.prepTime || recipeData!.prepTime,
              cookTime: snapshot.cookTime || recipeData!.cookTime,
              servings: snapshot.servings || recipeData!.servings,
              difficulty: snapshot.difficulty || recipeData!.difficulty,
              tags:
                snapshot.tags && snapshot.tags.length > 0
                  ? snapshot.tags
                  : recipeData!.tags,
              // Always preserve the original recipe data for detailed content
              originalRecipe: recipeData!.originalRecipe,
            };
            setRecipe(enhancedRecipe);
            setSimilarRecipes(similar);
          }
        } else {
          // No saved data available
          if (apiFailed) {
            console.error("No saved data available and API failed");
            setError("Recipe not found and API unavailable");
            setRecipe(null);
            setSimilarRecipes([]);
          } else {
            // Use API data
            setRecipe(recipeData!);
            setSimilarRecipes(similar);
          }
        }
      } catch (error) {
        console.error("Failed to load recipe:", error);
        setError("Failed to load recipe");
      } finally {
        if (!isSaving) {
          setLoading(false);
        }
      }
    }

    load();
  }, [recipeId]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: Removed savedPosts dependency to prevent unnecessary re-fetches

  // Update recipe with saved posts metadata without triggering re-fetch
  useEffect(() => {
    if (!recipe || !savedPosts || !recipeId) return;

    const snapshot = savedPosts.find((p) => p.postId === recipeId)?.post;
    if (snapshot) {
      setRecipe((prevRecipe) => {
        if (!prevRecipe) return null;

        const enhancedRecipe: Recipe = {
          ...prevRecipe,
          title: snapshot.title || prevRecipe.title,
          description: snapshot.description || prevRecipe.description,
          thumbnail: snapshot.thumbnail || prevRecipe.thumbnail,
          imageUrl: snapshot.imageUrl || prevRecipe.imageUrl,
          author: snapshot.author || prevRecipe.author,
          category: snapshot.category || prevRecipe.category,
          prepTime: snapshot.prepTime || prevRecipe.prepTime,
          cookTime: snapshot.cookTime || prevRecipe.cookTime,
          servings: snapshot.servings || prevRecipe.servings,
          difficulty: snapshot.difficulty || prevRecipe.difficulty,
          tags:
            snapshot.tags && snapshot.tags.length > 0
              ? snapshot.tags
              : prevRecipe.tags,
        };
        return enhancedRecipe;
      });
    }
  }, [savedPosts, recipeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Public method to set saving state (can be called from SaveButton)
  const setSavingState = (saving: boolean) => {
    setIsSaving(saving);
  };

  return { recipe, similarRecipes, loading, error, setSavingState };
}
