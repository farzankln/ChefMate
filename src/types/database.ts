// Database and Prisma Types

import type { User, Post, SavedPost } from "@prisma/client";
import type { Prisma } from "@prisma/client";

// Enhanced Post type with relations
export interface PostWithRelations extends Post {
  user?: User;
  savedPosts?: SavedPost[];
}

// Enhanced User type with relations
export interface UserWithRelations extends User {
  savedPosts?: SavedPost[];
}

// Enhanced SavedPost type with relations
export interface SavedPostWithRelations extends SavedPost {
  user?: User;
  post?: Post;
}

// Database query result types
export interface PostQueryResult {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  imageUrl?: string;
  category?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  tags: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedPostQueryResult {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
  source: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  imageUrl: string | null;
  category: string | null;
  prepTime: string | null;
  cookTime: string | null;
  servings: string | null;
  difficulty: string | null;
  tags: string[];
  // Enhanced recipe data fields
  ingredients?: Prisma.InputJsonValue | null;
  instructions?: Prisma.InputJsonValue | null;
  nutrition?: Prisma.InputJsonValue | null;
}

// Database operation types
export interface CreatePostData {
  title: string;
  description: string;
  thumbnail?: string;
  imageUrl?: string;
  category?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  tags?: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {
  views?: number;
}

export interface CreateSavedPostData {
  userId: string;
  postId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  imageUrl?: string;
  category?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  tags?: string[];
  source: "internal" | "spoonacular";
  ingredients?: Prisma.InputJsonValue | null;
  instructions?: Prisma.InputJsonValue | null;
  nutrition?: Prisma.InputJsonValue | null;
}

// Database filter types
export interface PostFilters {
  category?: string;
  difficulty?: string;
  tags?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface SavedPostFilters {
  userId?: string;
  source?: "internal" | "spoonacular";
  createdAfter?: Date;
  createdBefore?: Date;
}

// Database utility types
export type PostStatus = "draft" | "published" | "archived";
export type PostSource = "internal" | "spoonacular";
export type UserProvider = "credentials" | "google" | "github";

// Re-export Prisma types for convenience
export type { User, Post, SavedPost };
