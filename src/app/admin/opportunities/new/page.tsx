"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { OpportunityFormEditor } from "../components/OpportunityFormEditor";
import { useHostsAndPlaces } from "../hooks/useHostsAndPlaces";

export default function CreateOpportunityPage() {
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: "募集作成",
      showLogo: false,
      showBackButton: true,
    }),
    []
  );
  useHeaderConfig(headerConfig);

  // ホスト・場所データ取得
  const { hosts, places, loading } = useHostsAndPlaces();

  if (loading) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 py-6 pb-24 max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">新規募集作成</h1>
          <p className="text-muted-foreground mt-2">募集情報を入力してください</p>
        </div>

        <OpportunityFormEditor
          mode="create"
          hosts={hosts}
          places={places}
          onSuccess={() => router.push("/admin/opportunities")}
        />
      </main>
    </div>
  );
}
