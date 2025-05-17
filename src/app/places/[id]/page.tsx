"use client";

import { FC } from "react";
import { usePlaceDetail } from "@/app/places/[id]/hooks/usePlaceDetail";
import PlaceOpportunities from "@/app/places/[id]/components/PlaceOpportunities";
import PlaceFeaturedArticle from "@/app/places/[id]/components/PlaceFeaturedArticle";
import { ErrorState } from "@/components/shared/ErrorState";
import { ImagesCarousel } from "@/components/ui/images-carousel";
import { PlaceOverview } from "./components/PlaceOverview";
import { PlaceAddress } from "./components/PlaceAddress";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { NavigationButtons } from "@/components/shared/NavigationButtons";

interface PlaceDetailProps {
  params: {
    id: string;
  };
  searchParams: {
    userId?: string;
  };
}

const PlaceDetail: FC<PlaceDetailProps> = ({ params, searchParams }) => {

  const {
    loading,
    detail,
    error,
  } = usePlaceDetail({
    placeId: params.id,
    userId: searchParams.userId || "",
  });

  if (loading) return <LoadingIndicator fullScreen />;
  if (error) return <ErrorState message={error.message} />;
  if (!detail) return <ErrorState message="Place not found" />;

  return (
    <>
      <div className="relative max-w-mobile-l mx-auto w-full z-10">
        <NavigationButtons title={detail.name} />
      </div>
      <div className="min-h-screen">
        <ImagesCarousel images={detail.images} title={detail.name} />
        <PlaceOverview detail={detail} />
        <PlaceAddress detail={detail} />
        <PlaceOpportunities opportunities={detail.currentlyHiringOpportunities} />
        <PlaceFeaturedArticle article={detail.relatedArticles?.[0]} />
      </div>
    </>
  );
};

export default PlaceDetail;
