"use client";

import React, { use, useMemo, useState, useEffect, useRef } from "react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSlotParticipations } from "@/hooks/useSlotParticipations";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { CalendarIcon, MapPin, User } from "lucide-react";
import { prefectureLabels } from "@/app/users/data/presenter";
import { GqlCurrentPrefecture } from "@/types/graphql";
import { cn } from "@/lib/utils";
import { displayDuration } from "@/utils";

export default function SlotDetailPage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const headerConfig = useMemo(() => ({
    title: `出欠入力`,
    showLogo: false,
    showBackButton: true,
    backTo: "/admin/slots",
  }), []);
  useHeaderConfig(headerConfig);

  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [allEvaluated, setAllEvaluated] = useState<boolean>(false);

  const {
    slot,
    participations,
    loading,
    error,
    loadMoreRef,
    hasMore,
    isLoadingMore,
  } = useSlotParticipations(id);

  const [evaluationPass, { loading: passLoading }] = useMutation(EVALUATION_PASS, {
    onCompleted: () => {
      toast.success("参加を確認しました");
    },
    onError: (error) => {
      toast.error(`参加確認に失敗しました: ${ error.message }`);
    },
  });

  const [evaluationFail, { loading: failLoading }] = useMutation(EVALUATION_FAIL, {
    onCompleted: () => {
      toast.success("不参加を記録しました");
    },
    onError: (error) => {
      toast.error(`不参加記録に失敗しました: ${ error.message }`);
    },
  });

  const [batchEvaluate, { loading: batchLoading }] = useMutation(EVALUATION_BULK_CREATE, {
    onCompleted: () => {
      toast.success("出欠情報を保存しました");
      setIsSaved(true);
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error(`出欠情報の保存に失敗しました: ${ error.message }`);
      setIsSaving(false);
    },
  });

  const processedParticipationIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (participations.length > 0) {
      const initialAttendance: Record<string, string> = {};
      let hasNewParticipations = false;
      let allEvaluatedStatus = true;
      let hasAnyEvaluation = false;

      participations.forEach((participation: any) => {
        if (!processedParticipationIds.current.has(participation.id)) {
          processedParticipationIds.current.add(participation.id);
          hasNewParticipations = true;

          if (participation.evaluation?.status) {
            initialAttendance[participation.id] = participation.evaluation.status;
            hasAnyEvaluation = true;

            if (participation.evaluation.status === "PENDING") {
              allEvaluatedStatus = false;
            }
          } else {
            initialAttendance[participation.id] = "PENDING";
            allEvaluatedStatus = false;
          }
        }
      });

      if (hasNewParticipations) {
        setAttendanceData(prev => ({ ...prev, ...initialAttendance }));

        if (hasAnyEvaluation && allEvaluatedStatus) {
          setIsSaved(true);
        }

        setAllEvaluated(allEvaluatedStatus);
      }
    }
  }, [participations]);

  const handleAttendanceSelection = (participationId: string, value: string) => {
    if (isSaved) return; // 保存済みの場合は編集不可
    setAttendanceData(prev => ({ ...prev, [participationId]: value }));
  };

  const handleOpenConfirmDialog = () => {
    const isAllSelected = participations.every((participation: any) =>
      attendanceData[participation.id] && attendanceData[participation.id] !== "PENDING",
    );

    if (!isAllSelected) {
      toast.error("すべての参加者の出欠を選択してください");
      return;
    }

    setIsConfirmDialogOpen(true);
  };

  const handleSaveAllAttendance = async () => {
    setIsSaving(true);
    setIsConfirmDialogOpen(false);

    const evaluations = participations.map((participation: any) => ({
      participationId: participation.id,
      status: attendanceData[participation.id],
    }));

    try {
      await batchEvaluate({
        variables: {
          input: { evaluations },
          permission: { communityId: slot?.opportunity?.community?.id || "neo88" },
        },
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
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2">{ slot.opportunity?.title || "無題のイベント" }</h1>
        <div className="flex flex-col flex-wrap text-body-sm gap-2 mt-4">
          <p className="inline-flex items-center gap-2 text-body-md">
            <CalendarIcon size="24" />
            { slot.startsAt && displayDuration(slot.startsAt, slot.endsAt) }
          </p>
          <p className="inline-flex items-center gap-2 text-body-md">
            <User size="24" />
            予約 { slot.capacity - slot.remainingCapacity }名
            <span className="text-caption">/ 定員 { slot.capacity }名</span>
          </p>
        </div>
      </div>
      
      {/* Add participant count information */}
      <div className="text-sm mb-4">
        <p>参加者: {slot.numParticipants || 0}名</p>
        <p>出欠評価済み: {slot.numEvaluated || 0}名 
           ({slot.numParticipants ? 
             Math.round((slot.numEvaluated / slot.numParticipants) * 100) : 
             0}%)
        </p>
      </div>

      <h2 className="text-lg font-bold mb-2">参加者一覧</h2>
      { participations.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">参加者が見つかりません</p>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          { participations.map((participation: any, index: number) => (
            <CardWrapper key={ participation.id }
                         className={ cn("p-4 rounded-none border-0 flex justify-between items-center", (index !== participations.length - (hasMore ? 2 : 1)) && "border-b") }>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={ participation.user?.image || "" } />
                  <AvatarFallback>{ participation.user?.name?.[0] || "U" }</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{ participation.user?.name || "未設定" }</p>
                  <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size="16" />
                    { participation.user?.currentPrefecture
                      ? prefectureLabels[participation.user.currentPrefecture as GqlCurrentPrefecture]
                      : "不明" }
                  </p>
                </div>
              </div>
              <ToggleGroup
                type="single"
                value={ attendanceData[participation.id] || "PENDING" }
                onValueChange={ (value) => {
                  if (value) handleAttendanceChange(participation.id, value);
                } }
                disabled={ isSaved || isSaving || passLoading || failLoading || participation.evaluation !== null && participation.evaluation !== undefined }
              >
                <ToggleGroupItem value="PASSED" aria-label="参加">
                  参加
                </ToggleGroupItem>
                <ToggleGroupItem value="FAILED" color="danger" aria-label="不参加">
                  不参加
                </ToggleGroupItem>
              </ToggleGroup>
            </CardWrapper>
          )) }

          { hasMore && (
            <div ref={ loadMoreRef } className="py-4 flex justify-center">
              { isLoadingMore
                ? <LoadingIndicator />
                : <p className="text-sm text-muted-foreground">スクロールして続きを読み込む</p> }
            </div>
          ) }

          {/* 保存ボタン */ }
          { participations.length > 0 && !isSaved && (
            <Card className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto bg-white border-0 border-t rounded-none">
              <CardFooter className="p-4">
                <Button
                  className="w-full"
                  onClick={ handleOpenConfirmDialog }
                  disabled={ isSaving || allEvaluated }
                >
                  { isSaving ? "保存中..." : allEvaluated ? "すべての出欠が確定済み" : "出欠を保存する" }
                </Button>
              </CardFooter>
            </Card>
          ) }

          {/* 保存済みの場合に表示するメッセージ */ }
          { participations.length > 0 && isSaved && (
            <Card className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto bg-white border-0 border-t rounded-none">
              <CardFooter className="p-4 flex justify-center">
                <p className="text-muted-foreground">
                  出欠情報は確定済みです
                </p>
              </CardFooter>
            </Card>
          ) }

          {/* 確認ダイアログ */ }
          <Sheet open={ isConfirmDialogOpen } onOpenChange={ setIsConfirmDialogOpen }>
            <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto pt-6 px-6">
              <SheetHeader className="text-left pb-6">
                <SheetTitle>出欠情報を保存しますか？</SheetTitle>
              </SheetHeader>
              <p className="text-muted-foreground mb-6">
                保存後は編集できなくなります。本当に保存しますか？
              </p>
              <SheetFooter className="flex flex-col space-y-2 sm:space-y-0">
                <Button
                  onClick={ handleSaveAllAttendance }
                  disabled={ isSaving }
                  className="w-full"
                >
                  { isSaving ? "保存中..." : "保存する" }
                </Button>
                <Button
                  onClick={ () => setIsConfirmDialogOpen(false) }
                  variant="text"
                  className="w-full"
                >
                  キャンセル
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      ) }
    </div>
  );
}
