"use client";

import { useParams, useRouter } from "next/navigation";
import { useHeaderConfig } from "@/hooks/useHeaderConfig";
import { PlaceFormEditor } from "../features/editor/components/PlaceFormEditor";
import { useGetPlaceQuery } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useMemo } from "react";

export default function EditPlacePage() {
  const params = useParams();
  const router = useRouter();
  const placeId = params?.id as string;

  const { data, loading, error } = useGetPlaceQuery({
    variables: { id: placeId },
    skip: !placeId,
    fetchPolicy: "network-only",
  });

  useHeaderConfig({
    title: "場所を編集",
    showBackButton: true,
  });

  const initialData = useMemo(() => {
    if (!data?.place) return undefined;

    const place = data.place;
    return {
      name: place.name,
      address: place.address,
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      cityCode: place.city?.id || "",
      googlePlaceId: place.googlePlaceId || undefined,
      isManual: place.isManual || false,
      mapLocation: place.mapLocation,
    };
  }, [data]);

  const handleSuccess = () => {
    // 更新成功後、一覧ページに戻る
    router.push("/admin/places");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error || !data?.place) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-error">場所の読み込みに失敗しました</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PlaceFormEditor placeId={placeId} initialData={initialData} onSuccess={handleSuccess} />
    </div>
  );
}
