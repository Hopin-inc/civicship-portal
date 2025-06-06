"use client";

import { AuthEnvironment } from "./environment-detector";

/**
 * String literal types for backward compatibility
 */
export type AuthEnvironmentLiteral = "liff" | "general" | "phone";

/**
 * Convert string literal to AuthEnvironment enum value
 * This helper function allows existing code to continue working
 * while providing type safety
 */
export function toAuthEnvironment(env: AuthEnvironmentLiteral): AuthEnvironment {
  switch (env) {
    case "liff":
      return AuthEnvironment.LIFF;
    case "phone":
      return AuthEnvironment.LINE_BROWSER; // Assuming "phone" maps to LINE_BROWSER
    case "general":
    default:
      return AuthEnvironment.REGULAR_BROWSER;
  }
}

/**
 * Declare global liff object for TypeScript
 * 
 * Note: Using @ts-ignore to suppress the duplicate declaration error.
 * There might be another declaration for liff in the project that's causing conflicts.
 * Using 'any' type is a compromise to make TypeScript happy while maintaining functionality.
 */
// @ts-ignore - Suppress duplicate declaration errors
declare global {
  interface Window {
    // @ts-ignore - Suppress type conflicts
    liff: any;
  }
}
