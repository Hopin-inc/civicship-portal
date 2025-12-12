"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetOpportunityQuery } from "@/types/graphql";
import { OpportunityForm } from "../components/OpportunityForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import dayjs from "dayjs";
import { useMemo, useRef } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";

// Opportunityデータ → フォーム値に変換
function transformToFormValues(opportunity: any) {
  return {
    category: opportunity.category,
    title: opportunity.title,
    summary: opportunity.description, // description → summary
    description: opportunity.body || "", // body → description
    capacity: opportunity.slots[0]?.capacity || 10,
    pricePerPerson: opportunity.feeRequired || 0,
    pointPerPerson: opportunity.pointsToEarn || 0,
    placeId: opportunity.place?.id || null,
    hostUserId: opportunity.createdByUser?.id || "",
    requireHostApproval: opportunity.requireApproval,
    slots: (opportunity.slots || []).map((slot: any) => ({
      id: slot.id, // ← 既存スロットはIDを保持
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

  const headerConfig = useMemo(
    () => ({
      title: "募集編集",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

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
