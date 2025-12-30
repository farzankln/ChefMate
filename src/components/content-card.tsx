"use client";

import { useRouter } from "next/navigation";
import { SaveButton } from "./ui/SaveButton";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { Badge } from "./ui/Badge";
import { RecipeMetadata } from "./ui/RecipeMetadata";
import { Tags } from "./ui/Tags";
import { CardSkeleton } from "@/components/skeletons";
import { useSavedPostsContext } from "./SavedPostsProvider";
import type { SavedPost } from "@/types/context";
import type { Post, ContentCardProps } from "@/types/components";

export function ContentCard({ post }: ContentCardProps) {
  const { savedPosts, isLoading } = useSavedPostsContext();
  const router = useRouter();

  // Check if current post is saved by user
  const isSaved =
    Array.isArray(savedPosts) &&
    savedPosts.some((item: SavedPost) => item.postId === post.id);

  // Show skeleton while loading saved posts
  if (isLoading) {
    return <CardSkeleton />;
  }

  const handleCardClick = () => {
    router.push(`/recipe/${post.id}`);
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
        <ImageWithFallback
          src={post.imageUrl || post.thumbnail}
          alt={post.title || "Recipe"}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay with category and difficulty */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {post.category && (
            <Badge variant="category" size="sm">
              {post.category}
            </Badge>
          )}
          {post.difficulty && (
            <Badge variant="difficulty" size="sm">
              {post.difficulty}
            </Badge>
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
        <RecipeMetadata
          prepTime={post.prepTime}
          cookTime={post.cookTime}
          servings={post.servings}
          difficulty={post.difficulty}
          author={post.author}
          createdAt={post.createdAt}
          className="mb-3"
        />

        {/* Tags */}
        <Tags tags={post.tags || []} className="mb-3" />

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          {/* Save Button */}
          <SaveButton
            recipe={post}
            variant="button"
            size="sm"
            showText={false}
          />
        </div>
      </div>
    </article>
  );
}
