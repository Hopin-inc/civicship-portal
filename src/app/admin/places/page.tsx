"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlaceList } from "./features/list/hooks/usePlaceList";
import { PlaceCard } from "./features/list/components/PlaceCard";
import { useRouter } from "next/navigation";
import { useHeaderConfig } from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function PlacesPage() {
  const router = useRouter();
  const { places, loading, refetch } = usePlaceList();

  useHeaderConfig({
    title: "場所管理",
    showBackButton: true,
  });

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
    <div className="min-h-screen bg-background pb-24">
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 場所一覧 */}
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
      </main>

      {/* FAB: 新規作成ボタン */}
      {places.length > 0 && (
        <div className="fixed bottom-20 right-6 z-40">
          <Button
            onClick={handleCreateNew}
            variant="primary"
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">新規作成</span>
          </Button>
        </div>
      )}
    </div>
  );
}
