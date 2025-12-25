"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface Post {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  imageUrl?: string;
  author?: string;
  category?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  tags?: string[];
  views: number;
  likes: number;
  createdAt: string;
}

interface ContentCardProps {
  post: Post;
  onLikeToggle?: (postId: string, isLiked: boolean) => void;
  onViewIncrement?: (postId: string) => void;
  isLocked?: boolean;
}

export default function ContentCard({
  post,
  onLikeToggle,
  onViewIncrement,
  isLocked = false,
}: ContentCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [localViews, setLocalViews] = useState(post.views);
  const [isLoading, setIsLoading] = useState(false);
  const [localImageError, setLocalImageError] = useState(false);
  const { data: session } = useSession();

  // Initialize like state from localStorage for anonymous users
  useEffect(() => {
    if (!session) {
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
      setIsLiked(likedPosts.includes(post.id));
    }
  }, [post.id, session]);

  // Initialize views from localStorage for anonymous users
  useEffect(() => {
    if (!session) {
      const storedViews = localStorage.getItem(`views_${post.id}`);
      if (storedViews) {
        setLocalViews(parseInt(storedViews, 10));
      }
    }
  }, [post.id, session]);

  const handleLikeClick = async () => {
    setIsLoading(true);

    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);

      if (!session) {
        // Handle anonymous user with localStorage
        const likedPosts = JSON.parse(
          localStorage.getItem("likedPosts") || "[]"
        );
        if (newIsLiked) {
          likedPosts.push(post.id);
        } else {
          const index = likedPosts.indexOf(post.id);
          if (index > -1) {
            likedPosts.splice(index, 1);
          }
        }
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
      } else {
        // Handle authenticated user with API call
        const response = await fetch("/api/posts/like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post.id,
            isLiked: newIsLiked,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to toggle like");
        }
      }

      onLikeToggle?.(post.id, newIsLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert state on error
      setIsLiked(!isLiked);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    if (!session) {
      // Increment local view count for anonymous users
      const newViews = localViews + 1;
      setLocalViews(newViews);
      localStorage.setItem(`views_${post.id}`, newViews.toString());
    } else {
      // Call API to increment view count for authenticated users
      onViewIncrement?.(post.id);
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    return timeStr;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getImageSrc = () => {
    if (localImageError || (!post.thumbnail && !post.imageUrl)) {
      return "";
    }
    return post.thumbnail || post.imageUrl || "";
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
            src={getImageSrc()}
            alt={post.title}
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

        {/* Lock indicator for authenticated users */}
        {session && isLocked && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="Locked recipe"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3
          id={`post-title-${post.id}`}
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
        >
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {post.description}
        </p>

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
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          {/* Views */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{session ? post.views : localViews}</span>
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikeClick();
            }}
            disabled={isLoading}
            className={`flex items-center gap-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full px-2 py-1 ${
              isLiked
                ? "text-red-600 hover:text-red-700 bg-red-50"
                : "text-gray-500 hover:text-red-600 hover:bg-red-50"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={`${isLiked ? "Unlike" : "Like"} ${post.title}`}
          >
            <svg
              className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
              fill="none"
              stroke="currentColor"
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
            <span>{session ? post.likes : post.likes + (isLiked ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
