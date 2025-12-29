export interface SavedPostData {
  id: string;
  postId: string;
  createdAt: Date;
  source: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  imageUrl: string | null;
  author: string | null;
  category: string | null;
  prepTime: string | null;
  cookTime: string | null;
  servings: string | null;
  difficulty: string | null;
  tags: string[];
  likes: number;
}

export function transformSavedPost(savedPost: SavedPostData) {
  return {
    id: savedPost.postId,
    title: savedPost.title || "Untitled Recipe",
    description: savedPost.description || "No description available",
    thumbnail: savedPost.thumbnail || undefined,
    imageUrl: savedPost.imageUrl || undefined,
    author: savedPost.author || "Unknown Author",
    category: savedPost.category || "Miscellaneous",
    prepTime: savedPost.prepTime || undefined,
    cookTime: savedPost.cookTime || undefined,
    servings: savedPost.servings || undefined,
    difficulty: savedPost.difficulty || undefined,
    tags: savedPost.tags || [],
    views: 0,
    likes: savedPost.likes || 0,
    createdAt: savedPost.createdAt,
    updatedAt: savedPost.createdAt,
  };
}
