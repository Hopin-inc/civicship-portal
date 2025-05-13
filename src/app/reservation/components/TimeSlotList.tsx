import React from "react";
import { Button } from "@/components/ui/button";
import { ActivitySlot, ActivitySlotGroup } from "@/app/reservation/data/type/opportunitySlot";
import { formatTimeRange } from "@/utils/date";

interface TimeSlotListProps {
  dateSections: ActivitySlotGroup[];
  isSlotAvailable: (slot: ActivitySlot) => boolean;
  onSelectSlot: (slot: ActivitySlot) => void;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({
  dateSections,
  isSlotAvailable,
  onSelectSlot,
}) => {
  return (
    <div className="space-y-8">
      {dateSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3 className="text-lg font-bold mb-4">{section.dateLabel}</h3>
          <div className="space-y-2">
            {section.slots.map((slot: ActivitySlot, slotIndex: number) => {
              const remainingCapacity = slot.remainingCapacity || 0;
              const isFull = remainingCapacity === 0;
              const isAvailable = isSlotAvailable(slot);

              return (
                <div
                  key={slotIndex}
                  className={`rounded-xl border p-4 ${isFull ? "bg-muted" : "bg-background"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-lg font-bold ${isFull ? "text-muted-foreground/50" : ""}`}
                      >
                        {formatTimeRange(slot.startsAt, slot.endsAt)}
                      </p>
                      <p
                        className={`text-md font-bold ${isFull ? "text-muted-foreground/50" : ""}`}
                      >
                        {slot.feeRequired?.toLocaleString()}円/人
                      </p>
                    </div>
                    {isFull ? (
                      <div className="text-muted-foreground/50 bg-muted px-8 py-3 rounded-full">
                        満員
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        {remainingCapacity <= 3 && remainingCapacity > 0 && (
                          <span className="text-xs text-primary">
                            定員まで残り{remainingCapacity}名
                          </span>
                        )}
                        <Button
                          variant="primary"
                          className="rounded-full px-8 py-3"
                          onClick={() => onSelectSlot(slot)}
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
