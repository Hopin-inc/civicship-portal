import { useAuth } from "@/contexts/AuthProvider";
import { GqlSortDirection, useGetOpportunitiesQuery } from "@/types/graphql";
import { OpportunityCard } from "./OpportunityCard";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useSelection } from "../../context/SelectionContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React, { useMemo, useState } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { STEPS } from "../CredentialIssuanceWizard";
import SearchForm from "@/components/shared/SearchForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

const STEP_NUMBERS = {
  CURRENT: 1,
  TOTAL: 3,
} as const;

const STEP_COLORS = {
  PRIMARY: "#71717A",
  GRAY: "text-gray-400",
} as const;

export default function OpportunityList({ setStep }: { setStep: (step: number) => void }) {
  const { user } = useAuth();
  const { selectedSlot,setSelectedSlot } = useSelection();
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: "証明書発行",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { data: opportunityData, loading } = useGetOpportunitiesQuery({
    variables: {
      filter: {
        communityIds: [COMMUNITY_ID],
        keyword: searchQuery,
      },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
    skip: !user?.id,
  });

  const opportunityList = opportunityData?.opportunities?.edges?.map((e) => e?.node) ?? [];
  const handleSelectTicket = (opportunityId: string) => {
    setSelectedSlot({ opportunityId, slotId: "", userIds: [] });
  };

  if (loading) return <LoadingIndicator fullScreen={true} />;

  return (
    <div className="space-y-6 flex flex-col min-h-screen mt-2">
      <div className="flex items-end gap-2">
        <h1 className="text-2xl font-bold">募集を選ぶ</h1>
        <span className="ml-1 flex mb-1 items-baseline">
          <span className={`${STEP_COLORS.GRAY} text-base`}>(</span>
          <span className="text-xl font-bold ml-1" style={{ color: STEP_COLORS.PRIMARY }}>
            {STEP_NUMBERS.CURRENT}
          </span>
          <span className={`${STEP_COLORS.GRAY} text-base`}>/</span>
          <span className={`${STEP_COLORS.GRAY} text-base mr-1`}>{STEP_NUMBERS.TOTAL}</span>
          <span className={`${STEP_COLORS.GRAY} text-base`}>)</span>
        </span>
      </div>
      <div>
          <SearchForm
            placeholder="募集を検索"
            onSearch={setSearchQuery}
            value={input}
            onInputChange={setInput}
          />
        </div>
      <div className="flex-1">
        <div className="grid gap-4">
          {opportunityList?.map((opportunity) => (
            <OpportunityCard
              key={opportunity?.id}
              title={opportunity?.title}
              qty={opportunity?.slots?.length ?? 0}
              isSelected={selectedSlot?.opportunityId === opportunity?.id}
              onClick={() => handleSelectTicket(opportunity?.id ?? "")}
              opportunityId={opportunity?.id ?? ""}
            />
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white z-10">
        <div className="w-full max-w-sm mx-auto flex justify-between px-4 py-4 border-t">
          <Button
            variant="text"
            className="text-gray-500"
            onClick={() => {
              setSelectedSlot(null);
              router.push("/admin/credentials");
            }}
          >
            キャンセル
          </Button>
          <Button
            className={`rounded-full font-bold text-white ${selectedSlot?.opportunityId ? "bg-primary" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            disabled={!selectedSlot?.opportunityId}
            size="lg"
            onClick={() => {
              if (selectedSlot?.opportunityId) {
                setStep(STEPS.SELECT_TIME_SLOT);
              }
            }}
          >
            次へ
          </Button>
        </div>
      </div>
    </div>
  );
}
