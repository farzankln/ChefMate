import type { BadgeProps } from "@/types/components";

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: BadgeProps) {
  const baseClasses = "inline-block font-medium rounded-full transition-colors";

  const variantClasses = {
    default: "text-gray-700 bg-gray-100",
    category: "text-white bg-blue-600",
    difficulty: "", // Will be determined by content
    tag: "text-gray-600 bg-gray-100 hover:bg-gray-200",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const getDifficultyColor = (content: string) => {
    switch (content.toLowerCase()) {
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

  const getClasses = () => {
    if (variant === "difficulty") {
      return `${baseClasses} ${sizeClasses[size]} ${getDifficultyColor(
        String(children)
      )} ${className}`;
    }
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  };

  return <span className={getClasses()}>{children}</span>;
}
