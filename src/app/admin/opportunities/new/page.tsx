"use client";

import { useRouter } from "next/navigation";
import { OpportunityFormEditor } from "../features/editor/components/OpportunityFormEditor";
import { OpportunityEditorLayout } from "../features/editor/components/OpportunityEditorLayout";

export default function CreateOpportunityPage() {
  const router = useRouter();

  return (
    <OpportunityEditorLayout>
      <OpportunityFormEditor
        mode="create"
        onSuccess={() => router.push("/admin/opportunities")}
      />
    </OpportunityEditorLayout>
  );
}
