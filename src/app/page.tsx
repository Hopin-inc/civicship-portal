"use client";
import { useAuthStore } from "@/stores/auth-store";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import FeaturedSection from "@/components/domains/opportunities/components/FeaturedSection/FeaturedSection";
import { OpportunityCarouselListSection } from "@/components/domains/opportunities/components/ListSection/OpportunityCarouselListSection";
import OpportunitiesFeed from "@/app/opportunities/components/OpportunitiesFeed";
import { useFetchFeedOpportunities } from "@/app/opportunities/hooks/useFetchFeedOpportunities";
import { formatOpportunities } from "@/components/domains/opportunities/utils";

export default function HomePage() {
    const { isAuthenticating } = useAuthStore();
    const authLoading = isAuthenticating;
    const { featuredCards, upcomingCards, loading } = useFetchFeedOpportunities();
    if (isAuthenticating || authLoading) {
      return <LoadingIndicator fullScreen={true} />;
    }
    const formattedOpportunities = upcomingCards.map(formatOpportunities);

    return (
        <div className="min-h-screen">
          <FeaturedSection opportunities={featuredCards} isInitialLoading={loading} />
          <OpportunityCarouselListSection
            title="もうすぐ開催予定"
            opportunities={formattedOpportunities}
            isInitialLoading={loading}
          />
          <OpportunitiesFeed />
        </div>
      );
}
