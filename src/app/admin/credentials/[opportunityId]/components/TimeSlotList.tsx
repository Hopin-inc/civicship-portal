import React from "react";
import { Button } from "@/components/ui/button";
import { ActivitySlot, ActivitySlotGroup } from "@/app/reservation/data/type/opportunitySlot";
import { formatTimeRange } from "@/utils/date";
import { useSelection } from "../../context/SelectionContext";
import { useParams, useRouter } from "next/navigation";
import { SectionHeader } from "./SectionHeader";

interface TimeSlotListProps {
  dateSections: ActivitySlotGroup[];
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  dateSections,
}) => {
const { opportunityId } = useParams();
const { setSelectedDate } = useSelection();
const router = useRouter();

const handleSelectSlot = (slot: ActivitySlot) => {
    setSelectedDate(slot.id);
    router.push(`/admin/credentials/${opportunityId}/users`);
};

return (
    <div className="space-y-8">
      {dateSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <SectionHeader label={section.dateLabel} />
          <div className="space-y-2">
            {section.slots.map((slot, slotIndex) => {
              const remainingCapacity = slot.remainingCapacity || 0;
              const isFeeSpecified = slot.feeRequired != null;

              return (
                <div
                  key={slotIndex}
                  className={`rounded-xl border p-4 bg-background`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-lg font-bold`}
                      >
                        {formatTimeRange(slot.startsAt, slot.endsAt)}
                      </p>
                      <p
                        className={`text-md font-bold`}
                      >
                        {isFeeSpecified ? `${slot.feeRequired!.toLocaleString()}円/人` : "料金未定"}
                      </p>
                    </div>
                      <div className="flex flex-col items-end gap-1">
                        {remainingCapacity <= 10 && remainingCapacity > 0 && (
                          <span className="text-xs text-primary">
                            定員まで残り{remainingCapacity}名
                          </span>
                        )}
                        <Button
                          variant="primary"
                          className="rounded-full px-8 py-3"
                          onClick={() => handleSelectSlot(slot)}
                        >
                          選択
                        </Button>
                      </div>
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
