import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ActivitySlot, ActivitySlotGroup } from "@/app/reservation/data/type/opportunitySlot";
import { formatTimeRange, getCrossDayLabel } from "@/utils/date";
import { isBefore } from "date-fns";
import { getReservationThreshold } from "@/app/reservation/data/presenter/opportunitySlot";
import { GqlOpportunityCategory } from "@/types/graphql";

interface TimeSlotListProps {
  dateSections: ActivitySlotGroup[];
  isSlotAvailable: (slot: ActivitySlot) => boolean;
  onSelectSlot: (slot: ActivitySlot) => void;
  pointsToEarn: number;
  category: GqlOpportunityCategory;
  activityId?: string;
}

export const parseJapaneseDateLabel = (label: string) => {
  const match = label.match(/^(\d+)月(\d+)日（(.+)）$/);
  if (!match) return { month: "", day: "", weekday: "" };

  const [, month, day, weekday] = match;
  return { month, day, weekday };
};

const SectionHeader = ({ label }: { label: string }) => {
  const { month, day, weekday } = parseJapaneseDateLabel(label);

  return (
    <h2 className="flex items-baseline gap-1 mb-2">
      <span className="text-lg text-gray-500">{month}/</span>
      <span className="text-display-xl">{day}</span>
      <span className="text-sm text-gray-500">（{weekday}）</span>
    </h2>
  );
};

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  dateSections,
  isSlotAvailable,
  onSelectSlot,
  pointsToEarn,
  category,
  activityId,
}) => {
  const handleSelectSlot = useCallback(
    (slot: ActivitySlot) => () => onSelectSlot(slot),
    [onSelectSlot],
  );

  const registrationCutoff = getReservationThreshold(activityId);

  return (
    <div className="space-y-8">
      {dateSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <SectionHeader label={section.dateLabel} />
          <div className="space-y-2">
            {section.slots.map((slot, slotIndex) => {
              const remainingCapacity = slot.remainingCapacity || 0;
              const isFull = remainingCapacity === 0;
              const isAvailable = isSlotAvailable(slot);
              const isFeeSpecified = slot.feeRequired != null;

              const startsAtDate = new Date(slot.startsAt);
              const endsAtDate = new Date(slot.endsAt);

              const isRegistrationClosed = isBefore(startsAtDate, registrationCutoff);

              const crossDayLabel = getCrossDayLabel(startsAtDate, endsAtDate);

              return (
                <div
                  key={slotIndex}
                  className={`rounded-xl border p-4 ${
                    isFull || isRegistrationClosed ? "bg-muted" : "bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-lg font-bold ${
                          isFull || isRegistrationClosed ? "text-muted-foreground/50" : ""
                        }`}
                      >
                        {formatTimeRange(slot.startsAt, slot.endsAt)}
                        {crossDayLabel && (
                          <span className={`text-sm text-caption ${isFull || isRegistrationClosed ? "text-muted-foreground/50" : ""}`}>（{crossDayLabel}）</span>
                        )}
                      </p>
                      {category === GqlOpportunityCategory.Activity && (
                        <p
                          className={`text-md font-bold ${
                            isFull || !isFeeSpecified || isRegistrationClosed
                              ? "text-muted-foreground/50"
                              : ""
                          }`}
                        >
                          {isFeeSpecified ? `${slot.feeRequired!.toLocaleString()}円/人` : "料金未定"}
                        </p>
                      )}
                      {category === GqlOpportunityCategory.Quest && (
                      <div className="flex items-center gap-1 pt-1">
                          <p className={`${isFull || isRegistrationClosed ? "bg-ring" : "bg-primary"} text-[11px] rounded-full w-4 h-4 flex items-center justify-center font-bold text-white leading-none`}>
                            P
                          </p>
                          <p className={`${isFull || isRegistrationClosed ? "text-caption" : ""}`}>
                            <span className="font-bold text-body-md">{pointsToEarn.toLocaleString()}pt</span>
                            <span className="text-sm font-sm">もらえる</span>
                          </p>
                      </div>
                      )}
                    </div>

                    {isFull ? (
                      <div className="text-muted-foreground/50 bg-muted px-8 py-3 rounded-full">
                        満員
                      </div>
                    ) : isRegistrationClosed ? (
                      <div className="text-muted-foreground/50 bg-muted px-8 py-3 rounded-full">
                        受付終了
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        {remainingCapacity <= 10 && remainingCapacity > 0 && (
                          <span className="text-xs text-primary">
                            定員まで残り{remainingCapacity}名
                          </span>
                        )}
                        <Button
                          variant="primary"
                          className="rounded-full px-8 py-3"
                          onClick={handleSelectSlot(slot)}
                          disabled={!isAvailable}
                        >
                          選択
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeSlotList;
