// Component Props and UI Types

import { ReactNode } from "react";
import type { Recipe } from "./recipe";
import type { Session } from "next-auth";

// Core Post interface used across components
export interface Post {
  id: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  imageUrl?: string;
  category?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  tags?: string[];
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Basic UI Component Props
export interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "category" | "difficulty" | "tag";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface SkeletonProps {
  variant?: "text" | "rectangular" | "circular";
  className?: string;
  width?: string | number;
  height?: string | number;
  children?: ReactNode;
}

export interface ImageWithFallbackProps {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

// Time and Content Display
export interface TimeDisplayProps {
  time: string;
  label?: string;
  icon?: ReactNode;
  className?: string;
}

export interface TagsProps {
  tags: string[];
  className?: string;
  maxDisplay?: number;
  showCount?: boolean;
}

export interface RecipeMetadataProps {
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  createdAt?: Date;
  className?: string;
}

// Tab Component Types
export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

// Button and Action Components
export interface SaveButtonProps {
  recipe: {
    id: string;
    title?: string;
    thumbnail?: string;
    imageUrl?: string;
  };
  variant?: "icon" | "button";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  openAuthModal?: boolean;
  onSave?: (recipeId: string) => void;
  onUnsave?: (recipeId: string) => void;
  setSavingState?: (saving: boolean) => void;
}

// Layout and Navigation
export interface NavigationProps {
  className?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
  postTitle?: string;
}

// Content Display Components
export interface ContentCardProps {
  post: Post;
  className?: string;
}

export interface SimilarRecipesProps {
  recipes: Recipe[];
  className?: string;
}

// Recipe Detail Components
export interface RecipeHeaderProps {
  recipe: Recipe;
  className?: string;
}

export interface RecipeSidebarProps {
  recipe: Recipe;
  className?: string;
}

export interface RecipeTabsProps {
  recipe: Recipe;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export interface RecipeIngredientsProps {
  recipe: Recipe;
  className?: string;
}

export interface RecipeInstructionsProps {
  recipe: Recipe;
  className?: string;
}

export interface RecipeNutritionProps {
  recipe: Recipe;
  className?: string;
}

// Provider Components
export interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

// Dashboard Components
export interface DashboardHeaderProps {
  userName: string;
  className?: string;
}

export interface SavedRecipesListProps {
  savedPosts: Array<Record<string, unknown>>;
  className?: string;
  isLoading?: boolean;
}

// Re-export commonly used types
export type { Recipe } from "./recipe";

// Utility types for components
export type ComponentSize = "sm" | "md" | "lg";
export type ComponentVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost";
export type ComponentState = "default" | "loading" | "error" | "success";

// Hook return types
// Note: UseRecipeDetailReturn is now imported from recipe.ts

export interface UseSavedPostsReturn<T = Post> {
  savedPosts: T[];
  isLoading: boolean;
  isError: Error | null;
  mutate: (
    data?: T[] | ((current: T[]) => T[]),
    options?: { revalidate?: boolean },
  ) => Promise<T[] | undefined>;
}
