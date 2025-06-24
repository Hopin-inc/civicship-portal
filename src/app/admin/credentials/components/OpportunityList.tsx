import { useAuth } from "@/contexts/AuthProvider";
import { GqlSortDirection, useGetOpportunitiesQuery } from "@/types/graphql";
import { OpportunityCard } from "./OpportunityCard";
import { useSelection } from "../context/SelectionContext";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React from "react";

export default function OpportunityList({ setStep }: { setStep: (step: number) => void }) {
  const { user } = useAuth();
  const { selectedTicketIds, setSelectedTicketIds } = useSelection();
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
    if (selectedTicketIds.includes(opportunityId)) {
      setSelectedTicketIds(selectedTicketIds.filter(id => id !== opportunityId));
    } else {
      setSelectedTicketIds([...selectedTicketIds, opportunityId]);
    }
  };

  return (
    <div className="space-y-4 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold">募集を選ぶ</h1>
      <div className="flex-1">
        <div className="grid gap-4">
          {opportunityList?.map((opportunity) => (
            <OpportunityCard
              key={opportunity?.id}
              title={opportunity?.title ?? "名称未設定のチケット"}
              qty={opportunity?.slots?.length ?? 0}
              isSelected={selectedTicketIds.includes(opportunity?.id ?? "")}
              onClick={() => handleSelectTicket(opportunity?.id ?? "")}
            />
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-between px-6 py-4 z-10">
        <Button
          variant="secondary"
          className="text-gray-500 font-bold"
          onClick={() => {
            setSelectedTicketIds([]);
            router.push("/admin/credentials");
          }}
        >
          キャンセル
        </Button>
        <Button
          className={`rounded-full px-8 py-2 font-bold text-white ${selectedTicketIds.length > 0 ? "bg-primary" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          disabled={selectedTicketIds.length === 0}
          onClick={() => {
            if (selectedTicketIds.length > 0) {
              setStep(2); // ステップを進める
            }
          }}
        >
          次へ
        </Button>
      </div>
    </div>
  );
} 