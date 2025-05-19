"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { EVALUATION_PASS, EVALUATION_FAIL } from "@/graphql/experience/evaluation/mutation";
import { EVALUATION_BULK_CREATE } from "@/graphql/experience/evaluation/batchMutation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { toast } from "sonner";
import { format } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSlotParticipations } from "@/hooks/useSlotParticipations";
import { use } from "react";

export default function SlotDetailPage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const headerConfig = useMemo(() => ({
    title: `開催日程詳細`,
    showLogo: false,
    showBackButton: true,
    backTo: "/admin/slots",
  }), []);
  useHeaderConfig(headerConfig);

  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {
    slot,
    participations,
    loading,
    error,
    loadMoreRef,
    hasMore,
    isLoadingMore
  } = useSlotParticipations(id);

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
  
  const [batchEvaluate, { loading: batchLoading }] = useMutation(EVALUATION_BULK_CREATE, {
    onCompleted: () => {
      toast.success("出欠情報を保存しました");
      setIsSaved(true);
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error(`出欠情報の保存に失敗しました: ${error.message}`);
      setIsSaving(false);
    },
  });
  
  useEffect(() => {
    if (participations.length > 0) {
      const initialAttendance: Record<string, string> = {};
      participations.forEach((participation: any) => {
        if (participation.evaluation?.status) {
          initialAttendance[participation.id] = participation.evaluation.status;
        } else {
          initialAttendance[participation.id] = "PENDING";
        }
      });
      setAttendanceData(initialAttendance);
    }
  }, [participations]);

  const handleAttendanceSelection = (participationId: string, value: string) => {
    if (isSaved) return; // 保存済みの場合は編集不可
    setAttendanceData(prev => ({ ...prev, [participationId]: value }));
  };

  const handleSaveAllAttendance = async () => {
    const isAllSelected = participations.every((participation: any) => 
      attendanceData[participation.id] && attendanceData[participation.id] !== "PENDING"
    );
    
    if (!isAllSelected) {
      toast.error("すべての参加者の出欠を選択してください");
      return;
    }

    setIsSaving(true);
    
    const evaluations = participations.map((participation: any) => ({
      participationId: participation.id,
      status: attendanceData[participation.id]
    }));

    try {
      await batchEvaluate({
        variables: {
          input: { evaluations },
          permission: { communityId: slot?.opportunity?.community?.id || "neo88" }
        }
      });
    } catch (e) {
      setIsSaving(false);
    }
  };

  const handleAttendanceChange = async (participationId: string, value: string) => {
    if (isSaved) return;
    
    handleAttendanceSelection(participationId, value);
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
        <ErrorState title="開催日程の取得に失敗しました" />
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="p-4 pt-16">
        <ErrorState title="開催日程が見つかりません" />
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
                  value={attendanceData[participation.id] || "PENDING"}
                  onValueChange={(value) => {
                    if (value) handleAttendanceChange(participation.id, value);
                  }}
                  disabled={isSaved || isSaving || passLoading || failLoading}
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

          {/* 保存ボタン */}
          {participations.length > 0 && !isSaved && (
            <Card className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto">
              <CardFooter className="p-4">
                <Button
                  className="w-full"
                  onClick={handleSaveAllAttendance}
                  disabled={isSaving}
                >
                  {isSaving ? "保存中..." : "出欠を保存する"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* 保存済みの場合に表示するメッセージ */}
          {participations.length > 0 && isSaved && (
            <Card className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto">
              <CardFooter className="p-4 flex justify-center">
                <p className="text-muted-foreground">
                  出欠情報は保存済みです
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
