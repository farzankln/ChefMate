/**
 * Chef Mate TypeScript Types
 *
 * This file serves as the main entry point for all TypeScript types in the project.
 * Individual type categories are organized in separate files for better maintainability.
 */

// Recipe and food-related types (excluding conflicting types)
export type {
  Recipe,
  RecipeIngredient,
  RecipeStep,
  RecipeInstruction,
  RecipeNutrient,
  RecipeNutrition,
  SpoonacularRecipe,
  SimilarRecipe,
} from "./recipe";

// API and external service types (excluding conflicting types)
export type {
  ComplexSearchParams,
  RecipeInfoParams,
  SpoonacularSearchResult,
  SpoonacularComplexSearchResponse,
  SpoonacularSimilarRecipe,
  SpoonacularRandomRecipeResponse,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from "./api";

// Database and Prisma types (excluding conflicting types)
export type {
  User,
  Post,
  SavedPost,
  PostWithRelations,
  UserWithRelations,
  SavedPostWithRelations,
  PostQueryResult,
  SavedPostQueryResult,
  CreatePostData,
  UpdatePostData,
  CreateSavedPostData,
  PostFilters,
  SavedPostFilters,
  PostStatus,
  PostSource,
  UserProvider,
} from "./database";

// Component prop types and UI types (selective export to avoid conflicts)
export type {
  BadgeProps,
  SkeletonProps,
  ImageWithFallbackProps,
  EmptyStateProps,
  TimeDisplayProps,
  TagsProps,
  RecipeMetadataProps,
  Tab,
  TabsProps,
  SaveButtonProps,
  NavigationProps,
  AuthModalProps,
  ContentCardProps,
  SimilarRecipesProps,
  RecipeHeaderProps,
  RecipeSidebarProps,
  RecipeTabsProps,
  RecipeIngredientsProps,
  RecipeInstructionsProps,
  RecipeNutritionProps,
  SavedRecipesListProps,
  ComponentSize,
  ComponentVariant,
  ComponentState,
  UseSavedPostsReturn,
} from "./components";

// React context and state management types (excluding conflicting types)
export type {
  SavedPostsContextType,
  SavedPostsProviderProps,
  ThemeContextType,
  AuthContextType,
  RecipeContextType,
  SearchContextType,
  SearchFilters,
  ModalContextType,
  NotificationContextType,
  Notification,
  AsyncState,
  AsyncAction,
  ReducerState,
  UseContextHookReturn,
} from "./context";

// Utility types and helper functions (excluding conflicting types)
export type {
  SavedPostData,
  PostData,
  ValidationResult,
  ValidationRule,
  FilterCriteria,
  SortCriteria,
  SearchOptions,
  FormField,
  FormConfig,
  NavigationItem,
  BreadcrumbItem,
  AppConfig,
  EventData,
  AnalyticsEvent,
  AppError,
  ErrorHandler,
  Optional,
  RequiredFields,
  PartialExcept,
  DeepPartial,
  NonNullable,
  Awaited,
  Prettify,
} from "./utils";

// Export new enhanced recipe data types
export type {
  ExtendedIngredients,
  AnalyzedInstruction,
  NutritionNutrients,
  NutritionData,
  OriginalRecipeData,
} from "./utils";

// Version information
export const TYPES_VERSION = "1.0.0";

// Re-export commonly used types for convenience
// (Already exported above to avoid conflicts)
