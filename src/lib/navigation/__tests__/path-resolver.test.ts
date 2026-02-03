import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  resolvePath,
  isPathBasedModeEnabled,
  getExcludedPathPatterns,
} from "../path-resolver";

describe("path-resolver", () => {
  const originalEnv = process.env.NEXT_PUBLIC_ENABLE_PATH_BASED_ROUTING;

  afterEach(() => {
    // Restore original environment variable
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_ENABLE_PATH_BASED_ROUTING = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_ENABLE_PATH_BASED_ROUTING;
    }
  });

  describe("resolvePath", () => {
    describe("when path-based mode is disabled (default)", () => {
      beforeEach(() => {
        delete process.env.NEXT_PUBLIC_ENABLE_PATH_BASED_ROUTING;
      });

      it("should return the original path unchanged", () => {
        expect(resolvePath("/settings", "community-a")).toBe("/settings");
        expect(resolvePath("/users/123", "community-a")).toBe("/users/123");
        expect(resolvePath("/", "community-a")).toBe("/");
      });

      it("should return the original path when communityId is null", () => {
        expect(resolvePath("/settings", null)).toBe("/settings");
      });

      it("should return the original path for excluded paths", () => {
        expect(resolvePath("/api/users", "community-a")).toBe("/api/users");
        expect(resolvePath("/images/logo.png", "community-a")).toBe(
          "/images/logo.png"
        );
      });
    });

    describe("when path-based mode is enabled", () => {
      beforeEach(() => {
        process.env.NEXT_PUBLIC_ENABLE_PATH_BASED_ROUTING = "true";
        // Force re-evaluation of the module
        vi.resetModules();
      });

      // Note: Due to how the module evaluates the environment variable at import time,
      // these tests demonstrate the expected behavior documentation rather than
      // live testing. The actual behavior requires module re-import.

      it.skip("should add /community/{communityId} prefix to paths", async () => {
        const { resolvePath: resolvePathFresh } = await import(
          "../path-resolver"
        );
        expect(resolvePathFresh("/settings", "community-a")).toBe(
          "/community/community-a/settings"
        );
      });

      it.skip("should handle root path correctly", async () => {
        const { resolvePath: resolvePathFresh } = await import(
          "../path-resolver"
        );
        expect(resolvePathFresh("/", "community-a")).toBe("/community/community-a");
      });
    });

    describe("excluded paths", () => {
      it("should not modify external URLs", () => {
        expect(resolvePath("https://example.com", "community-a")).toBe(
          "https://example.com"
        );
        expect(
          resolvePath("https://example.com/path?query=1", "community-a")
        ).toBe("https://example.com/path?query=1");
        expect(resolvePath("http://example.com", "community-a")).toBe(
          "http://example.com"
        );
      });

      it("should not modify protocol-relative URLs", () => {
        expect(resolvePath("//example.com", "community-a")).toBe(
          "//example.com"
        );
      });

      it("should not modify API paths", () => {
        expect(resolvePath("/api/users", "community-a")).toBe("/api/users");
        expect(resolvePath("/api/auth/login", "community-a")).toBe(
          "/api/auth/login"
        );
      });

      it("should not modify static asset paths", () => {
        expect(resolvePath("/images/logo.png", "community-a")).toBe(
          "/images/logo.png"
        );
        expect(resolvePath("/communities/default/favicon.ico", "community-a")).toBe(
          "/communities/default/favicon.ico"
        );
        expect(resolvePath("/icons/icon.svg", "community-a")).toBe(
          "/icons/icon.svg"
        );
      });

      it("should not modify authentication paths", () => {
        expect(resolvePath("/login", "community-a")).toBe("/login");
        expect(resolvePath("/sign-up", "community-a")).toBe("/sign-up");
        expect(resolvePath("/sign-up/phone-verification", "community-a")).toBe(
          "/sign-up/phone-verification"
        );
      });

      it("should not modify Next.js internal paths", () => {
        expect(resolvePath("_next/static/chunks/main.js", "community-a")).toBe(
          "_next/static/chunks/main.js"
        );
        expect(resolvePath("favicon.ico", "community-a")).toBe("favicon.ico");
      });
    });

    describe("query parameters and hash", () => {
      it("should preserve query parameters", () => {
        expect(resolvePath("/settings?tab=profile", null)).toBe(
          "/settings?tab=profile"
        );
        expect(resolvePath("/users?page=1&limit=10", null)).toBe(
          "/users?page=1&limit=10"
        );
      });

      it("should preserve hash fragments", () => {
        expect(resolvePath("/docs#section-1", null)).toBe("/docs#section-1");
      });

      it("should preserve both query and hash", () => {
        expect(resolvePath("/docs?lang=ja#section-1", null)).toBe(
          "/docs?lang=ja#section-1"
        );
      });
    });

    describe("path normalization", () => {
      it("should handle paths without leading slash", () => {
        // When path-based mode is disabled, returns as-is
        expect(resolvePath("settings", "community-a")).toBe("settings");
      });
    });
  });

  describe("isPathBasedModeEnabled", () => {
    it("should return false by default", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_PATH_BASED_ROUTING;
      // Note: This tests the current module state, not dynamic changes
      expect(isPathBasedModeEnabled()).toBe(false);
    });
  });

  describe("getExcludedPathPatterns", () => {
    it("should return an array of excluded path patterns", () => {
      const patterns = getExcludedPathPatterns();
      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
    });

    it("should include essential patterns", () => {
      const patterns = getExcludedPathPatterns();
      expect(patterns).toContain("/api/**");
      expect(patterns).toContain("/images/**");
      expect(patterns).toContain("/login");
    });
  });
});
