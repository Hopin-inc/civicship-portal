"use client";

import { FC, useState, useMemo } from "react";
import { usePlaceDetail } from "@/app/places/[id]/hooks/usePlaceDetail";
import { AsymmetricImageGrid } from "@/components/ui/asymmetric-image-grid";
import PlaceImageSlider from "@/app/places/[id]/components/PlaceImageSlider";
import PlaceHeader from "@/app/places/[id]/components/PlaceHeader";
import PlaceOpportunities from "@/app/places/[id]/components/PlaceOpportunities";
import PlaceFeaturedArticle from "@/app/places/[id]/components/PlaceFeaturedArticle";
import { ErrorState } from "@/components/shared/ErrorState";
import useHeaderConfig from "@/hooks/useHeaderConfig";

interface PlaceDetailProps {
  params: {
    id: string;
  };
  searchParams: {
    userId?: string;
  };
}

const PlaceDetail: FC<PlaceDetailProps> = ({ params, searchParams }) => {
  const headerConfig = useMemo(
    () => ({
      title: "拠点詳細",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const {
    detail,
    loading,
    error,
    currentImageIndex,
    imagesForSlider,
    imagesForGrid,
    remainingCount,
    nextImage,
    prevImage,
    hasImages,
  } = usePlaceDetail({
    placeId: params.id,
    userId: searchParams.userId || "",
  });

  console.log(detail);

  const [selectedImageIndex, setSelectedImageIndex] = useState(currentImageIndex);

  if (error) return <ErrorState message={error.message} />;
  if (!detail) return <ErrorState message="Place not found" />;

  return (
    <div className="min-h-screen bg-background overflow-auto">
      <div className="pb-6">
        <PlaceImageSlider
          images={imagesForSlider}
          currentIndex={selectedImageIndex}
          onNext={nextImage}
          onPrev={prevImage}
          onSelectIndex={setSelectedImageIndex}
        />

        <PlaceHeader
          address={detail.address}
          participantCount={detail.participantCount}
          name={detail.name}
          headline={detail.headline}
          bio={detail.bio}
        />

        {hasImages && (
          <section className="mb-12 px-4">
            <div className="max-w-3xl">
              <div className="space-y-4">
                <AsymmetricImageGrid
                  images={imagesForGrid}
                  remainingCount={remainingCount > 0 ? remainingCount : undefined}
                />
              </div>
            </div>
          </section>
        )}

        <PlaceOpportunities opportunities={detail.currentlyHiringOpportunities} />
        <PlaceFeaturedArticle article={detail.relatedArticles?.[0]} />
      </div>
    </div>
  );
};

export default PlaceDetail;
