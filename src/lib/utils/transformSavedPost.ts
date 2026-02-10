import type { SavedPostData } from "@/types/utils";

export function transformSavedPost(savedPost: SavedPostData) {
  return {
    id: savedPost.postId,
    title: savedPost.title || "Untitled Recipe",
    description: savedPost.description || "No description available",
    thumbnail: savedPost.thumbnail || undefined,
    imageUrl: savedPost.imageUrl || undefined,
    category: savedPost.category || "Miscellaneous",
    prepTime: savedPost.prepTime || undefined,
    cookTime: savedPost.cookTime || undefined,
    servings: savedPost.servings || undefined,
    difficulty: savedPost.difficulty || undefined,
    tags: savedPost.tags || [],
    views: 0,
    createdAt: savedPost.createdAt,
    updatedAt: savedPost.createdAt,
    originalRecipe: {
      extendedIngredients: savedPost.ingredients || [],
      analyzedInstructions: savedPost.instructions || [],
      nutrition: savedPost.nutrition || { nutrients: [] },
    },
  };
}
