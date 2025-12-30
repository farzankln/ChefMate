import type { PostData } from "@/types/utils";
import { prisma } from "@/lib/prisma";
import { getRecipeById } from "@/lib/spoonacular";
import type { Post } from "@prisma/client";

export function isInternalPostId(postId: string): boolean {
  return postId.length === 24 && /^[0-9a-fA-F]+$/.test(postId);
}

export async function getPostDataById(
  postId: string
): Promise<{ post: PostData; source: "internal" | "spoonacular" }> {
  if (isInternalPostId(postId)) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error(`Internal post ${postId} not found`);

    // Transform Prisma types to PostData types
    const transformedPost = {
      ...post,
      thumbnail: post.thumbnail || undefined,
      imageUrl: post.imageUrl || undefined,
      author: post.author || undefined,
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

export function mapPostToSavedPostData(
  postId: string,
  userId: string,
  postData: PostData,
  source: "internal" | "spoonacular"
) {
  return {
    userId,
    postId,
    title: postData.title || null,
    description: postData.description || null,
    thumbnail: postData.thumbnail || null,
    imageUrl: postData.imageUrl || null,
    author: postData.author || null,
    category: postData.category || null,
    prepTime: postData.prepTime || null,
    cookTime: postData.cookTime || null,
    servings: postData.servings || null,
    difficulty: postData.difficulty || null,
    tags: postData.tags || [],
    source,
    // Extract enhanced recipe data if available
    ingredients:
      (postData.originalRecipe as { extendedIngredients?: unknown })
        ?.extendedIngredients || null,
    instructions:
      (postData.originalRecipe as { analyzedInstructions?: unknown })
        ?.analyzedInstructions || null,
    nutrition:
      (postData.originalRecipe as { nutrition?: unknown })?.nutrition || null,
  };
}
