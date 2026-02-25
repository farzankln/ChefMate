import type { PostData } from "@/types/utils";
import { prisma } from "@/lib/prisma";
import { getRecipeById } from "@/lib/spoonacular";
import type { Prisma } from "@prisma/client";

export function isInternalPostId(postId: string): boolean {
  return postId.length === 24 && /^[0-9a-fA-F]+$/.test(postId);
}

export async function getPostDataById(
  postId: string,
): Promise<{ post: PostData; source: "internal" | "spoonacular" }> {
  if (isInternalPostId(postId)) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error(`Internal post ${postId} not found`);

    // Transform Prisma types to PostData types
    const transformedPost = {
      ...post,
      thumbnail: post.thumbnail || undefined,
      imageUrl: post.imageUrl || undefined,
      category: post.category || undefined,
      prepTime: post.prepTime || undefined,
      cookTime: post.cookTime || undefined,
      servings: post.servings || undefined,
      difficulty: post.difficulty || undefined,
    };

    return { post: transformedPost, source: "internal" };
  } else {
    try {
      const recipe = await getRecipeById(postId);
      return { post: recipe, source: "spoonacular" };
    } catch {
      throw new Error(`External recipe ${postId} not found`);
    }
  }
}

// Type guard for checking if originalRecipe has extendedIngredients and converting to Prisma InputJsonValue
function hasExtendedIngredients(
  data: unknown,
): data is { extendedIngredients: Prisma.InputJsonValue } {
  return (
    typeof data === "object" && data !== null && "extendedIngredients" in data
  );
}

// Type guard for checking if originalRecipe has analyzedInstructions and converting to Prisma InputJsonValue
function hasAnalyzedInstructions(
  data: unknown,
): data is { analyzedInstructions: Prisma.InputJsonValue } {
  return (
    typeof data === "object" && data !== null && "analyzedInstructions" in data
  );
}

// Type guard for checking if originalRecipe has nutrition and converting to Prisma InputJsonValue
function hasNutrition(
  data: unknown,
): data is { nutrition: Prisma.InputJsonValue } {
  return typeof data === "object" && data !== null && "nutrition" in data;
}

export function mapPostToSavedPostData(
  postId: string,
  userId: string,
  postData: PostData,
  source: "internal" | "spoonacular",
): Prisma.SavedPostCreateInput {
  return {
    user: { connect: { id: userId } },
    postId,
    title: postData.title || null,
    description: postData.description || null,
    thumbnail: postData.thumbnail || null,
    imageUrl: postData.imageUrl || null,
    category: postData.category || null,
    prepTime: postData.prepTime || null,
    cookTime: postData.cookTime || null,
    servings: postData.servings || null,
    difficulty: postData.difficulty || null,
    tags: postData.tags || [],
    source,
    // Extract enhanced recipe data if available using type guards
    ingredients: hasExtendedIngredients(postData.originalRecipe)
      ? postData.originalRecipe.extendedIngredients
      : undefined,
    instructions: hasAnalyzedInstructions(postData.originalRecipe)
      ? postData.originalRecipe.analyzedInstructions
      : undefined,
    nutrition: hasNutrition(postData.originalRecipe)
      ? postData.originalRecipe.nutrition
      : undefined,
  };
}
