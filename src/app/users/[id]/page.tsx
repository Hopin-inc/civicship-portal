"use client";

import { useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/features/user/useUserProfile";
import { useUserPortfolios } from "@/hooks/features/user/useUserPortfolios";
import { UserProfileSection } from "@/components/features/user/UserProfileSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { useHeaderConfig } from "@/hooks/core/useHeaderConfig";
import { UserPortfolioList } from "@/components/features/user/UserPortfolioList";

export default function UserPage({ params }: { params: { id: string } }) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  const headerConfig = useMemo(() => ({
    title: "ユーザープロフィール",
    showBackButton: true,
    showLogo: false,
  }), []);
  useHeaderConfig(headerConfig);

  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === params.id;

  const {
    profileData,
    isLoading: profileLoading,
    error: profileError
  } = useUserProfile(params.id);

  const {
    portfolios,
    isLoading: portfoliosLoading,
    error: portfoliosError,
    activeOpportunities
  } = useUserPortfolios(params.id);

  if (profileLoading || portfoliosLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LoadingIndicator />
      </div>
    );
  }

  if (profileError || portfoliosError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message={
          profileError?.message ||
          portfoliosError?.message ||
          "ユーザー情報の取得に失敗しました"
        } />
      </div>
    );
  }

  if (!profileData) {
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
        isLoading={profileLoading}
        error={profileError}
        profileData={profileData}
        isOwner={isOwner}
      />

      <UserPortfolioList
        userId={params.id}
        isOwner={isOwner}
        portfolios={portfolios}
        isLoadingMore={false} // ← 常に false で OK
        hasMore={false}       // ← 常に false で OK
        lastPortfolioRef={lastPortfolioRef}
        isSysAdmin={false}    // ← 管理者権限に応じて true に
        activeOpportunities={activeOpportunities}
      />
    </div>
  );

}
