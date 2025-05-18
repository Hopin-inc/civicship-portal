"use client";

import { useEffect, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import UserProfileSection from "@/app/users/components/UserProfileSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";
import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import ErrorState from "@/components/shared/ErrorState";

export default function UserPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === id;

  const { userData, isLoading, error, refetch } = useUserProfile(id ?? "");
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

  if (!userData || !id) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <UserProfileSection
        userId={id}
        profile={userData.profile}
        userAsset={userData.asset}
        isOwner={isOwner}
      />
      <UserPortfolioList
        userId={id}
        isOwner={isOwner}
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
