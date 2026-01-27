"use client";

import { useCommunityRouter } from "@/hooks/useCommunityRouter";
import { OpportunityFormEditor } from "../features/editor/components/OpportunityFormEditor";
import { OpportunityEditorLayout } from "../features/editor/components/OpportunityEditorLayout";

export default function CreateOpportunityPage() {
  const router = useCommunityRouter();

  return (
    <OpportunityEditorLayout>
      <OpportunityFormEditor
        mode="create"
        onSuccess={() => router.push("/admin/opportunities")}
      />
    </OpportunityEditorLayout>
  );
}
