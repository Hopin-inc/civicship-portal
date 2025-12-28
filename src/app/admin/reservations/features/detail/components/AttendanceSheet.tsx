import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  GqlEvaluationStatus,
  GqlOpportunity,
  GqlOpportunityCategory,
  GqlParticipation,
} from "@/types/graphql";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { cn } from "@/lib/utils";

interface AttendanceListProps {
  participations: GqlParticipation[];
  attendanceData: Record<string, GqlEvaluationStatus>;
  handleAttendanceChange: (id: string, status: GqlEvaluationStatus) => void;
  isSaved: boolean;
  isSaving: boolean;
  batchLoading: boolean;
  isConfirmDialogOpen: boolean;
  setIsConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveAllAttendance: () => void;
  opportunity?: GqlOpportunity | null;
  isInsufficientBalance: boolean;
}

const AttendanceList: React.FC<AttendanceListProps> = ({
  participations,
  attendanceData,
  handleAttendanceChange,
  isSaved,
  isSaving,
  batchLoading,
  isConfirmDialogOpen,
  setIsConfirmDialogOpen,
  handleSaveAllAttendance,
  opportunity,
  isInsufficientBalance,
}) => {
  return (
    <div>
      <h2 className="text-title-sm font-bold mt-10 mb-1">参加者</h2>
      <p className="text-body-xs text-muted-foreground mb-2">
        <span>当日参加した方を選択してください（未選択は不参加になります）</span>
      </p>
      <div className={"pb-4"}>
        <NoticeCard
          title="保存後の処理について"
          description={
            opportunity?.category === GqlOpportunityCategory.Quest
              ? `参加した方には証明書(VC)が発行され、1人につき${opportunity.pointsToEarn || 0}ptが付与されます。改めて編集することはできません。`
              : "参加した方には証明書(VC)が発行され、改めて編集することはできません。"
          }
        />
      </div>

      {participations.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">参加者が見つかりません</p>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          {participations.map((p, idx) => (
            <Card
              key={p.id}
              className={cn("rounded-none", idx !== participations.length - 1 && "border-b")}
            >
              <div className="p-3 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={p.user?.image || ""} />
                  <AvatarFallback>{p.user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-body-sm truncate">
                    {p.user?.name || "未設定"}
                  </div>
                </div>

                <Button
                  variant={
                    attendanceData[p.id] === GqlEvaluationStatus.Passed ? "primary" : "tertiary"
                  }
                  className={"w-24"}
                  size="sm"
                  onClick={() =>
                    handleAttendanceChange(
                      p.id,
                      attendanceData[p.id] === GqlEvaluationStatus.Passed
                        ? GqlEvaluationStatus.Failed
                        : GqlEvaluationStatus.Passed,
                    )
                  }
                  disabled={isSaved || isSaving || batchLoading || Boolean(p.evaluation?.status)}
                >
                  参加
                </Button>
              </div>
            </Card>
          ))}

          <Sheet open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <SheetTrigger asChild>
              {participations.length > 0 && !isSaved && (
                <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-4 bg-background border-t-2 border-b-card space-y-3 z-50">
                  <Button
                    className="w-full py-4"
                    size="lg"
                    disabled={isSaving || isInsufficientBalance}
                  >
                    {isSaving ? "保存中…" : "出欠を保存する"}
                  </Button>
                </div>
              )}
            </SheetTrigger>

            <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
              <SheetHeader className="pb-6">
                <SheetTitle>出欠情報を保存しますか？</SheetTitle>
                <SheetDescription>保存後は編集できません。</SheetDescription>
              </SheetHeader>
              <div className="space-y-3 mt-4">
                <Button
                  onClick={handleSaveAllAttendance}
                  size="lg"
                  className="w-full py-4"
                  variant="primary"
                  disabled={isSaving}
                >
                  {isSaving ? "保存中…" : "保存する"}
                </Button>
                <Button
                  onClick={() => setIsConfirmDialogOpen(false)}
                  variant="tertiary"
                  className="w-full py-4"
                >
                  キャンセル
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
