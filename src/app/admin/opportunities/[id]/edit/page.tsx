"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import dayjs from "dayjs";
import {
  GqlOpportunityCategory,
  GqlMembershipStatus,
  useGetOpportunityQuery,
  useGetMembershipListQuery,
  useGetPlacesQuery,
} from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { OpportunityFormEditor } from "../../components/OpportunityFormEditor";

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
    []
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

  // メンバー一覧取得
  const { data: membersData, loading: membersLoading } = useGetMembershipListQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
        status: GqlMembershipStatus.Joined,
      },
      first: 100,
    },
    fetchPolicy: "cache-first",
  });

  // 場所一覧取得
  const { data: placesData, loading: placesLoading } = useGetPlacesQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
      },
      first: 100,
    },
    fetchPolicy: "cache-first",
  });

  // データ変換
  const hosts = useMemo(() => {
    return (membersData?.memberships?.edges || [])
      .map((edge) => edge?.node?.user)
      .filter((user): user is NonNullable<typeof user> => user != null)
      .map((user) => ({
        id: user.id,
        name: user.name || "名前なし",
      }));
  }, [membersData]);

  const places = useMemo(() => {
    return (placesData?.places?.edges || [])
      .map((edge) => edge?.node)
      .filter((place): place is NonNullable<typeof place> => place != null)
      .map((place) => ({
        id: place.id,
        label: place.name,
      }));
  }, [placesData]);

  // 初期データ変換
  const initialData = useMemo(() => {
    if (!data?.opportunity) return undefined;

    const opp = data.opportunity;
    const isActivity = opp.category === GqlOpportunityCategory.Activity;

    return {
      category: opp.category,
      title: opp.title,
      summary: opp.description,
      description: opp.body || "",
      capacity: opp.slots[0]?.capacity || 10,

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
      requireHostApproval: opp.requireApproval,
      slots: (opp.slots || []).map((slot) => ({
        id: slot.id,
        startAt: dayjs.unix(slot.startsAt).format("YYYY-MM-DDTHH:mm"),
        endAt: dayjs.unix(slot.endsAt).format("YYYY-MM-DDTHH:mm"),
      })),
      images: (opp.images || []).map((url) => ({ url })),
      publishStatus: opp.publishStatus,
    };
  }, [data]);

  if (loading || membersLoading || placesLoading) {
    return <LoadingIndicator fullScreen />;
  }

  if (error || !data?.opportunity) {
    return <ErrorState title="募集情報を読み込めませんでした" refetchRef={refetchRef} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 py-6 pb-24 max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">募集編集</h1>
          <p className="text-muted-foreground mt-2">募集情報を編集してください</p>
        </div>

        <OpportunityFormEditor
          mode="update"
          opportunityId={opportunityId}
          initialData={initialData}
          hosts={hosts}
          places={places}
          onSuccess={() => router.push("/admin/opportunities")}
        />
      </main>
    </div>
  );
}
