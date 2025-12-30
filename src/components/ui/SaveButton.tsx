"use client";

import { useSession } from "next-auth/react";
import { useSavedPostsContext } from "@/components/SavedPostsProvider";
import type { SavedPost } from "@/types/context";
import type { SaveButtonProps } from "@/types/components";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiBookmark } from "react-icons/fi";

export function SaveButton({
  recipe,
  variant = "button",
  size = "md",
  className = "",
  showText = true,
  openAuthModal = true,
  setSavingState,
}: SaveButtonProps) {
  const { data: session } = useSession();
  const { savedPosts, mutate } = useSavedPostsContext();
  const [loading, setLoading] = useState(false);

  const isSaved =
    Array.isArray(savedPosts) &&
    savedPosts.some((p: SavedPost) => p.postId === recipe.id);

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session) {
      if (openAuthModal) {
        document.dispatchEvent(new CustomEvent("open-auth-modal"));
      } else {
        toast.error("Please log in to save recipes");
      }
      return;
    }

    // Prevent skeleton loading during save operation
    if (setSavingState) {
      setSavingState(true);
    }
    setLoading(true);

    try {
      if (isSaved) {
        // Optimistic update - remove from saved posts
        mutate(
          (current: SavedPost[]) =>
            Array.isArray(current)
              ? current.filter((item) => item.postId !== recipe.id)
              : [],
          { revalidate: false }
        );

        // Make API call to remove from saved posts
        const response = await fetch(`/api/saved-posts/${recipe.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          // Revert optimistic update if API call fails
          mutate();
          throw new Error("Failed to remove from saved recipes");
        }

        toast.success("Removed from saved recipes");
      } else {
        // Optimistic update - add to saved posts
        const newSavedPost: SavedPost = {
          id: `temp-${Date.now()}`,
          userId: session.user.id,
          postId: recipe.id,
          createdAt: new Date(),
          post: recipe,
        };
        mutate(
          (current: SavedPost[]) => [
            newSavedPost,
            ...(Array.isArray(current) ? current : []),
          ],
          {
            revalidate: false,
          }
        );

        // Make API call to save post
        const response = await fetch("/api/saved-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: recipe.id }),
        });

        if (!response.ok) {
          // Revert optimistic update if API call fails
          mutate();
          throw new Error("Failed to save recipe");
        }

        toast.success("Recipe saved");
      }

      // Revalidate data from backend
      mutate();
    } catch (error) {
      console.error("Save toggle error:", error);
      toast.error("Something went wrong. Please try again.");
      // Revalidate to sync with backend state
      mutate();
    } finally {
      setLoading(false);
      // Re-enable skeleton loading after save operation
      if (setSavingState) {
        setSavingState(false);
      }
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggleSave}
        disabled={loading}
        className={`${
          sizeClasses[size]
        } rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isSaved
            ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
        } ${loading && "opacity-50 cursor-not-allowed"} ${className}`}
        aria-label={`${isSaved ? "Unsave" : "Save"} ${recipe.title}`}
      >
        <FiBookmark
          className={`${iconSizes[size]} transition-colors ${
            isSaved ? "fill-current" : ""
          } ${loading ? "opacity-50" : ""}`}
          aria-hidden="true"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleSave}
      disabled={loading}
      className={`flex items-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md ${
        sizeClasses[size]
      } ${
        isSaved
          ? "text-blue-700 bg-blue-50 hover:bg-blue-100"
          : "text-gray-600 bg-gray-50 hover:text-blue-600 hover:bg-blue-50"
      } ${loading && "opacity-50 cursor-not-allowed"} ${className}`}
      aria-label={`${isSaved ? "Unsave" : "Save"} ${recipe.title}`}
    >
      <FiBookmark
        className={`${iconSizes[size]} transition-colors ${
          isSaved ? "fill-current" : ""
        } ${loading ? "opacity-50" : ""}`}
        aria-hidden="true"
      />
      {showText && (
        <span>{loading ? "Saving..." : isSaved ? "Saved" : "Save"}</span>
      )}
    </button>
  );
}
