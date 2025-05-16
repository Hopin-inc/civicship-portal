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
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login?next=/users/me");
    }
  }, [currentUser, router]);

  const { userData, isLoading, error } = useUserProfile(currentUser?.id ?? "");

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
