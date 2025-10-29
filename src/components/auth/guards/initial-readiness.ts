import { SsrAuthSnapshot } from "@/types/auth";
import { isProtectedPath, isAuthEntryPath } from "@/lib/auth/guards/route-rules";
import { deriveAuthState } from "@/lib/auth/state/derive-auth-state";

export function computeInitialGuardReadiness(
  pathname: string,
  ssrSnapshot: SsrAuthSnapshot,
  searchParams: URLSearchParams,
): boolean {
  if (typeof window !== "undefined" && pathname === "/") {
    const isReturnFromLineAuth =
      searchParams.has("code") && searchParams.has("state") && searchParams.has("liffClientId");
    if (isReturnFromLineAuth) {
      return false;
    }
  }

  const authState = deriveAuthState(ssrSnapshot);

  if (authState === "unknown") {
    return false;
  }

  const isProtected = isProtectedPath(pathname);
  const isAuthEntry = isAuthEntryPath(pathname);

  if (isProtected && authState === "needs_redirect") {
    return false;
  }

  if (isAuthEntry && authState === "ready") {
    return false;
  }

  return true;
}
