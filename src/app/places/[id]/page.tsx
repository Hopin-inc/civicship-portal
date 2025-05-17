"use client";

import { FC, useState } from "react";
import { usePlaceDetail } from "@/app/places/[id]/hooks/usePlaceDetail";
import PlaceOpportunities from "@/app/places/[id]/components/PlaceOpportunities";
import PlaceFeaturedArticle from "@/app/places/[id]/components/PlaceFeaturedArticle";
import { ErrorState } from "@/components/shared/ErrorState";
import { ImagesCarousel } from "@/components/ui/images-carousel";

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
    // loading,
    error,
    // currentImageIndex,
    imagesForSlider,
    // imagesForGrid,
    // remainingCount,
    // nextImage,
    // prevImage,
    // hasImages,
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
          images={imagesForSlider.map((image) => image.url)}
          title={detail.name}
        />
        <PlaceOpportunities opportunities={detail.currentlyHiringOpportunities} />
        <PlaceFeaturedArticle article={detail.relatedArticles?.[0]} />
      </div>
    </div>
  );
};

export default PlaceDetail;
