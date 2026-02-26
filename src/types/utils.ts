// Utility Types and Helper Functions

import { Post } from "./components";

// Transformation Types
export interface SavedPostData {
  id: string;
  postId: string;
  createdAt: Date;
  source: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  imageUrl: string | null;
  category: string | null;
  prepTime: string | null;
  cookTime: string | null;
  servings: string | null;
  difficulty: string | null;
  tags: string[];
  ingredients?: unknown;
  instructions?: unknown;
  nutrition?: unknown;
}

// Post Data Types
export type PostData = Partial<Post> & {
  originalRecipe?: unknown;
  thumbnail?: string | null;
  imageUrl?: string | null;
};

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule<T = unknown> {
  value: T;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean;
  message?: string;
}

// Filter and Sort Types
export interface FilterCriteria {
  field: string;
  operator:
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan"
    | "between";
  value: unknown;
}

export interface SortCriteria {
  field: string;
  direction: "asc" | "desc";
}

export interface SearchOptions {
  filters?: FilterCriteria[];
  sort?: SortCriteria[];
  limit?: number;
  offset?: number;
}

// Form Types
export interface FormField {
  name: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: ValidationRule[];
  defaultValue?: unknown;
}

export interface FormConfig {
  fields: FormField[];
  submitText?: string;
  cancelText?: string;
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
}

// URL and Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Configuration Types
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  ui: {
    theme: "light" | "dark" | "system";
    animations: boolean;
    breakpoints: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
  features: {
    enableAnalytics: boolean;
    enableNotifications: boolean;
    enableOffline: boolean;
  };
}

// Event Types
export interface EventData {
  [key: string]: unknown;
}

export interface AnalyticsEvent {
  name: string;
  data: EventData;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  stack?: string;
}

export interface ErrorHandler {
  (error: Error | AppError): void;
}

// Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Transform Functions
export function transformSavedPost(savedPost: SavedPostData): Post {
  return {
    id: savedPost.postId,
    title: savedPost.title || "Untitled Recipe",
    description: savedPost.description || "No description available",
    thumbnail: savedPost.thumbnail || undefined,
    imageUrl: savedPost.imageUrl || undefined,
    category: savedPost.category || "Miscellaneous",
    prepTime: savedPost.prepTime || undefined,
    cookTime: savedPost.cookTime || undefined,
    servings: savedPost.servings || undefined,
    difficulty: savedPost.difficulty || undefined,
    tags: savedPost.tags || [],
    views: 0,
    createdAt: savedPost.createdAt,
    updatedAt: savedPost.createdAt,
    originalRecipe: {
      extendedIngredients: savedPost.ingredients || [],
      analyzedInstructions: savedPost.instructions || [],
      nutrition: savedPost.nutrition || { nutrients: [] },
    },
  };
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Generic utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Re-export commonly used types
export type { Post } from "./components";

// Type guards
export function isPostData(value: unknown): value is Post {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as Post).id === "string"
  );
}

export function isSavedPostData(value: unknown): value is SavedPostData {
  return (
    typeof value === "object" &&
    value !== null &&
    "postId" in value &&
    "createdAt" in value
  );
}

// Validation helpers
export function validateRequired<T>(
  value: T,
  fieldName: string,
): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return {
      isValid: false,
      errors: [`${fieldName} is required`],
    };
  }
  return { isValid: true, errors: [] };
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errors: ["Please enter a valid email address"],
    };
  }
  return { isValid: true, errors: [] };
}
