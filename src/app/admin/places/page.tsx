"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceList } from "./features/list/components/PlaceList";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";

export default function PlacesPage() {
  const router = useRouter();

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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-end mb-4">
        <Button onClick={handleCreateNew} variant="primary" size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          作成
        </Button>
      </div>

      <PlaceList />
    </div>
  );
}
