"use client";

import { useCommunityRouter } from "@/hooks/useCommunityRouter";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { PlaceFormEditor } from "../features/editor/components/PlaceFormEditor";
import { useMemo } from "react";

export default function NewPlacePage() {
  const router = useCommunityRouter();

  const headerConfig = useMemo(
    () => ({
      title: "場所を作成",
      showLogo: false,
      showBackButton: true,
      backTo: "/admin/places",
    }),
    []
  );
  useHeaderConfig(headerConfig);

  const handleSuccess = (id: string) => {
    // 作成成功後、一覧ページに戻る
    router.push("/admin/places");
  };

  return <PlaceFormEditor onSuccess={handleSuccess} />;
}
