"use client";

import { useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileSection } from "@/components/features/user/UserProfileSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { UserPortfolioList } from "@/components/features/user/UserPortfolioList";
import { useUserProfile } from "@/hooks";

export default function UserPage({ params }: { params: { id: string } }) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === params.id;

  const { userData, isLoading, error} = useUserProfile(params.id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message={
          error.message || "ユーザー情報の取得に失敗しました"
        } />
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
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <UserProfileSection
        userId={params.id}
        isLoading={isLoading}
        error={error}
        profile={userData.profile}
        userAsset={userData.asset}
        isOwner={isOwner}
      />
      <UserPortfolioList
        userId={params.id}
        isOwner={isOwner}
        portfolios={userData.portfolios}
        isLoadingMore={false} // ← 常に false で OK
        hasMore={false}       // ← 常に false で OK
        lastPortfolioRef={lastPortfolioRef}
        isSysAdmin={false}    // ← 管理者権限に応じて true に
        activeOpportunities={userData.currentlyHiringOpportunities}
      />
    </div>
  );
}
