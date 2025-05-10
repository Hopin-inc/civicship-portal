import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Activity } from "@/types";
import { useState } from "react";

type Props = {
  activity: Activity;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onConfirm: () => void;
};

export const ActivityReservationSheet = ({
  activity,
  isOpen,
  onOpenChange,
  selectedDate,
  onSelectDate,
  onConfirm,
}: Props) => {
  const [participants, setParticipants] = useState("1");
  if (!activity) return null;
  const participantCount = parseInt(participants);
  const totalPrice = (activity?.price ?? 0) * participantCount;

  const participantOptions = Array.from(
    { length: activity.capacity },
    (_, i) => i + 1
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-w-lg mx-auto rounded-t-lg">
        <div className="container max-w-lg mx-auto px-4">
          <SheetHeader>
            <SheetTitle>予約内容の確認</SheetTitle>
            <SheetDescription>
              参加希望日と人数を選択して、予約を確定してください
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <div className="font-bold">参加人数</div>
              <Select
                value={participants}
                onValueChange={(value) => setParticipants(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="人数を選択" />
                </SelectTrigger>
                <SelectContent>
                  {participantOptions.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}名
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="font-bold">参加希望日</div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onSelectDate}
                locale={ja}
                disabled={(date) => {
                  if (date < new Date()) return true;
                  if (!activity.schedule?.daysOfWeek) {
                    return false;
                  }
                  return !activity.schedule.daysOfWeek.includes(date.getDay());
                }}
                className="rounded-md"
              />
            </div>

            {selectedDate && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4 space-y-3">
                  <div className="font-bold">予約内容</div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between">
                      <span>日時</span>
                      <span>
                        {format(selectedDate, "M月d日(E)", {
                          locale: ja,
                        })}{" "}
                        {activity.schedule.startTime}-
                        {activity.schedule.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>参加人数</span>
                      <span>{participantCount}名</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground">
                      <span>合計金額</span>
                      <span>¥{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={onConfirm}
                  className="w-full"
                  disabled={!selectedDate || participantCount < 1}
                >
                  この内容で申し込む
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
