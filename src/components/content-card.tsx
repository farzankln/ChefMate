"use client";

import { useSession } from "next-auth/react";
import { useSavedPostsContext } from "./SavedPostsProvider";
import { useState } from "react";
import toast from "react-hot-toast";
import SaveSkeleton from "./SkeletonLoading";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Post {
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
}

interface SavedPost {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
  post: Post | null; // Post might be null for external recipes
}

interface ContentCardProps {
  post: Post;
}

export function ContentCard({ post }: ContentCardProps) {
  const { savedPosts, isLoading, mutate } = useSavedPostsContext();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [localImageError, setLocalImageError] = useState(false);
  const router = useRouter();

  // Check if current post is saved by user
  const isSaved =
    Array.isArray(savedPosts) &&
    savedPosts.some((item: SavedPost) => item.postId === post.id);

  const toggleSave = async () => {
    if (!session) {
      // Open auth modal for unauthenticated users
      document.dispatchEvent(new CustomEvent("open-auth-modal"));
      return;
    }

    setLoading(true);

    try {
      if (isSaved) {
        // Optimistic update - remove from saved posts
        mutate(
          (current: SavedPost[]) =>
            Array.isArray(current)
              ? current.filter((item) => item.postId !== post.id)
              : [],
          { revalidate: false }
        );

        // Make API call to remove from saved posts
        const response = await fetch(`/api/saved-posts/${post.id}`, {
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
          postId: post.id,
          createdAt: new Date(),
          post: post,
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
          body: JSON.stringify({ postId: post.id }),
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
    }
  };

  // Show skeleton while loading saved posts
  if (isLoading) {
    return <SaveSkeleton />;
  }

  const handleCardClick = () => {
    router.push(`/recipe/${post.id}`);
  };

  const handleSaveClick = () => {
    toggleSave();
  };

  const formatTime = (time: string) => {
    if (time.includes("min")) return time;
    return `${time} min`;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-700 bg-green-100";
      case "medium":
        return "text-yellow-700 bg-yellow-100";
      case "hard":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getImageSrc = () => {
    if (localImageError) return null;
    return post.imageUrl || post.thumbnail;
  };

  return (
    <article
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
      role="article"
      aria-labelledby={`post-title-${post.id}`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {getImageSrc() ? (
          <Image
            src={getImageSrc()!}
            alt={post.title || "Recipe"}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setLocalImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-white opacity-80"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Overlay with category and difficulty */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {post.category && (
            <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
              {post.category}
            </span>
          )}
          {post.difficulty && (
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                post.difficulty
              )}`}
            >
              {post.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3
          id={`post-title-${post.id}`}
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
        >
          {post.title || "Untitled Recipe"}
        </h3>

        {/* Description */}
        {post.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {post.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
          {post.prepTime && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Prep: {formatTime(post.prepTime)}
            </span>
          )}
          {post.cookTime && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Cook: {formatTime(post.cookTime)}
            </span>
          )}
          {post.servings && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {post.servings} servings
            </span>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Author and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          {post.author && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              {post.author}
            </span>
          )}
          {post.createdAt && (
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          {/* Like Counter */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <svg
              className="w-4 h-4 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{post.likes || 0}</span>
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSaveClick();
            }}
            disabled={loading}
            className={`flex items-center gap-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full px-2 py-1 ${
              isSaved
                ? "text-blue-600 hover:text-blue-700 bg-blue-50"
                : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            } ${loading && "opacity-50 cursor-not-allowed"}`}
            aria-label={`${isSaved ? "Unsave" : "Save"} ${post.title}`}
          >
            <svg
              className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span>{loading ? "Saving..." : isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
