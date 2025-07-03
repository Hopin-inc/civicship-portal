import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GqlEvaluationStatus, GqlParticipation } from "@/types/graphql";
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
  allEvaluated: boolean;
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
  allEvaluated,
}) => {
  return (
    <div>
      <h2 className="text-title-sm font-bold mb-3">参加者</h2>
      {participations.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">参加者が見つかりません</p>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          {participations.map((p, idx) => {
            if (!p.user) return null;

            return (
              <Card
                key={p.id}
                className={cn(
                  "transition-colors",
                  idx !== participations.length - 1 && "border-b rounded-none",
                )}
              >
                <CardHeader className="flex items-center justify-between p-4 gap-3">
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    <Avatar>
                      <AvatarImage src={p.user.image || ""} />
                      <AvatarFallback>{p.user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-base truncate">{p.user.name || "未設定"}</CardTitle>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={attendanceData[p.id] ?? GqlEvaluationStatus.Pending}
                    onValueChange={(v) =>
                      v && handleAttendanceChange(p.id, v as GqlEvaluationStatus)
                    }
                    disabled={isSaved || isSaving || batchLoading || Boolean(p.evaluation?.status)}
                    className="flex-shrink-0"
                  >
                    <ToggleGroupItem value={GqlEvaluationStatus.Passed} aria-label="参加">
                      参加
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value={GqlEvaluationStatus.Failed}
                      color="danger"
                      aria-label="不参加"
                    >
                      不参加
                    </ToggleGroupItem>
                  </ToggleGroup>
                </CardHeader>
              </Card>
            );
          })}

          <Sheet open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <SheetTrigger asChild>
              {participations.length > 0 && !isSaved && (
                <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-4 bg-background border-t-2 border-b-card space-y-3 z-50">
                  <Button className="w-full py-4" size="lg" disabled={isSaving || !allEvaluated}>
                    {isSaving ? "保存中…" : "出欠を保存する"}
                  </Button>
                </div>
              )}
            </SheetTrigger>

            <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
              <SheetHeader className="pb-6">
                <SheetTitle>出欠情報を保存しますか？</SheetTitle>
                <SheetDescription>
                  保存後は編集できなくなります。本当に保存してよろしいですか？
                </SheetDescription>
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
