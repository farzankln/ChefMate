import { TimeDisplay } from "./TimeDisplay";
import { Badge } from "./Badge";
import { FiUsers, FiUser } from "react-icons/fi";

interface RecipeMetadataProps {
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  author?: string;
  createdAt?: Date;
  className?: string;
  showIcons?: boolean;
}

export function RecipeMetadata({
  prepTime,
  cookTime,
  servings,
  difficulty,
  author,
  createdAt,
  className = "",
  showIcons = true,
}: RecipeMetadataProps) {
  const servingsIcon = <FiUsers className="w-3 h-3" />;

  const authorIcon = <FiUser className="w-3 h-3" />;

  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-xs text-gray-500 ${className}`}
    >
      {prepTime && (
        <TimeDisplay
          time={prepTime}
          label="Prep"
          icon={showIcons ? undefined : undefined}
        />
      )}
      {cookTime && (
        <TimeDisplay
          time={cookTime}
          label="Cook"
          icon={showIcons ? undefined : undefined}
        />
      )}
      {servings && (
        <span className="flex items-center gap-1">
          {showIcons && servingsIcon}
          {servings} servings
        </span>
      )}
      {difficulty && (
        <Badge variant="difficulty" size="sm">
          {difficulty}
        </Badge>
      )}
      {author && (
        <span className="flex items-center gap-1">
          {showIcons && authorIcon}
          {author}
        </span>
      )}
      {createdAt && <span>{new Date(createdAt).toLocaleDateString()}</span>}
    </div>
  );
}
