"use client";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import FeaturedSection from "@/components/domains/opportunities/components/FeaturedSection/FeaturedSection";
import OpportunitiesFeed from "@/app/opportunities/components/OpportunitiesFeed";
import { useFetchFeedOpportunities } from "@/app/opportunities/hooks/useFetchFeedOpportunities";

export default function OpportunitiesPage() {
    const { isAuthenticating, loading: authLoading } = useAuth();
    const { featuredCards, loading } = useFetchFeedOpportunities();
    if (isAuthenticating || authLoading) {
      return <LoadingIndicator fullScreen={true} />;
    }

    return (
        <div className="min-h-screen">
          <FeaturedSection opportunities={featuredCards} isInitialLoading={loading} />
          <OpportunitiesFeed />
        </div>
      );
}
