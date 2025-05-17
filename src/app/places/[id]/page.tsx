"use client";

import { FC } from "react";
import { usePlaceDetail } from "@/app/places/[id]/hooks/usePlaceDetail";
import PlaceOpportunities from "@/app/places/[id]/components/PlaceOpportunities";
import PlaceFeaturedArticle from "@/app/places/[id]/components/PlaceFeaturedArticle";
import { ErrorState } from "@/components/shared/ErrorState";
import { ImagesCarousel } from "@/components/ui/images-carousel";
import { PlaceOverview } from "./components/PlaceOverview";

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
    detail,
    error,
  } = usePlaceDetail({
    placeId: params.id,
    userId: searchParams.userId || "",
  });

  if (error) return <ErrorState message={error.message} />;
  if (!detail) return <ErrorState message="Place not found" />;

  return (
    <div className="min-h-screen bg-background overflow-auto">
      <div className="pb-6">
        <ImagesCarousel
          images={detail.images}
          title={detail.name}
        />
        <PlaceOverview detail={detail} />
        <PlaceOpportunities opportunities={detail.currentlyHiringOpportunities} />
        <PlaceFeaturedArticle article={detail.relatedArticles?.[0]} />
      </div>
    </div>
  );
};

export default PlaceDetail;
