import { TimeDisplay } from "./TimeDisplay";
import { FiUsers, FiClock } from "react-icons/fi";

interface RecipeMetadataProps {
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  createdAt?: Date;
  className?: string;
  showIcons?: boolean;
}

export function RecipeMetadata({
  prepTime,
  cookTime,
  servings,
  className = "",
  showIcons = true,
}: RecipeMetadataProps) {
  const servingsIcon = <FiUsers className="w-3 h-3" />;

  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-xs text-gray-500 ${className}`}
    >
      {prepTime && (
        <TimeDisplay
          time={prepTime}
          label="Prep"
          icon={showIcons ? <FiClock className="w-3 h-3" /> : undefined}
        />
      )}
      {cookTime && (
        <TimeDisplay
          time={cookTime}
          label="Cook"
          icon={showIcons ? <FiClock className="w-3 h-3" /> : undefined}
        />
      )}
      {servings && (
        <span className="flex items-center gap-1">
          {showIcons && servingsIcon}
          {servings} servings
        </span>
      )}
    </div>
  );
}
