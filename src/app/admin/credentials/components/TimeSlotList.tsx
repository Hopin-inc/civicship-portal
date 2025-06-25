import React from "react";
import { formatSlotRange } from "@/utils/date";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivitySlotGroup } from "../types/opportunitySlot";

interface TimeSlotListProps {
  dateSections: ActivitySlotGroup[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onNext?: () => void;
  onCancel?: () => void;
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  dateSections,
  selectedDate,
  onSelectDate,
  onNext,
  onCancel,
}) => {

const handleSelectSlot = (id: string) => {
    onSelectDate(id);
};

return (
    <div className="space-y-3">
      {dateSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <div className="space-y-3">
            {section.slots.map((slot: any, slotIndex: any) => {
              const isSelected = selectedDate === slot.id;
              return (
                <Card
                  key={slotIndex}
                  onClick={() => handleSelectSlot(slot.id)}
                  className={`flex items-center gap-3 rounded-xl border transition-colors px-4 py-3 cursor-pointer ${
                    isSelected
                      ? "border-primary ring-[1px] ring-primary bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="timeslot"
                    checked={isSelected}
                    onChange={() => handleSelectSlot(slot.id)}
                    className="mr-3 w-5 h-5 accent-blue-600"
                    tabIndex={-1}
                    readOnly
                  />
                  <p className="text-base font-medium">{formatSlotRange(slot.startsAt, slot.endsAt)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-between px-6 py-4 z-10">
        <Button
          variant="text"
          className="text-gray-500 font-bold"
          onClick={onCancel}
        >
          キャンセル
        </Button>
        <Button
          className={`rounded-full px-8 py-2 font-bold text-white ${selectedDate ? "bg-primary" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          disabled={!selectedDate}
          onClick={onNext}
        >
          次へ
        </Button>
      </div>
    </div>
  );
};

export default TimeSlotList;
