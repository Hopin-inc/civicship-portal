"use client";
import ActivitiesFeaturedSection from "../activities/components/FeaturedSection/FeaturedSection";
import ActivitiesCarouselSection from "../activities/components/CarouselSection/CarouselSection";
import ActivitiesPageClient from "../activities/components/ActivitiesPageClient";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ActivityCard } from "../activities/data/type";

interface HomeSectionProps {
  featuredCards: ActivityCard[];
  upcomingCards: ActivityCard[];
  loading: boolean;
}

export default function HomeSection({ featuredCards, upcomingCards, loading }: HomeSectionProps) {
  const { isAuthenticating, loading: authLoading } = useAuth();

  if (isAuthenticating || authLoading) {
    return <LoadingIndicator fullScreen={true} />;
  }

  return (
    <div className="min-h-screen">
      <ActivitiesFeaturedSection opportunities={featuredCards} isInitialLoading={loading} />
      <ActivitiesCarouselSection
        title="もうすぐ開催予定"
        opportunities={upcomingCards}
        isInitialLoading={loading}
      />
      <ActivitiesPageClient />
    </div>
  );
}