"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/features/user/useUserProfile";
import { useUserPortfolios } from "@/hooks/features/user/useUserPortfolios";
import { UserProfileSection } from "@/app/components/features/user/UserProfileSection";
import { LoadingIndicator } from "@/app/components/shared/LoadingIndicator";
import { ErrorState } from "@/app/components/shared/ErrorState";

export default function UserPage({ params }: { params: { id: string } }) {
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
    hasMore,
    isLoadingMore,
    lastPortfolioRef,
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
    </div>
  );
}    