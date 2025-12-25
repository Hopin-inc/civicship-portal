"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { useGetOpportunityQuery } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { OpportunityFormEditor } from "../../features/editor/components/OpportunityFormEditor";
import { OpportunityEditorLayout } from "../../features/editor/components/OpportunityEditorLayout";
import { presentOpportunityForEdit } from "../../features/editor/presenters/presentOpportunityForEdit";

export default function EditOpportunityPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params.id as string;

  const refetchRef = useRef<(() => void) | null>(null);

  // 既存データ取得
  const { data, loading, error } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId: COMMUNITY_ID },
    },
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
