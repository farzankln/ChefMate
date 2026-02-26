// Context and State Management Types

import { ReactNode } from "react";
import { Post } from "./components";

// Saved Posts Context Types
export interface SavedPost {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
  post: {
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
  } | null; // Post might be null for external recipes
  // Enhanced recipe data fields
  ingredients?: unknown;
  instructions?: unknown;
  nutrition?: unknown;
}

export interface SavedPostsContextType {
  savedPosts: SavedPost[];
  isLoading: boolean;
  isError: Error | null;
  mutate: (
    data?: SavedPost[] | ((current: SavedPost[]) => SavedPost[]),
    options?: { revalidate?: boolean },
  ) => Promise<SavedPost[] | undefined>;
}

export interface SavedPostsProviderProps {
  children: ReactNode;
}

// Theme Context Types (for future theme implementation)
export interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  resolvedTheme: "light" | "dark";
}

// Auth Context Types (for future auth implementation)
export interface AuthContextType {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (
    provider: string,
    credentials?: Record<string, unknown>,
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

// Recipe Context Types (for future recipe state management)
export interface RecipeContextType {
  currentRecipe: Post | null;
  setCurrentRecipe: (recipe: Post | null) => void;
  isRecipeLoading: boolean;
  recipeError: string | null;
}

// Search Context Types (for future search state management)
export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Post[];
  isSearchLoading: boolean;
  searchError: string | null;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  category?: string;
  difficulty?: string;
  prepTime?: string;
  tags?: string[];
  sortBy?: "relevance" | "newest" | "oldest" | "views";
}

// Modal Context Types (for modal state management)
export interface ModalContextType {
  isModalOpen: boolean;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  currentModal: string | null;
  modalData: Record<string, unknown> | null;
}

// Notification Context Types (for notification state management)
export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  timestamp: Date;
  duration?: number; // in milliseconds, null for persistent
  action?: {
    label: string;
    onClick: () => void;
  };
}

// State Management Utility Types
export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface AsyncAction<T = unknown> {
  type: "loading" | "success" | "error" | "reset";
  payload?: T;
}

export interface ReducerState<S, A = AsyncAction> {
  state: S;
  dispatch: React.Dispatch<A>;
}

// Provider Props Types
export interface ProvidersProps {
  children: ReactNode;
}

// Context Provider Factory Types
export interface ContextProviderConfig<T> {
  Context: React.Context<T>;
  Provider: React.ComponentType<{ children: ReactNode; value: T }>;
  hook: () => T;
}

// Error Boundary Types
export interface ErrorInfo {
  componentStack: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Custom Hook Return Types
export interface UseContextHookReturn<T> {
  context: T;
  isLoaded: boolean;
  hasError: boolean;
  error: Error | null;
}

// Re-export commonly used types
export type { Post } from "./components";
