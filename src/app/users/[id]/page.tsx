"use client";

import { useEffect, useRef } from "react";
import { notFound, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import UserProfileSection from "@/app/users/components/UserProfileSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";
import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import ErrorState from "@/components/shared/ErrorState";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";

export default function UserPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === id;

  const { userData, selfOpportunities, isLoading, error, refetch } = useUserProfile(id ?? "");
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
      {selfOpportunities.length > 0 && (
        <>
          <section className="py-6 mt-0">
            <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
              主催中の体験
            </h2>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {selfOpportunities.map((opportunity) => (
                <OpportunityCardVertical
                  key={opportunity.id}
                  opportunity={opportunity}
                  isCarousel
                />
              ))}
            </div>
          </section>
        </>
      )}
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
