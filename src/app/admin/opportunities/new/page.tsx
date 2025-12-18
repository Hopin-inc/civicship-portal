"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { OpportunityFormEditor } from "../components/OpportunityFormEditor";

export default function CreateOpportunityPage() {
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: "募集作成",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 max-w-md mx-auto">
        <OpportunityFormEditor
          mode="create"
          onSuccess={() => router.push("/admin/opportunities")}
        />
      </main>
    </div>
  );
}
