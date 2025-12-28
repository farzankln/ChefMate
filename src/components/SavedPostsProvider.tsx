"use client";

import { createContext, useContext } from "react";
import { useSavedPosts } from "@/hooks/useSavedPosts";

interface SavedPost {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
  post: {
    id: string;
    title?: string;
    description?: string;
    thumbnail?: string;
    imageUrl?: string;
    author?: string;
    category?: string;
    prepTime?: string;
    cookTime?: string;
    servings?: string;
    difficulty?: string;
    tags?: string[];
    views?: number;
    likes?: number;
    createdAt?: Date;
    updatedAt?: Date;
  } | null; // Post might be null for external recipes
}

interface SavedPostsContextType {
  savedPosts: SavedPost[];
  isLoading: boolean;
  isError: Error | null;
  mutate: (
    data?: SavedPost[] | ((current: SavedPost[]) => SavedPost[]),
    options?: { revalidate?: boolean }
  ) => Promise<SavedPost[] | undefined>;
}

const SavedPostsContext = createContext<SavedPostsContextType | null>(null);

interface SavedPostsProviderProps {
  children: React.ReactNode;
}

export function SavedPostsProvider({ children }: SavedPostsProviderProps) {
  const savedPostsState = useSavedPosts();

  // Ensure savedPosts is always an array
  const safeSavedPostsState = {
    ...savedPostsState,
    savedPosts: Array.isArray(savedPostsState.savedPosts)
      ? savedPostsState.savedPosts
      : [],
  };

  return (
    <SavedPostsContext.Provider value={safeSavedPostsState}>
      {children}
    </SavedPostsContext.Provider>
  );
}

export const useSavedPostsContext = (): SavedPostsContextType => {
  const context = useContext(SavedPostsContext);
  if (!context) {
    throw new Error(
      "useSavedPostsContext must be used within a SavedPostsProvider"
    );
  }
  return context;
};
