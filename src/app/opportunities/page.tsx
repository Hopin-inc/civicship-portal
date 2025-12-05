"use client";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import FeaturedSection from "@/components/domains/opportunities/components/FeaturedSection/FeaturedSection";
import OpportunitiesFeed from "@/app/opportunities/components/OpportunitiesFeed";
import { useFetchFeedOpportunitySlots } from "@/app/opportunities/hooks/useFetchFeedOpportunitySlots";

export default function OpportunitiesPage() {
    const { isAuthenticating, loading: authLoading } = useAuth();
    const { featuredCards, upcomingCards, loading, error, loadMoreRef, refetch } = useFetchFeedOpportunitySlots();
    
    if (isAuthenticating || authLoading) {
      return <LoadingIndicator fullScreen={true} />;
    }

    return (
        <div className="min-h-screen">
          <FeaturedSection opportunities={featuredCards} isInitialLoading={loading} />
          <OpportunitiesFeed 
            featuredCards={featuredCards}
            upcomingCards={upcomingCards}
            loading={loading}
            error={error}
            loadMoreRef={loadMoreRef}
            refetch={refetch}
          />
        </div>
      );
}
