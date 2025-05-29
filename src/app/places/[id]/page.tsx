"use client";

import { FC, useEffect, useRef } from "react";
import { usePlaceDetail } from "@/app/places/[id]/hooks/usePlaceDetail";
import PlaceOpportunities from "@/app/places/[id]/components/PlaceOpportunities";
import PlaceFeaturedArticle from "@/app/places/[id]/components/PlaceFeaturedArticle";
import ErrorState from "@/components/shared/ErrorState";
import ImagesCarousel from "@/components/ui/images-carousel";
import PlaceOverview from "./components/PlaceOverview";
import PlaceAddress from "./components/PlaceAddress";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import NavigationButtons from "@/components/shared/NavigationButtons";
import { notFound, useParams, useSearchParams } from "next/navigation";

const PlaceDetail: FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { loading, place, error, refetch } = usePlaceDetail(id ?? "");
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorState title="拠点を読み込めませんでした" refetchRef={refetchRef} />;
  if (!place) return notFound();

  return (
    <>
      <div className="relative max-w-mobile-l mx-auto w-full z-10">
        <NavigationButtons title={place.name} />
      </div>
      <div className="min-h-screen">
        <ImagesCarousel images={place.images} title={place.name} />
        <PlaceOverview detail={place} />
        <PlaceAddress detail={place} />
        <PlaceOpportunities opportunities={place.currentlyHiringOpportunities} />
        <PlaceFeaturedArticle articles={place.relatedArticles} />
      </div>
    </>
  );
};

export default PlaceDetail;
