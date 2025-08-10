"use client";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import FeaturedSection from "@/components/domains/opportunity/components/FeaturedSection/FeaturedSection";
import { OpportunityCarouselListSection } from "@/components/domains/opportunity/components/ListSection/OpportunityCarouselListSection";
import OpportunitiesFeed from "@/app/opportunities/components/OpportunitiesFeed";
import { useOpportunitiesSections } from "@/app/opportunities/hooks/useOpportunitiesSections";
import { formatOpportunity } from "@/components/domains/opportunity/utils";

export default function OpportunitiesPage() {
    const { isAuthenticating, loading: authLoading } = useAuth();
    const { featuredCards, upcomingCards, loading } = useOpportunitiesSections();
    if (isAuthenticating || authLoading) {
      return <LoadingIndicator fullScreen={true} />;
    }
    const formatOpportunities = upcomingCards.map(formatOpportunity);

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