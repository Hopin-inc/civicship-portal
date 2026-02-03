"use client";

import { useParams } from "next/navigation";
import { useAppRouter } from "@/lib/navigation";
import { useMemo, useRef } from "react";
import { useGetOpportunityQuery } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { OpportunityFormEditor } from "../../features/editor/components/OpportunityFormEditor";
import { OpportunityEditorLayout } from "../../features/editor/components/OpportunityEditorLayout";
import { presentOpportunityForEdit } from "../../features/editor/presenters/presentOpportunityForEdit";

export default function EditOpportunityPage() {
  const params = useParams();
  const router = useAppRouter();
  const { communityId } = useCommunityConfig();
  const opportunityId = params.id as string;

  const refetchRef = useRef<(() => void) | null>(null);

  // 既存データ取得
  const { data, loading, error } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId },
    },
    fetchPolicy: "network-only",
  });

  // 初期データ変換
  const initialData = useMemo(() => {
    if (!data?.opportunity) return undefined;
    return presentOpportunityForEdit(data.opportunity);
  }, [data]);

  if (loading) {
    return <LoadingIndicator fullScreen />;
  }

  if (error || !data?.opportunity) {
    return <ErrorState title="募集情報を読み込めませんでした" refetchRef={refetchRef} />;
  }

  return (
    <OpportunityEditorLayout>
      <OpportunityFormEditor
        mode="update"
        opportunityId={opportunityId}
        initialData={initialData}
        onSuccess={() => router.push("/admin/opportunities")}
      />
    </OpportunityEditorLayout>
  );
}
