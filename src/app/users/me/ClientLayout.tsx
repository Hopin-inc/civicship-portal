"use client";

import { useQuery } from "@apollo/client";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { GqlUser } from "@/types/graphql";
import { GET_CURRENT_USER_PROFILE } from "@/graphql/account/user/client-query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { notFound } from "next/navigation";

interface CurrentUserProfileQueryResult {
  currentUser?: {
    user?: GqlUser | null;
  } | null;
}

interface ClientLayoutProps {
  children: React.ReactNode;
  ssrUser: GqlUser | null;
  ssrState: "success" | "unauthenticated" | "error";
  ssrError?: string;
}

export function ClientLayout({ children, ssrUser, ssrState, ssrError }: ClientLayoutProps) {
  const { data, loading, error } = useQuery<CurrentUserProfileQueryResult>(GET_CURRENT_USER_PROFILE, {
    skip: ssrState === "success" || ssrState === "error",
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const csrUser = data?.currentUser?.user ?? null;

  // SSR succeeded - just render
  if (ssrState === "success" && ssrUser) {
    return <>{children}</>;
  }

  // SSR failed with server error - show error message, don't retry
  if (ssrState === "error") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>サーバーエラーが発生しました</h2>
        <p>一時的な問題が発生しています。しばらくしてから再度お試しください。</p>
        {ssrError && (
          <details style={{ marginTop: "1rem" }}>
            <summary>エラー詳細</summary>
            <pre style={{ textAlign: "left", background: "#f5f5f5", padding: "1rem" }}>
              {ssrError}
            </pre>
          </details>
        )}
      </div>
    );
  }

  // SSR returned unauthenticated - retry with CSR
  if (loading && !csrUser) {
    return <LoadingIndicator />;
  }

  // CSR also failed to get user - show 404
  if (!csrUser) {
    return notFound();
  }

  const portfolios = (csrUser.portfolios ?? []).map(mapGqlPortfolio);

  return (
    <UserProfileProvider
      value={{
        userId: csrUser.id,
        isOwner: true,
        gqlUser: csrUser,
        portfolios,
      }}
    >
      {children}
    </UserProfileProvider>
  );
}
