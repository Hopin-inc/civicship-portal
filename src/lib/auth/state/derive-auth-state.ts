import { SsrAuthSnapshot } from "@/types/auth";

export function deriveAuthState(snapshot: SsrAuthSnapshot): "ready" | "needs_redirect" | "unknown" {
  if (!snapshot.hasUser) {
    return "needs_redirect";
  }
  if (snapshot.userRegistered) {
    return "ready";
  }
  return "needs_redirect";
}
