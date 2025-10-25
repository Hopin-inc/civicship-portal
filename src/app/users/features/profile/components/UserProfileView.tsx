import Image from "next/image";
import { UserProfileViewModel } from "@/app/users/features/profile/types";
import { UserProfileHeader } from "./UserProfileHeader";
import { UserTicketsAndPoints } from "./UserTicketsAndPoints";
import { UserOpportunitiesSection } from "./UserOpportunitiesSection";
import { UserPortfolioSection } from "@/app/users/features/portfolios";
import { currentCommunityConfig } from "@/lib/communities/metadata";

interface UserProfileViewProps {
  viewModel: UserProfileViewModel;
  isOwner: boolean;
}

export function UserProfileView({ viewModel, isOwner }: UserProfileViewProps) {
  const targetFeatures = ["opportunities", "credentials"] as const;
  const shouldShowOpportunities = targetFeatures.some((feature) =>
    currentCommunityConfig.enableFeatures.includes(feature),
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

        {isOwner && viewModel.ticketsAvailable !== undefined && viewModel.points !== undefined && (
          <UserTicketsAndPoints
            ticketCount={viewModel.ticketsAvailable}
            pointCount={viewModel.points}
          />
        )}
      </div>

      {shouldShowOpportunities && (
        <>
          {viewModel.showOpportunities && viewModel.selfOpportunities.length > 0 && (
            <UserOpportunitiesSection opportunities={viewModel.selfOpportunities} />
          )}

          <UserPortfolioSection
            userId={viewModel.id}
            portfolios={viewModel.portfolios}
            isOwner={isOwner}
            activeOpportunities={viewModel.currentlyHiringOpportunities}
          />
        </>
      )}

      {isOwner && viewModel.nftInstances && viewModel.nftInstances.length > 0 && (
        <section className="py-6 mt-0">
          <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
            保有するNFT証明書
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {viewModel.nftInstances.map((nft) => (
              <div key={nft.id} className="flex flex-col items-center p-4 border rounded-lg">
                {nft.imageUrl && (
                  <div className="relative w-full h-32 rounded-md mb-2 overflow-hidden">
                    <Image
                      src={nft.imageUrl}
                      alt={nft.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 50vw"
                    />
                  </div>
                )}
                <p className="text-sm font-medium text-center">{nft.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
