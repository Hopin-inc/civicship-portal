"use client";

import { useEffect, useRef } from "react";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import UserProfileSection from "@/app/users/components/UserProfileSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";
import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import ErrorState from "@/components/shared/ErrorState";

export default function MyProfilePage() {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { user: currentUser, isAuthenticating } = useAuth();
  const { userData, isLoading, error, refetch } = useUserProfile(currentUser?.id);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // リダイレクト済みフラグで多重 push を防止
  const hasRedirectedRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticating && !currentUser && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      router.push("/login?next=/users/me");
    }
  }, [currentUser, isAuthenticating, router]);

  // 認証中 or リダイレクト待ち → ローディング表示
  if (isAuthenticating || (!currentUser && !hasRedirectedRef.current)) {
    return <LoadingIndicator />;
  }

  // 認証完了してるけど currentUser が null → 何も描画しない（push 発火済み）
  if (!currentUser) {
    return null;
  }

  // データ取得中
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // エラー
  if (error) {
    return <ErrorState title={"マイページを読み込めませんでした"} refetchRef={refetchRef} />;
  }

  // データがない → notFound()
  if (!userData) {
    return notFound();
  }

  // 正常表示
  return (
    <div className="container mx-auto px-6 py-6 max-w-3xl">
      <UserProfileSection
        userId={currentUser?.id ?? ""}
        profile={userData.profile}
        userAsset={userData.asset}
        isOwner={true}
      />
      <UserPortfolioList
        userId={currentUser?.id ?? ""}
        isOwner={true}
        portfolios={userData.portfolios}
        isLoadingMore={false}
        hasMore={false}
        lastPortfolioRef={lastPortfolioRef}
        isSysAdmin={false}
        activeOpportunities={userData.currentlyHiringOpportunities}
      />
    </div>
  );
}
