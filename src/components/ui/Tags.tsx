import { Badge } from "./Badge";
import type { TagsProps } from "@/types/components";

export function Tags({
  tags,
  maxDisplay = 3,
  className = "",
  showCount = true,
}: TagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayedTags = tags.slice(0, maxDisplay);
  const remainingCount = tags.length - maxDisplay;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayedTags.map((tag, index) => (
        <Badge key={index} variant="tag" size="sm">
          #{tag}
        </Badge>
      ))}
      {showCount && remainingCount > 0 && (
        <Badge variant="tag" size="sm" className="text-gray-500 bg-gray-50">
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}
