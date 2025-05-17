"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileSection } from "@/app/users/components/UserProfileSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { UserPortfolioList } from "@/app/users/components/UserPortfolioList";
import { useUserProfile } from "@/app/users/hooks/useUserProfile";

export default function MyProfilePage() {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { user: currentUser, isAuthenticating } = useAuth();

  const { userData, isLoading, error } = useUserProfile(currentUser?.id);

  // 認証完了後、未ログイン状態ならリダイレクト
  useEffect(() => {
    if (!isAuthenticating && !currentUser) {
      router.push("/login?next=/users/me");
    }
  }, [currentUser, isAuthenticating, router]);

  // 認証中の間はローディング
  if (isAuthenticating) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LoadingIndicator fullScreen={true} />
      </div>
    );
  }

  // 未ログインで useEffect によりリダイレクト中
  if (!currentUser) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LoadingIndicator fullScreen={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message={error.message || "ユーザー情報の取得に失敗しました"} />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message="ユーザーが見つかりませんでした" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-6 max-w-3xl">
      <UserProfileSection
        userId={currentUser?.id ?? ""}
        isLoading={isLoading}
        error={error}
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
