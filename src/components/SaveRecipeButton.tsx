"use client";

import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useSavedPostsContext } from "@/components/SavedPostsProvider";
import type { SavedPost } from "@/types/context";

export default function SaveRecipeButton({ recipe }: any) {
  const { data: session } = useSession();
  const { savedPosts, mutate } = useSavedPostsContext();

  const isSaved =
    Array.isArray(savedPosts) &&
    savedPosts.some((p: SavedPost) => p.postId === recipe.id);

  const toggleSave = async () => {
    if (!session) {
      toast.error("Please log in to save recipes");
      return;
    }

    try {
      if (isSaved) {
        mutate(
          (curr: SavedPost[]) => curr.filter((p) => p.postId !== recipe.id),
          { revalidate: false }
        );

        await fetch(`/api/saved-posts/${recipe.id}`, { method: "DELETE" });
        toast.success("Removed from saved recipes");
      } else {
        mutate(
          (curr: SavedPost[]) => [
            {
              id: `temp-${Date.now()}`,
              userId: session.user.id,
              postId: recipe.id,
              createdAt: new Date(),
              post: recipe,
            },
            ...(curr || []),
          ],
          { revalidate: false }
        );

        await fetch("/api/saved-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: recipe.id }),
        });

        toast.success("Recipe saved");
      }

      mutate();
    } catch {
      toast.error("Something went wrong");
      mutate();
    }
  };

  return (
    <button
      onClick={toggleSave}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        isSaved ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"
      }`}
    >
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
