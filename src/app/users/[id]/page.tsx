"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserProfileSection from "@/app/users/components/UserProfileSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";
import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import { notFound } from "next/navigation";
import ErrorState from "@/components/shared/ErrorState";

export default function UserPage({ params }: { params: { id: string } }) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === params.id;

  const { userData, isLoading, error, refetch } = useUserProfile(params.id);
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title={"参加者ページを読み込めませんでした"} refetchRef={refetchRef} />;
  }

  if (!userData) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <UserProfileSection
        userId={params.id}
        profile={userData.profile}
        userAsset={userData.asset}
        isOwner={isOwner}
      />
      <UserPortfolioList
        userId={params.id}
        isOwner={isOwner}
        portfolios={userData.portfolios}
        isLoadingMore={false} // ← 常に false で OK
        hasMore={false} // ← 常に false で OK
        lastPortfolioRef={lastPortfolioRef}
        isSysAdmin={false} // ← 管理者権限に応じて true に
        activeOpportunities={userData.currentlyHiringOpportunities}
      />
    </div>
  );
}
