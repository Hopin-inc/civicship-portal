"use client";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import FeaturedSection from "./FeaturedSection";
import { CarouselSection } from "./CarouselSection";
import PageClient from "./PageClient";
import { useFetchFeaturedAndCarousel } from "../data/fetchActivities";

export default function HomeSection() {
  const { isAuthenticating, loading: authLoading } = useAuth();
  const { featuredCards, upcomingCards, loading } = useFetchFeaturedAndCarousel();
  if (isAuthenticating || authLoading) {
    return <LoadingIndicator fullScreen={true} />;
  }
  return (
    <div className="min-h-screen">
      <FeaturedSection opportunities={featuredCards} isInitialLoading={loading} />
      <CarouselSection
        title="もうすぐ開催予定"
        opportunities={upcomingCards}
        isInitialLoading={loading}
        isVertical={false}
      />
      <PageClient />
    </div>
  );
}