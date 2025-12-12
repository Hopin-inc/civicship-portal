"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetOpportunityQuery } from "@/types/graphql";
import { OpportunityForm } from "../components/OpportunityForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import dayjs from "dayjs";
import { useRef } from "react";

// Opportunityデータ → フォーム値に変換
function transformToFormValues(opportunity: any) {
  return {
    category: opportunity.category,
    title: opportunity.title,
    summary: opportunity.description,  // description → summary
    description: opportunity.body || "",  // body → description
    capacity: opportunity.slots[0]?.capacity || 10,
    pricePerPerson: opportunity.feeRequired || 0,
    pointPerPerson: opportunity.pointsToEarn || 0,
    placeId: opportunity.place?.id || null,
    hostUserId: opportunity.createdByUser?.id || "",
    requireHostApproval: opportunity.requireApproval,
    slots: (opportunity.slots || []).map((slot: any) => ({
      id: slot.id,  // ← 既存スロットはIDを保持
      startAt: dayjs.unix(slot.startsAt).format("YYYY-MM-DDTHH:mm"),
      endAt: dayjs.unix(slot.endsAt).format("YYYY-MM-DDTHH:mm"),
    })),
    images: opportunity.images || [],
    publishStatus: opportunity.publishStatus,
  };
}

export default function EditOpportunityPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params.id as string;

  const { data, loading, error } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId: COMMUNITY_ID },
    },
  });

  const refetchRef = useRef<(() => void) | null>(null);

  if (loading) return <LoadingIndicator fullScreen />;

  if (error || !data?.opportunity) {
    return <ErrorState title="募集情報を読み込めませんでした" refetchRef={refetchRef} />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">募集編集</h1>
        <p className="text-muted-foreground mt-2">
          募集情報を編集します。変更後は「更新」ボタンをクリックしてください。
        </p>
      </div>

      <OpportunityForm
        mode="update"
        opportunityId={opportunityId}
        initialValues={transformToFormValues(data.opportunity)}
        onSuccess={() => {
          router.push("/admin/opportunities");
        }}
      />
    </div>
  );
}
