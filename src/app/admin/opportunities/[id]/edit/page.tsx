"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import dayjs from "dayjs";
import { GqlOpportunityCategory, useGetOpportunityQuery } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { OpportunityFormEditor } from "../../components/OpportunityFormEditor";
import { useHostsAndPlaces } from "../../hooks/useHostsAndPlaces";

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

  const refetchRef = useRef<(() => void) | null>(null);

  // 既存データ取得
  const { data, loading, error } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId: COMMUNITY_ID },
    },
  });

  // 場所データ取得
  const { places, loading: hostsPlacesLoading } = useHostsAndPlaces();

  // 初期データ変換
  const initialData = useMemo(() => {
    if (!data?.opportunity) return undefined;

    const opp = data.opportunity;
    const isActivity = opp.category === GqlOpportunityCategory.Activity;

    // 先に capacity を取得（slots mapping 前）
    const firstSlot = (opp.slots || []).find((slot) => slot != null);
    const capacity = firstSlot?.capacity || 10;

    // slots の型安全な処理
    const slots = (opp.slots || [])
      .filter((slot): slot is NonNullable<typeof slot> => slot != null)
      .map((slot) => ({
        id: slot.id,
        startAt:
          typeof slot.startsAt === "number"
            ? dayjs.unix(slot.startsAt).format("YYYY-MM-DDTHH:mm")
            : dayjs(slot.startsAt).format("YYYY-MM-DDTHH:mm"),
        endAt:
          typeof slot.endsAt === "number"
            ? dayjs.unix(slot.endsAt).format("YYYY-MM-DDTHH:mm")
            : dayjs(slot.endsAt).format("YYYY-MM-DDTHH:mm"),
      }));

    return {
      category: opp.category,
      title: opp.title,
      summary: opp.description,
      description: opp.body || "",
      capacity,

      // カテゴリ別フィールド
      ...(isActivity
        ? {
            feeRequired: opp.feeRequired || 0,
            pointsRequired: opp.pointsRequired || 0,
          }
        : {
            pointsToEarn: opp.pointsToEarn || 0,
          }),

      placeId: opp.place?.id || null,
      hostUserId: opp.createdByUser?.id || "",
      hostName: opp.createdByUser?.name || null,
      requireHostApproval: opp.requireApproval,
      slots,
      images: (opp.images || []).map((url) => ({ url })),
      publishStatus: opp.publishStatus,
    };
  }, [data]);

  if (loading || hostsPlacesLoading) {
    return <LoadingIndicator fullScreen />;
  }

  if (error || !data?.opportunity) {
    return <ErrorState title="募集情報を読み込めませんでした" refetchRef={refetchRef} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 py-6 pb-24 max-w-md mx-auto">
        <OpportunityFormEditor
          mode="update"
          opportunityId={opportunityId}
          initialData={initialData}
          places={places}
          onSuccess={() => router.push("/admin/opportunities")}
        />
      </main>
    </div>
  );
}
