"use client";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

/**
 * Root page component.
 *
 * This page is primarily used as a transient entry point for LIFF deep-links.
 * When LIFF launches with `/?liff.state=/target/path`, this page renders briefly
 * before the LiffDeepLinkHandler navigates to the target path.
 *
 * For normal browser access, middleware redirects `/` to the community's rootPath
 * (e.g., `/opportunities` or `/users/me`), so this page is not typically visible.
 *
 * Note: If a community with `rootPath: "/"` is added in the future, this page
 * should be updated to display appropriate content instead of just a loading indicator.
 */
export default function HomePage() {
  return <LoadingIndicator fullScreen={true} />;
}
