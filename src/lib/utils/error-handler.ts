/**
 * Standardized Error Handling Utilities
 * Provides consistent error handling patterns across the application
 */

import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

/**
 * Type guard to check if error is an Error instance
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Type guard to check if error is a Prisma error
 */
export function isPrismaError(
  value: unknown,
): value is Prisma.PrismaClientKnownRequestError {
  return isError(value) && "code" in value && typeof value.code === "string";
}

/**
 * Get error message from unknown error
 */
export function getErrorMessage(
  error: unknown,
  fallback: string = "An error occurred",
): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return fallback;
}

/**
 * Create a standardized NextResponse error
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: Record<string, unknown>,
): NextResponse<{ error: string; details?: Record<string, unknown> }> {
  return NextResponse.json(
    { error: message, ...(details && { details }) },
    { status },
  );
}

/**
 * Handle Prisma-specific errors and return appropriate response
 */
export function handlePrismaError(error: unknown): NextResponse | null {
  if (!isPrismaError(error)) {
    return null;
  }

  // Handle unique constraint violation
  if (error.code === "P2002") {
    return createErrorResponse("Resource already exists", 409);
  }

  // Handle record not found
  if (error.code === "P2025") {
    return createErrorResponse("Resource not found", 404);
  }

  return null;
}

/**
 * Wrapper for API route handlers with consistent error handling
 */
export async function withErrorHandling<T>(
  handler: () => Promise<T>,
  options: {
    onError?: (error: unknown) => void;
    errorMessage?: string;
  } = {},
): Promise<NextResponse | T> {
  try {
    return await handler();
  } catch (error) {
    const errorMessage = options.errorMessage || "An unexpected error occurred";

    // Log the error
    console.error(`Error: ${errorMessage}`, error);

    // Call custom error handler if provided
    if (options.onError) {
      options.onError(error);
    }

    // Check for Prisma-specific errors
    const prismaResponse = handlePrismaError(error);
    if (prismaResponse) {
      return prismaResponse;
    }

    // Return generic error response
    return createErrorResponse(getErrorMessage(error, errorMessage), 500);
  }
}

/**
 * Wrapper for synchronous API route handlers with consistent error handling
 */
export function withErrorHandlingSync<T>(
  handler: () => T,
  options: {
    onError?: (error: unknown) => void;
    errorMessage?: string;
  } = {},
): NextResponse | T {
  try {
    return handler();
  } catch (error) {
    const errorMessage = options.errorMessage || "An unexpected error occurred";

    // Log the error
    console.error(`Error: ${errorMessage}`, error);

    // Call custom error handler if provided
    if (options.onError) {
      options.onError(error);
    }

    // Check for Prisma-specific errors
    const prismaResponse = handlePrismaError(error);
    if (prismaResponse) {
      return prismaResponse;
    }

    // Return generic error response
    return createErrorResponse(getErrorMessage(error, errorMessage), 500);
  }
}
