"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { RecurrenceType, SlotData } from "../../../../types";
import { useRecurrenceState } from "../../hooks/useRecurrenceState";
import dayjs from "dayjs";

interface RecurrenceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseStartAt: string; // 起点の開始日時
  baseEndAt: string; // 起点の終了日時
  onConfirm: (slots: SlotData[]) => void; // 生成したスロットを親に渡す
}

const WEEKDAYS = [
  { value: 1, label: "月" },
  { value: 2, label: "火" },
  { value: 3, label: "水" },
  { value: 4, label: "木" },
  { value: 5, label: "金" },
  { value: 6, label: "土" },
  { value: 0, label: "日" },
];

export function RecurrenceSheet({
  open,
  onOpenChange,
  baseStartAt,
  baseEndAt,
  onConfirm,
}: RecurrenceSheetProps) {
  // カスタムフックで状態管理
  const {
    recurrenceType,
    setRecurrenceType,
    selectedDays,
    setSelectedDays,
    hasEndDate,
    setHasEndDate,
    endDateInput,
    setEndDateInput,
    errors,
    previewSlots,
    validate,
  } = useRecurrenceState({ baseStartAt, baseEndAt });

  // 確定ボタン
  const handleConfirm = () => {
    if (!validate()) return;

    onConfirm(previewSlots);
    onOpenChange(false);
  };

  // キャンセル
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto overflow-y-auto max-h-[80vh]"
      >
        <SheetHeader className="text-left pb-6 px-8 pt-8">
          <SheetTitle className="text-title-sm">繰り返し</SheetTitle>
          <p className="text-body-sm text-muted-foreground pt-2">
            同じ時間帯の開催枠をまとめて作成します
          </p>
        </SheetHeader>

        <div className="px-8 pb-8">
          <ItemGroup className="border rounded-lg">
            {/* 繰り返し種別 */}
            <Item size="sm">
              <ItemContent className="space-y-2">
                <ItemTitle>間隔</ItemTitle>
                <ToggleGroup
                  type="single"
                  value={recurrenceType}
                  onValueChange={(v) => {
                    if (v) setRecurrenceType(v as RecurrenceType);
                  }}
                  className="grid grid-cols-2 w-full"
                >
                  <ToggleGroupItem value="daily">毎日</ToggleGroupItem>
                  <ToggleGroupItem value="weekly">毎週</ToggleGroupItem>
                </ToggleGroup>
              </ItemContent>
            </Item>

            {/* 曜日選択（毎週の場合のみ） */}
            {recurrenceType === "weekly" && (
              <>
                <ItemSeparator />
                <Item size="sm">
                  <ItemContent className="space-y-2">
                    <ItemTitle>曜日選択</ItemTitle>
                    <ToggleGroup
                      type="multiple"
                      value={selectedDays.map(String)}
                      onValueChange={(values) => setSelectedDays(values.map(Number))}
                      className="grid grid-cols-7 gap-2"
                    >
                      {WEEKDAYS.map(({ value, label }) => (
                        <ToggleGroupItem
                          key={value}
                          value={String(value)}
                          className="rounded-full aspect-square p-0 w-10 h-10"
                          size="sm"
                        >
                          {label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                    {errors.days && <p className="text-body-sm text-destructive">{errors.days}</p>}
                  </ItemContent>
                </Item>
              </>
            )}

            <ItemSeparator />

            {/* 終了日選択 */}
            <Item size="sm">
              <ItemContent>
                <ItemTitle>終了日</ItemTitle>
              </ItemContent>

              <ItemActions className="min-w-[140px]">
                <Select
                  value={hasEndDate ? "specified" : "none"}
                  onValueChange={(v) => setHasEndDate(v === "specified")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">指定しない</SelectItem>
                    <SelectItem value="specified">日付を指定</SelectItem>
                  </SelectContent>
                </Select>
              </ItemActions>
            </Item>

            {/* 日付入力（指定する場合のみ） */}
            {hasEndDate && (
              <>
                <ItemSeparator />
                <Item size="sm">
                  <ItemContent>
                    <ItemTitle>終了日を選択</ItemTitle>
                  </ItemContent>

                  <ItemActions>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="tertiary"
                          size="sm"
                          className="w-[180px] justify-between font-normal"
                        >
                          {endDateInput ? dayjs(endDateInput).format("YYYY/MM/DD") : "日付を選択"}
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-3" align="end">
                        <Calendar
                          mode="single"
                          selected={endDateInput ? dayjs(endDateInput).toDate() : undefined}
                          onSelect={(date) => {
                            if (date) {
                              setEndDateInput(dayjs(date).format("YYYY-MM-DD"));
                            }
                          }}
                          disabled={(d) => {
                            if (d < new Date()) return true;
                            const baseDate = dayjs(baseStartAt).toDate();
                            if (dayjs(d).isBefore(dayjs(baseDate), "day")) return true;
                            return false;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </ItemActions>
                </Item>

                {errors.endDate && (
                  <>
                    <ItemSeparator />
                    <Item size="sm">
                      <ItemContent>
                        <p className="text-body-sm text-destructive">{errors.endDate}</p>
                      </ItemContent>
                    </Item>
                  </>
                )}
              </>
            )}

            {/* プレビュー */}
            {previewSlots.length > 0 && (
              <>
                <ItemSeparator />
                <Item size="sm" variant="muted">
                  <ItemContent>
                    <p className="text-body-sm text-foreground">
                      💡 {previewSlots.length}件の開催枠が作成されます
                    </p>
                  </ItemContent>
                </Item>
              </>
            )}
          </ItemGroup>
        </div>

        {/* ボタンエリア */}
        <div className="sticky bottom-0 bg-background border-t p-4 flex gap-3">
          <Button type="button" variant="text" size="md" onClick={handleCancel} className="flex-1">
            やめる
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleConfirm}
            disabled={previewSlots.length === 0}
            className="flex-1"
          >
            追加
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
