"use client";

import React, { useMemo } from "react";
import { useMutation } from "@apollo/client";
import { EVALUATION_PASS, EVALUATION_FAIL } from "@/graphql/experience/evaluation/mutation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { toast } from "sonner";
import { format } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSlotParticipations } from "@/hooks/useSlotParticipations";

export default function SlotDetailPage({ params }: { params: { id: string } }) {
  const headerConfig = useMemo(() => ({
    title: `開催日程詳細`,
    showLogo: false,
    showBackButton: true,
    backTo: "/admin/slots",
  }), []);
  useHeaderConfig(headerConfig);

  const {
    slot,
    participations,
    loading,
    error,
    loadMoreRef,
    hasMore,
    isLoadingMore
  } = useSlotParticipations(params.id);

  const [evaluationPass, { loading: passLoading }] = useMutation(EVALUATION_PASS, {
    onCompleted: () => {
      toast.success("参加を確認しました");
    },
    onError: (error) => {
      toast.error(`参加確認に失敗しました: ${error.message}`);
    },
  });

  const [evaluationFail, { loading: failLoading }] = useMutation(EVALUATION_FAIL, {
    onCompleted: () => {
      toast.success("不参加を記録しました");
    },
    onError: (error) => {
      toast.error(`不参加記録に失敗しました: ${error.message}`);
    },
  });

  const handleAttendanceChange = async (participationId: string, value: string) => {
    const input = { participationId };
    const permission = { communityId: slot?.opportunity?.community?.id || "neo88" };

    try {
      if (value === "PASSED") {
        await evaluationPass({ variables: { input, permission } });
      } else if (value === "FAILED") {
        await evaluationFail({ variables: { input, permission } });
      }
    } catch (e) {
    }
  };

  if (loading && participations.length === 0) {
    return (
      <div className="p-4 pt-16 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-16">
        <ErrorState message="開催日程の取得に失敗しました" />
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="p-4 pt-16">
        <ErrorState message="開催日程が見つかりません" />
      </div>
    );
  }

  return (
    <div className="p-4 pt-16">
      <CardWrapper className="p-4 mb-4">
        <h1 className="text-xl font-bold mb-2">{slot.opportunity?.title || '無題のイベント'}</h1>
        <div className="space-y-2">
          <p><span className="font-medium">開催日時:</span> {format(new Date(slot.startsAt || slot.startAt), 'yyyy/MM/dd HH:mm')} 〜 {format(new Date(slot.endsAt || slot.endAt), 'HH:mm')}</p>
          <p><span className="font-medium">定員:</span> {slot.capacity}名</p>
          <p><span className="font-medium">ステータス:</span> {slot.hostingStatus}</p>
        </div>
      </CardWrapper>

      <h2 className="text-lg font-bold mb-2">参加者一覧</h2>
      {participations.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">参加者が見つかりません</p>
      ) : (
        <div className="space-y-4">
          {participations.map((participation: any) => (
            <CardWrapper key={participation.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={participation.user?.image || ""} />
                    <AvatarFallback>{participation.user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{participation.user?.name || "未設定"}</p>
                    <p className="text-sm text-muted-foreground">ID: {participation.user?.id}</p>
                  </div>
                </div>
                <ToggleGroup
                  type="single"
                  value={participation.evaluation?.status ?? "PENDING"}
                  onValueChange={(value) => {
                    if (value) handleAttendanceChange(participation.id, value);
                  }}
                  disabled={passLoading || failLoading}
                >
                  <ToggleGroupItem value="PASSED" aria-label="参加">
                    参加
                  </ToggleGroupItem>
                  <ToggleGroupItem value="FAILED" aria-label="不参加">
                    不参加
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardWrapper>
          ))}

          {/* Infinite scroll loading ref */}
          <div ref={loadMoreRef} className="py-4 flex justify-center">
            {hasMore && (
              isLoadingMore ? <LoadingIndicator /> : <p className="text-sm text-muted-foreground">スクロールして続きを読み込む</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
