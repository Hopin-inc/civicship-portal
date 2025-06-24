"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { GqlSortDirection, useGetOpportunitiesQuery } from "@/types/graphql";
import { TicketCard } from "./TicketCard";
import { useSelection } from "../context/SelectionContext";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TimeSlotList from "@/app/admin/credentials/issue/[opportunityId]/components/TimeSlotList";
import { useReservationDateLoader } from "../hooks/useOpportunitySlotQuery";
import UserSelector from "../issue/[opportunityId]/users/components/UserSelector";

// ウィザード形式の次のステップ用コンポーネント
function NextStepComponent({ selectedTicketIds, onFinish }: { selectedTicketIds: string[], onFinish: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedSlots, setSelectedSlots } = useSelection();
  const router = useRouter();

  const currentId = selectedTicketIds[currentIndex];

  // --- TimeSlotList用データ取得 ---
  const { groupedSlots, loading } = useReservationDateLoader({
    opportunityIds: selectedTicketIds,
  });

  // currentIdに一致するグループのみ抽出
  const currentSections = groupedSlots.filter(section => section.opportunityId === currentId);

  // 選択済みslotIdを取得
  const selectedSlot = selectedSlots.find(item => item.opportunityId === currentId);
  const selectedSlotId = selectedSlot ? selectedSlot.slotId : null;

  // 日付選択時
  const handleDateSelect = (slotId: string) => {
    setSelectedSlots(prev => {
      const filtered = prev.filter(item => item.opportunityId !== currentId);
      return [...filtered, { opportunityId: currentId, slotId, userIds: [] }];
    });
  };

  // 次へボタンの表示判定
  const canProceed = !!selectedSlotId;

  // 次へボタンのハンドラ
  const handleNext = () => {
    if (currentIndex < selectedTicketIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 最後まで進んだらonFinishを呼ぶ
      onFinish();
    }
  };

  // キャンセルボタンのハンドラ
  const handleCancel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      router.push("/admin/credentials");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">
        開催日を選ぶ（{currentIndex + 1}/{selectedTicketIds.length}）
      </h1>
      <TimeSlotList
        dateSections={currentSections}
        selectedDate={selectedSlotId}
        onSelectDate={handleDateSelect}
        onNext={canProceed ? handleNext : undefined}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default function TicketSelector() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { selectedTicketIds, setSelectedTicketIds } = useSelection();
  const router = useRouter();
  const { selectedSlots } = useSelection();
  console.log(selectedSlots);
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

  // ステップ1: チケット選択
  if (step === 1) {
    return (
      <div className="space-y-4 flex flex-col min-h-screen">
        <h1 className="text-2xl font-bold">募集を選ぶ</h1>
        <div className="flex-1">
          <div className="grid gap-4">
            {opportunityList?.map((opportunity) => (
              <TicketCard
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

  // ステップ2: 日付選択ウィザード
  if (step === 2) {
    return <NextStepComponent selectedTicketIds={selectedTicketIds} onFinish={() => setStep(3)} />;
  }

  // ステップ3: 完了画面や確認画面など
  if (step === 3) {
    return (
        <UserSelector/>
    );
  }

  // 必要に応じて他のステップも追加可能
  return null;
}