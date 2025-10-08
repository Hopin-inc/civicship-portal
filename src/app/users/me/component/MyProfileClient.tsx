"use client";

import { useRef } from "react";
import { notFound } from "next/navigation";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import UserProfileSection from "@/app/users/components/UserProfileSection";
import { NftCard } from "@/components/domains/nfts/components";
import { CardCarousel } from "@/components/shared/CardCarousel";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";
import { GqlNftInstance, GqlUser } from "@/types/graphql";
import { ManagerProfile } from "@/app/users/data/type";
import { FormattedOpportunityCard } from "@/components/domains/opportunities/types";

interface MyProfileClientProps {
  user: GqlUser | null;
  profile: ManagerProfile;
  nftInstances: GqlNftInstance[];
  selfOpportunities: FormattedOpportunityCard[];
}

export default function MyProfileClient({
  user,
  profile,
  nftInstances,
  selfOpportunities,
}: MyProfileClientProps) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  if (!profile) return notFound();

  const targetFeatures = ["opportunities", "credentials"] as const;
  const shouldShowOpportunities = targetFeatures.some((feature) =>
    currentCommunityConfig.enableFeatures.includes(feature),
  );

  return (
    <div className="container mx-auto px-6 py-6 max-w-3xl">
      <UserProfileSection
        userId={user?.id ?? ""}
        profile={profile.profile}
        userAsset={profile.asset}
        isOwner
      />

      {/* 証明書セクション */}
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
              <CardCarousel>
                {selfOpportunities.map((opportunity) => (
                  <OpportunityVerticalCard key={opportunity.id} {...opportunity} />
                ))}
              </CardCarousel>
            </section>
          )}

          <UserPortfolioList
            userId={user?.id ?? ""}
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
