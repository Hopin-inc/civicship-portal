"use client";

import { FC, useState } from "react";
import { usePlaceDetail } from "@/hooks/features/place/usePlaceDetail";
import { RecentActivitiesTimeline } from "@/app/components/features/activity/RecentActivitiesTimeline";
import { AsymmetricImageGrid } from "@/components/ui/asymmetric-image-grid";
import PlaceImageSlider from "@/components/features/places/detail/PlaceImageSlider";
import PlaceHeader from "@/components/features/places/detail/PlaceHeader";
import PlaceOpportunities from "@/components/features/places/detail/PlaceOpportunities";
import PlaceFeaturedArticle from "@/components/features/places/detail/PlaceFeaturedArticle";
import ErrorState from "@/app/components/shared/ErrorState";

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
    membership,
    opportunities,
    featuredArticle,
    loading,
    error,
    currentImageIndex,
    allImages,
    displayImages,
    remainingCount,
    nextImage,
    prevImage,
    hasParticipationImages
  } = usePlaceDetail({
    placeId: params.id,
    userId: searchParams.userId || "",
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(currentImageIndex);

  if (error) return <ErrorState message={error.message} />;
  if (!membership) return <ErrorState message="Membership not found" />;

  return (
    <div className="min-h-screen bg-white overflow-auto">
      <div className="pb-6">
        <PlaceImageSlider
          images={allImages}
          currentIndex={selectedImageIndex || currentImageIndex}
          onNext={nextImage}
          onPrev={prevImage}
          onSelectIndex={setSelectedImageIndex}
        />

        <PlaceHeader
          address={membership.place?.address}
          participantCount={membership.participationView.participated.totalParticipatedCount}
          name={membership.name}
          headline={membership.headline}
          bio={membership.bio}
        />

        {hasParticipationImages && (
          <section className="mb-12 px-4">
            <div className="max-w-3xl">
              <div className="space-y-4">
                <AsymmetricImageGrid 
                  images={displayImages} 
                  remainingCount={remainingCount > 0 ? remainingCount : undefined} 
                />
              </div>
            </div>
          </section>
        )}

        <PlaceOpportunities opportunities={opportunities} />

        <PlaceFeaturedArticle article={featuredArticle} />

        {opportunities.length > 0 && (
          <div className="mt-8 px-4">
            <RecentActivitiesTimeline opportunities={opportunities} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetail;
