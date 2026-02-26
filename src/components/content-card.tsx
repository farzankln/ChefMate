"use client";

import { useRouter } from "next/navigation";
import { SaveButton } from "./ui/SaveButton";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { Badge } from "./ui/Badge";
import { RecipeMetadata } from "./ui/RecipeMetadata";
import { Tags } from "./ui/Tags";
import { CardSkeleton } from "@/components/skeletons";
import { useSavedPostsContext } from "./SavedPostsProvider";
import type { ContentCardProps } from "@/types/components";

export function ContentCard({ post }: ContentCardProps) {
  const { isLoading } = useSavedPostsContext();
  const router = useRouter();

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

        {/* Badges - Category on left, Difficulty on right */}
        <div className="absolute top-2 left-2">
          {post.category && (
            <Badge variant="category" size="sm">
              {post.category}
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2">
          {post.difficulty && (
            <Badge variant="difficulty" size="sm">
              {post.difficulty}
            </Badge>
          )}
        </div>

        {/* Save Button - Bottom Right with responsive styling */}
        {/* Desktop: button with text, Mobile: icon only */}
        <div className="absolute bottom-2 right-2 z-10">
          <SaveButton
            recipe={post}
            variant="icon"
            size="sm"
            showText={false}
            className="lg:hidden bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg rounded-full p-2"
          />
          <div className="hidden lg:block">
            <SaveButton
              recipe={post}
              variant="button"
              size="sm"
              showText={true}
              className="bg-white shadow-md hover:shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3
          id={`post-title-${post.id}`}
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors"
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
          createdAt={post.createdAt}
          className="mb-3"
        />

        {/* Tags */}
        <Tags tags={post.tags || []} className="mb-3" />

        {/* Actions - Removed, save button is now on image */}
      </div>
    </article>
  );
}
