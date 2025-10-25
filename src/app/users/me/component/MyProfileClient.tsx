"use client";

import { useRef } from "react";
import { notFound } from "next/navigation";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import UserProfileSection from "@/app/users/components/UserProfileSection";
import { NftCard } from "@/components/domains/nfts/components";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import { GqlNftInstance, GqlUser } from "@/types/graphql";
import { ManagerProfile } from "@/app/users/data/type";
import { FormattedOpportunityCard } from "@/components/domains/opportunities/types";

interface MyProfileClientProps {
  ssrData: {
    user: GqlUser;
    profile: ManagerProfile;
    nftInstances: GqlNftInstance[];
    selfOpportunities: FormattedOpportunityCard[];
  } | null;
}

export default function MyProfileClient({ ssrData }: MyProfileClientProps) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuth();

  const {
    userData: csrUser,
    isLoading: loading,
    nftInstances: csrNftInstances,
    selfOpportunities: csrSelfOpportunities,
  } = useUserProfile(ssrData ? undefined : currentUser?.id);

  const profile = ssrData?.profile ?? csrUser ?? null;
  const nftInstances = ssrData?.nftInstances ?? csrNftInstances ?? [];
  const selfOpportunities = ssrData?.selfOpportunities ?? csrSelfOpportunities ?? [];
  const user = ssrData?.user ?? csrUser ?? null;

  if (loading && !ssrData) return <LoadingIndicator />;
  if (!user || !profile) return notFound();

  const targetFeatures = ["opportunities", "credentials"] as const;
  const shouldShowOpportunities = targetFeatures.some((feature) =>
    currentCommunityConfig.enableFeatures.includes(feature),
  );

  return (
    <div className="container mx-auto px-6 py-6 max-w-3xl">
      <UserProfileSection
        userId={user.id}
        profile={profile.profile}
        userAsset={profile.asset}
        isOwner
      />

      {/* 証明書 */}
      {nftInstances.length > 0 && (
        <section className="py-6 mt-0">
          <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">証明書</h2>
          <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide">
            {nftInstances.map((nftInstance) => (
              <NftCard key={nftInstance.id} nftInstance={nftInstance} isCarousel />
            ))}
          </div>
        </section>
      )}

      {/* 主催中の体験 */}
      {shouldShowOpportunities && (
        <>
          {selfOpportunities.length > 0 && (
            <section className="py-6 mt-0">
              <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
                主催中の体験
              </h2>
              {/* 横スクロール領域 */}
              <div className="-mx-6 overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 px-6 min-w-max">
                  {selfOpportunities.map((o) => (
                    <OpportunityVerticalCard key={o.id} {...o} />
                  ))}
                </div>
              </div>
            </section>
          )}

          <UserPortfolioList
            userId={user.id}
            isOwner
            portfolios={profile.portfolios}
            isLoadingMore={false}
            hasMore={false}
            lastPortfolioRef={lastPortfolioRef}
            isSysAdmin={false}
            activeOpportunities={profile.currentlyHiringOpportunities}
          />
        </>
      )}
    </div>
  );
}
