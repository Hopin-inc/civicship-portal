"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { GqlMembershipStatus, useGetMembershipListQuery, useGetPlacesQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
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

  if (membersLoading || placesLoading) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 py-6 pb-24 max-w-md mx-auto">
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
