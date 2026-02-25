/**
 * API Response Type Definitions
 *
 * Standardized response types for API routes to ensure consistent
 * response structure across the application.
 */

// Base API response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generic success response
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Generic error response
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  statusCode?: number;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Paginated response type
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Response with metadata
export interface ResponseWithMeta<T, M = unknown> {
  data: T;
  meta: M;
}

// Created resource response
export interface CreatedResponse<T> {
  success: true;
  data: T;
  message: string;
  statusCode: 201;
}

// Updated resource response
export interface UpdatedResponse<T> {
  success: true;
  data: T;
  message: string;
}

// Deleted resource response
export interface DeletedResponse {
  success: true;
  message: string;
  id: string;
}

// Validation error response
export interface ValidationErrorResponse {
  success: false;
  error: string;
  validationErrors: Record<string, string[]>;
  statusCode: 422;
}

// Not found response
export interface NotFoundResponse {
  success: false;
  error: string;
  resourceType?: string;
  id?: string;
  statusCode: 404;
}

// Unauthorized response
export interface UnauthorizedResponse {
  success: false;
  error: string;
  message?: string;
  statusCode: 401;
}

// Forbidden response
export interface ForbiddenResponse {
  success: false;
  error: string;
  message?: string;
  statusCode: 403;
}

// Conflict response (e.g., duplicate resource)
export interface ConflictResponse {
  success: false;
  error: string;
  conflictingField?: string;
  statusCode: 409;
}

// Builder functions for creating standardized responses
export function createSuccessResponse<T>(
  data: T,
  message?: string,
): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function createErrorResponse(
  error: string,
  statusCode: number = 500,
  code?: string,
): ErrorResponse {
  return {
    success: false,
    error,
    code,
    statusCode,
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}

export function createValidationErrorResponse(
  errors: Record<string, string[]>,
): ValidationErrorResponse {
  return {
    success: false,
    error: "Validation failed",
    validationErrors: errors,
    statusCode: 422,
  };
}

export function createNotFoundResponse(
  resourceType: string,
  id?: string,
): NotFoundResponse {
  return {
    success: false,
    error: `${resourceType} not found`,
    resourceType: id ? resourceType : undefined,
    id,
    statusCode: 404,
  };
}

export function createUnauthorizedResponse(
  message?: string,
): UnauthorizedResponse {
  return {
    success: false,
    error: "Unauthorized",
    message: message || "You must be logged in to access this resource",
    statusCode: 401,
  };
}

export function createForbiddenResponse(message?: string): ForbiddenResponse {
  return {
    success: false,
    error: "Forbidden",
    message: message || "You do not have permission to access this resource",
    statusCode: 403,
  };
}

export function createConflictResponse(
  message: string,
  conflictingField?: string,
): ConflictResponse {
  return {
    success: false,
    error: message,
    conflictingField,
    statusCode: 409,
  };
}

export function createCreatedResponse<T>(
  data: T,
  message: string = "Resource created successfully",
): CreatedResponse<T> {
  return {
    success: true,
    data,
    message,
    statusCode: 201,
  };
}

export function createDeletedResponse(
  id: string,
  message?: string,
): DeletedResponse {
  return {
    success: true,
    message: message || "Resource deleted successfully",
    id,
  };
}

// Type guard functions
export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is SuccessResponse<T> {
  return response.success === true && response.data !== undefined;
}

export function isErrorResponse<T>(
  response: ApiResponse<T>,
): response is ErrorResponse {
  return response.success === false && response.error !== undefined;
}

export function isPaginatedResponse<T>(response: ApiResponse<T>): boolean {
  const data = response.data;
  return (
    response.success === true &&
    data !== undefined &&
    data !== null &&
    typeof data === "object" &&
    "pagination" in data
  );
}
