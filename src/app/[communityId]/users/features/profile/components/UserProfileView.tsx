"use client";

import { UserProfileViewModel } from "@/app/users/features/profile/types";
import { UserProfileHeader } from "./UserProfileHeader";
import { UserTicketsAndPoints } from "./UserTicketsAndPoints";
import { UserPortfolioSection } from "@/app/users/features/portfolios";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { NftCard } from "@/components/domains/nfts/components";
import { CardCarousel } from "@/components/shared/CardCarousel";
import { useTranslations } from "next-intl";

interface UserProfileViewProps {
  viewModel: UserProfileViewModel;
  isOwner: boolean;
}

export function UserProfileView({ viewModel, isOwner }: UserProfileViewProps) {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();
  const targetFeatures = ["opportunities", "credentials"] as const;
  const shouldShowOpportunities = targetFeatures.some((feature) =>
    communityConfig?.enableFeatures?.includes(feature),
  );

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="max-w-4xl mx-auto">
        <UserProfileHeader
          id={viewModel.id}
          name={viewModel.name}
          imageUrl={viewModel.imageUrl}
          bio={viewModel.bio}
          currentPrefecture={viewModel.currentPrefecture}
          socialUrl={viewModel.socialUrl}
          isOwner={isOwner}
        />

        {(viewModel.ticketsAvailable !== undefined || viewModel.points !== undefined) && (
          <UserTicketsAndPoints
            ticketCount={viewModel.ticketsAvailable}
            pointCount={viewModel.points}
            canNavigate={isOwner}
          />
        )}
      </div>

      {viewModel.nftInstances && viewModel.nftInstances.length > 0 && (
        <section className="py-6 mt-0">
          <h2 className="text-body-md font-semibold text-foreground pt-4">
            {t("users.profileView.certificatesTitle")}
          </h2>
          <div className="mt-2">
            <CardCarousel>
              {viewModel.nftInstances.map((nft) => (
                <NftCard key={nft.id} nftInstance={nft} isCarousel />
              ))}
            </CardCarousel>
          </div>
        </section>
      )}

      {shouldShowOpportunities && (
        <>
          <UserPortfolioSection
            userId={viewModel.id}
            portfolios={viewModel.portfolios}
            isOwner={isOwner}
            activeOpportunities={viewModel.currentlyHiringOpportunities}
          />
        </>
      )}
    </div>
  );
}
