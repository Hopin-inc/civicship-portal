"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlaceList } from "./features/list/hooks/usePlaceList";
import { PlaceCard } from "./features/list/components/PlaceCard";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useMemo } from "react";

export default function PlacesPage() {
  const router = useRouter();
  const { places, loading, refetch } = usePlaceList();

  const headerConfig = useMemo(
    () => ({
      title: "場所管理",
      showLogo: false,
      showBackButton: true,
      backTo: "/admin",
    }),
    []
  );
  useHeaderConfig(headerConfig);

  const handleCreateNew = () => {
    router.push("/admin/places/new");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-end mb-4">
        <Button
          onClick={handleCreateNew}
          variant="primary"
          size="sm"
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          作成
        </Button>
      </div>

      {places.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-caption text-body-md mb-4">場所が登録されていません</p>
          <Button onClick={handleCreateNew} variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} onDelete={refetch} />
          ))}
        </div>
      )}
    </div>
  );
}
