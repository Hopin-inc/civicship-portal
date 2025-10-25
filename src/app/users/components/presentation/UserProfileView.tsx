import { UserProfileViewModel } from "@/app/users/data/view-model";
import { UserProfileHeader } from "./UserProfileHeader";
import { UserTicketsAndPoints } from "./UserTicketsAndPoints";
import { UserOpportunitiesSection } from "./UserOpportunitiesSection";
import { UserPortfolioSection } from "./UserPortfolioSection";
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
    </div>
  );
}
