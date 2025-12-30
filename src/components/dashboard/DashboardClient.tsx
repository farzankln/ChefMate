"use client";

import { useSavedPostsContext } from "@/components/SavedPostsProvider";
import DashboardHeader from "./DashboardHeader";
import EmptySavedRecipes from "./EmptySavedRecipes";
import SavedRecipesList from "./SavedRecipesList";
import {
  DashboardHeaderSkeleton,
  SavedRecipesGridSkeleton,
} from "@/components/skeletons";
import { transformSavedPost } from "@/lib/utils/transformSavedPost";
import type { SavedPostData } from "@/types/utils";

export function DashboardClient({
  userName,
  userImage,
}: {
  userName: string;
  userImage: string | null;
}) {
  const { savedPosts, isLoading } = useSavedPostsContext();

  // Ensure savedPosts is always an array
  const safeSavedPosts = Array.isArray(savedPosts) ? savedPosts : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-liner-to-br from-gray-50 via-white to-blue-50/30 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardHeaderSkeleton />
          <SavedRecipesGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-liner-to-br from-gray-50 via-white to-blue-50/30 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader userName={userName} userImage={userImage} />
        {safeSavedPosts.length === 0 ? (
          <EmptySavedRecipes />
        ) : (
          <SavedRecipesList
            savedPosts={safeSavedPosts.map((post) => ({
              id: post.id,
              postId: post.postId,
              createdAt: post.createdAt,
              source: "unknown",
              title: post.post?.title || "",
              description: post.post?.description || "",
              thumbnail: post.post?.thumbnail || "",
              imageUrl: post.post?.imageUrl || "",
              author: post.post?.author || "",
              category: post.post?.category || "",
              prepTime: post.post?.prepTime || "",
              cookTime: post.post?.cookTime || "",
              servings: post.post?.servings || "",
              difficulty: post.post?.difficulty || "",
              tags: post.post?.tags || [],
              ingredients: [],
              instructions: [],
              nutrition: null,
            }))}
          />
        )}
      </div>
    </div>
  );
}
