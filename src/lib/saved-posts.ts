import { prisma } from "@/lib/prisma";
import { getRecipeById } from "@/lib/spoonacular";
import { Post } from "@prisma/client";

export function isInternalPostId(postId: string): boolean {
  return postId.length === 24 && /^[0-9a-fA-F]+$/.test(postId);
}

export async function getPostDataById(postId: string): Promise<{ post: Partial<Post>; source: "internal" | "spoonacular"; }> {
  if (isInternalPostId(postId)) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error(`Internal post ${postId} not found`);
    return { post, source: "internal" };
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
  postData: Partial<Post>,
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
    likes: postData.likes || 0,
    source,
  };
}
