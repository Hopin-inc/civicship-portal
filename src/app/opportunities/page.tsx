"use client";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import FeaturedSection from "@/components/domains/opportunities/components/FeaturedSection/FeaturedSection";
import { OpportunityCarouselListSection } from "@/components/domains/opportunities/components/ListSection/OpportunityCarouselListSection";
import OpportunitiesFeed from "@/app/opportunities/components/OpportunitiesFeed";
import { useFetchFeedOpportunities } from "@/app/opportunities/hooks/useFetchFeedOpportunities";
import { formattedOpportunities } from "@/components/domains/opportunities/utils";

export default function OpportunitiesPage() {
    const { isAuthenticating, loading: authLoading } = useAuth();
    const { featuredCards, upcomingCards, loading } = useFetchFeedOpportunities();
    if (isAuthenticating || authLoading) {
      return <LoadingIndicator fullScreen={true} />;
    }
    const formatOpportunities = upcomingCards.map(formattedOpportunities);

    return (
        <div className="min-h-screen">
          <FeaturedSection opportunities={featuredCards} isInitialLoading={loading} />
          <OpportunityCarouselListSection
            title="もうすぐ開催予定"
            opportunities={formatOpportunities}
            isInitialLoading={loading}
          />
          <OpportunitiesFeed />
        </div>
      );
}