import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ActivitySlot,
  ActivitySlotGroup,
  IOpportunitySlot,
  QuestSlot,
} from "@/app/reservation/data/type/opportunitySlot";
import { formatTimeRange } from "@/utils/date";
import { addDays, isBefore } from "date-fns";
import { GqlOpportunityCategory } from "@/types/graphql";

interface TimeSlotListProps {
  category: GqlOpportunityCategory;
  dateSections: ActivitySlotGroup[];
  isSlotAvailable: (slot: IOpportunitySlot) => boolean;
  onSelectSlot: (slot: IOpportunitySlot) => void;
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
  category,
  dateSections,
  isSlotAvailable,
  onSelectSlot,
}) => {
  const handleSelectSlot = useCallback(
    (slot: IOpportunitySlot) => () => onSelectSlot(slot),
    [onSelectSlot],
  );

  const registrationCutoff = addDays(new Date(), 7);
  const isActivity = category === GqlOpportunityCategory.Activity;
  const isQuest = category === GqlOpportunityCategory.Quest;

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
              const startsAtDate = new Date(slot.startsAt);
              const isRegistrationClosed = isBefore(startsAtDate, registrationCutoff);

              let detailText = "";
              let isDetailMuted = false;

              if (isActivity) {
                const activitySlot = slot as ActivitySlot;
                const isSpecified = activitySlot.feeRequired != null;
                detailText = isSpecified
                  ? `${activitySlot.feeRequired?.toLocaleString()}円/人`
                  : "料金未定";
                isDetailMuted = isFull || isRegistrationClosed || !isSpecified;
              } else if (isQuest) {
                const questSlot = slot as QuestSlot;
                const isSpecified = questSlot.pointsToEarn != null;
                detailText = isSpecified
                  ? `+${questSlot.pointsToEarn?.toLocaleString()}pt`
                  : "獲得pt未定";
                isDetailMuted = isFull || isRegistrationClosed || !isSpecified;
              }

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
                      </p>
                      <p
                        className={`text-md font-bold ${
                          isDetailMuted ? "text-muted-foreground/50" : ""
                        }`}
                      >
                        {detailText}
                      </p>
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
