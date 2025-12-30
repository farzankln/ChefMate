"use client";

import type {
  SavedPostsContextType,
  SavedPostsProviderProps,
} from "@/types/context";
import { createContext, useContext } from "react";
import { useSavedPosts } from "@/hooks/useSavedPosts";

const SavedPostsContext = createContext<SavedPostsContextType | null>(null);

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
