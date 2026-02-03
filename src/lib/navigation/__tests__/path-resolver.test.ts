import { describe, expect, it } from "vitest";
import { resolvePath, getExcludedPathPatterns } from "../path-resolver";

describe("path-resolver", () => {
  describe("resolvePath", () => {
    describe("basic path resolution", () => {
      it("should add /community/{communityId} prefix to paths", () => {
        expect(resolvePath("/settings", "community-a")).toBe(
          "/community/community-a/settings"
        );
        expect(resolvePath("/users/123", "community-a")).toBe(
          "/community/community-a/users/123"
        );
      });

      it("should handle root path correctly", () => {
        expect(resolvePath("/", "community-a")).toBe("/community/community-a");
      });

      it("should return the original path when communityId is null", () => {
        expect(resolvePath("/settings", null)).toBe("/settings");
      });

      it("should return the original path when communityId is empty string", () => {
        expect(resolvePath("/settings", "")).toBe("/settings");
      });
    });

    describe("security validation", () => {
      it("should reject communityId with invalid characters", () => {
        expect(resolvePath("/settings", "../etc/passwd")).toBe("/settings");
        expect(resolvePath("/settings", "community/../../")).toBe("/settings");
        expect(resolvePath("/settings", "community<script>")).toBe("/settings");
      });

      it("should accept valid communityId with alphanumeric and hyphen", () => {
        expect(resolvePath("/settings", "community-a")).toBe(
          "/community/community-a/settings"
        );
        expect(resolvePath("/settings", "himeji-ymca")).toBe(
          "/community/himeji-ymca/settings"
        );
        expect(resolvePath("/settings", "test123")).toBe(
          "/community/test123/settings"
        );
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
        expect(
          resolvePath("/communities/default/favicon.ico", "community-a")
        ).toBe("/communities/default/favicon.ico");
        expect(resolvePath("/icons/icon.svg", "community-a")).toBe(
          "/icons/icon.svg"
        );
      });

      it("should not modify Next.js internal paths", () => {
        expect(resolvePath("_next/static/chunks/main.js", "community-a")).toBe(
          "_next/static/chunks/main.js"
        );
        expect(resolvePath("favicon.ico", "community-a")).toBe("favicon.ico");
      });
    });

    describe("community-dependent paths (now included)", () => {
      it("should add prefix to login paths", () => {
        expect(resolvePath("/login", "community-a")).toBe(
          "/community/community-a/login"
        );
        expect(resolvePath("/login/callback", "community-a")).toBe(
          "/community/community-a/login/callback"
        );
      });

      it("should add prefix to sign-up paths", () => {
        expect(resolvePath("/sign-up", "community-a")).toBe(
          "/community/community-a/sign-up"
        );
        expect(resolvePath("/sign-up/phone-verification", "community-a")).toBe(
          "/community/community-a/sign-up/phone-verification"
        );
      });

      it("should add prefix to terms and privacy paths", () => {
        expect(resolvePath("/terms", "community-a")).toBe(
          "/community/community-a/terms"
        );
        expect(resolvePath("/privacy", "community-a")).toBe(
          "/community/community-a/privacy"
        );
      });
    });

    describe("query parameters and hash", () => {
      it("should preserve query parameters", () => {
        expect(resolvePath("/settings?tab=profile", "community-a")).toBe(
          "/community/community-a/settings?tab=profile"
        );
        expect(resolvePath("/users?page=1&limit=10", "community-a")).toBe(
          "/community/community-a/users?page=1&limit=10"
        );
      });

      it("should preserve hash fragments", () => {
        expect(resolvePath("/docs#section-1", "community-a")).toBe(
          "/community/community-a/docs#section-1"
        );
      });

      it("should preserve both query and hash", () => {
        expect(resolvePath("/docs?lang=ja#section-1", "community-a")).toBe(
          "/community/community-a/docs?lang=ja#section-1"
        );
      });

      it("should return original path with query when communityId is null", () => {
        expect(resolvePath("/settings?tab=profile", null)).toBe(
          "/settings?tab=profile"
        );
      });
    });

    describe("path normalization", () => {
      it("should handle paths without leading slash", () => {
        expect(resolvePath("settings", "community-a")).toBe(
          "/community/community-a/settings"
        );
      });
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
    });

    it("should NOT include login/sign-up/terms/privacy (they are community-dependent)", () => {
      const patterns = getExcludedPathPatterns();
      expect(patterns).not.toContain("/login");
      expect(patterns).not.toContain("/sign-up");
      expect(patterns).not.toContain("/terms");
      expect(patterns).not.toContain("/privacy");
    });
  });
});
