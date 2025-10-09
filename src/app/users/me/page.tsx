"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useMemo, useRef } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { notFound } from "next/navigation";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { formatOpportunities } from "@/components/domains/opportunities/utils";
import UserProfileSection from "@/app/users/components/UserProfileSection";
import { NftCard } from "@/components/domains/nfts/components";
import { CardCarousel } from "@/components/shared/CardCarousel";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";

export default function MyProfilePage() {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  const { user: currentUser, isAuthenticating } = useAuth();
  console.log(currentUser);
  const { userData, nftInstances, selfOpportunities, isLoading, error, refetch } = useUserProfile(
    currentUser?.id,
  );

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const formattedOpportunities = useMemo(
    () => selfOpportunities.map(formatOpportunities),
    [selfOpportunities],
  );

  if (isAuthenticating || !currentUser || isLoading) {
    return <LoadingIndicator />;
  }

  if (error)
    return <ErrorState title={"マイページを読み込めませんでした"} refetchRef={refetchRef} />;

  if (!userData) return notFound();

  const targetFeatures = ["opportunities", "credentials"] as const;
  const shouldShowOpportunities = targetFeatures.some((feature) =>
    currentCommunityConfig.enableFeatures.includes(feature),
  );

  return (
    <div className="container mx-auto px-6 py-6 max-w-3xl">
      <UserProfileSection
        userId={currentUser?.id ?? ""}
        profile={userData.profile}
        userAsset={userData.asset}
        isOwner={true}
      />
      {nftInstances && nftInstances.length > 0 ? (
        <section className="py-6 mt-0">
          <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">証明書</h2>
          <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide">
            {nftInstances.map((nftInstance) => (
              <NftCard key={nftInstance.id} nftInstance={nftInstance} isCarousel={true} />
            ))}
          </div>
        </section>
      ) : null}
      <>
        {shouldShowOpportunities && (
          <>
            {formattedOpportunities.length > 0 && (
              <section className="py-6 mt-0">
                <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
                  主催中の体験
                </h2>
                <CardCarousel>
                  {formattedOpportunities.map((opportunity) => (
                    <OpportunityVerticalCard key={opportunity.id} {...opportunity} />
                  ))}
                </CardCarousel>
              </section>
            )}
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
          </>
        )}
      </>
    </div>
  );
}
