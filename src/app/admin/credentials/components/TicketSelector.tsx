"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { GqlSortDirection, useGetOpportunitiesQuery } from "@/types/graphql";
import { TicketCard } from "./TicketCard";
import { useSelection } from "../context/SelectionContext";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useRouter } from "next/navigation";

export default function TicketSelector() {
    const { user } = useAuth();
    const { selectedTicketId, setSelectedTicketId } = useSelection();
    const router = useRouter();
    
    const { data: opportunityData } = useGetOpportunitiesQuery({
        variables: {
          filter: {
            communityIds: [COMMUNITY_ID],
            createdByUserIds: [user?.id ?? ""],
          },
          sort: { createdAt: GqlSortDirection.Desc },
          first: 20,
        },
        skip: !user?.id,
      });
    
      const opportunityList = opportunityData?.opportunities?.edges?.map((e) => e?.node) ?? [];

    const handleSelectTicket = (opportunityId: string) => {
        setSelectedTicketId(opportunityId);
        router.push(`/admin/credentials/${opportunityId}?community_id=${COMMUNITY_ID}`);
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {opportunityList?.map((opportunity) => {
                    return (
                        <TicketCard
                            key={opportunity?.id}
                            title={opportunity?.title ?? "名称未設定のチケット"}
                            qty={opportunity?.slots?.length ?? 0}
                            isSelected={selectedTicketId === opportunity?.id}
                            onClick={() => handleSelectTicket(opportunity?.id ?? "")}
                        />
                    );
                })}
            </div>
        </div>
    );
}