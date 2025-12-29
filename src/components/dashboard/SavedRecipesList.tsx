"use client";

import { ContentCard } from "@/components/content-card";
import {
  transformSavedPost,
  SavedPostData,
} from "@/lib/utils/transformSavedPost";

interface SavedRecipesListProps {
  savedPosts: SavedPostData[];
}

export default function SavedRecipesList({
  savedPosts,
}: SavedRecipesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {savedPosts.map((savedPost) => {
        const post = transformSavedPost(savedPost);
        return <ContentCard key={savedPost.id} post={post} />;
      })}
    </div>
  );
}
