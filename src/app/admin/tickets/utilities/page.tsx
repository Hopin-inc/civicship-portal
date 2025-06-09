"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { Button } from "@/components/ui/button";
import {
  GqlSortDirection,
  useGetUtilitiesQuery,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { useAuth } from "@/contexts/AuthProvider";
import CreateUtilitySheet from "./components/CreateUtilitySheet";
import OpportunityListSheet from "./components/OpportunityListSheet";
import { Coins, MessageSquareText, Tickets } from "lucide-react";

export default function UtilitiesPage() {
  const headerConfig = useMemo(
    () => ({
      title: "チケットの種類",
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
      filter: { communityIds: [COMMUNITY_ID], ownerIds: user?.id ? [user.id] : undefined },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
  });

  const utilityList = utilityData?.utilities?.edges?.map((e) => e?.node) ?? [];

  return (
    <div className="p-4 space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">チケットの種類</h2>
          <CreateUtilitySheet buttonLabel="新規追加" onUtilityCreated={ async () => {
            await refetchUtilities();
          } } />
        </div>
        <div className="space-y-2">
          { utilityList.length === 0 ? (
            <p className="text-muted-foreground">チケットの種類がありません</p>
          ) : (
            utilityList.map((utility) => {
              const opportunityCount = (utility as any)?.requiredForOpportunities?.length ?? 0;

              return (
                <CardWrapper key={ utility?.id } className="p-4">
                  <div>
                    <p className="text-title-md mb-2">{ utility?.name }</p>
                    <div className="flex items-end">
                      <div className="text-tertiary-foreground space-y-1 flex-grow">
                        <div className="flex align-center gap-1">
                          <MessageSquareText size="20" className="mt-0.5 text-muted-foreground" />
                          <p>{ utility?.description }</p>
                        </div>
                        <div className="flex align-center gap-1">
                          <Coins size="20" className="mt-0.5 text-muted-foreground" />
                          <p>{ utility?.pointsRequired }ポイントで発行可能</p>
                        </div>
                        <div className="flex align-center gap-1">
                          <Tickets size="20" className="mt-0.5 text-muted-foreground" />
                          <p>{ opportunityCount }件の体験で利用可能</p>
                        </div>
                      </div>
                      <OpportunityListSheet
                        opportunities={ (utility as any)?.requiredForOpportunities ?? [] }
                        utilityName={ utility?.name ?? "" }
                      >
                        <Button variant="secondary" size="sm">
                          詳細
                        </Button>
                      </OpportunityListSheet>
                    </div>
                  </div>
                </CardWrapper>
              );
            })
          ) }
        </div>
      </div>
    </div>
  );
}
