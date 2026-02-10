"use client";

import { ContentCard } from "@/components/content-card";
import { transformSavedPost } from "@/types/utils";
import type { SavedPostData } from "@/types/utils";
import { FiTag } from "react-icons/fi";

interface SavedRecipesListProps {
  savedPosts: SavedPostData[];
}

export default function SavedRecipesList({
  savedPosts,
}: SavedRecipesListProps) {
  return (
    <div className="space-y-8 p-8 rounded-2xl shadow-xl bg-red-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Your Saved Recipes
          </h2>
          <p className="text-gray-600 mt-1">
            {savedPosts.length} recipe{savedPosts.length !== 1 ? "s" : ""} in
            your collection
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiTag className="w-4 h-4" />
          <span>Sorted by newest first</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedPosts.map((savedPost) => {
          const post = transformSavedPost(savedPost);
          return (
            <div
              key={savedPost.id}
              className="transform transition-all duration-200"
            >
              <ContentCard post={post} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
