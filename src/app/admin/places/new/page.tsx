"use client";

import { useRouter } from "next/navigation";
import { useHeaderConfig } from "@/hooks/useHeaderConfig";
import { PlaceFormEditor } from "../features/editor/components/PlaceFormEditor";

export default function NewPlacePage() {
  const router = useRouter();

  useHeaderConfig({
    title: "場所を作成",
    showBackButton: true,
  });

  const handleSuccess = (id: string) => {
    // 作成成功後、一覧ページに戻る
    router.push("/admin/places");
  };

  return (
    <div className="min-h-screen bg-background">
      <PlaceFormEditor onSuccess={handleSuccess} />
    </div>
  );
}
