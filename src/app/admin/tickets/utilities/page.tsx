"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { CardWrapper } from "@/components/ui/card-wrapper";
import {
  GqlSortDirection,
  useGetUtilitiesQuery,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { useAuth } from "@/contexts/AuthProvider";
import CreateUtilitySheet from "./components/CreateUtilitySheet";

export default function UtilitiesPage() {
  const headerConfig = useMemo(
    () => ({
      title: "チケットの種類管理",
      showBackButton: true,
      showLogo: false,
      backTo: "/admin/tickets",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { user } = useAuth();

  const { data: utilityData, refetch: refetchUtilities } = useGetUtilitiesQuery({
    variables: {
      filter: { communityIds: [COMMUNITY_ID], ownerIds: [user?.id ?? ""] },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
  });

  const utilityList = utilityData?.utilities?.edges?.map((e) => e?.node) ?? [];

  return (
    <div className="p-4 space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">チケットの種類一覧</h2>
          <CreateUtilitySheet onUtilityCreated={refetchUtilities} />
        </div>
        <div className="space-y-2">
          {utilityList.length === 0 ? (
            <p className="text-muted-foreground">チケットの種類がありません</p>
          ) : (
            utilityList.map((utility) => (
              <CardWrapper key={utility?.id} className="p-4">
                <div className="text-sm">
                  <div className="font-semibold">{utility?.name}</div>
                  <div className="text-muted-foreground">{utility?.description}</div>
                  <div>交換ポイント: {utility?.pointsRequired}</div>
                </div>
              </CardWrapper>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
