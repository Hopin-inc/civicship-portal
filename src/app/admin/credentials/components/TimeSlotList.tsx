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
    <div className="space-y-8">
      {dateSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <div className="space-y-2">
            {section.slots.map((slot: any, slotIndex: any) => {
              return (
                <Card
                  key={slotIndex}
                  className={`transition-colors p-4 flex items-center gap-2 ${selectedDate === slot.id ? "border-primary" : ""}`}
                >
                  <input
                    type="radio"
                    name={`timeslot-${sectionIndex}`}
                    checked={selectedDate === slot.id}
                    onChange={() => handleSelectSlot(slot.id)}
                    className="mr-2 cursor-pointer"
                  />
                  <p className="text-body-md font-medium mt-2">{formatSlotRange(slot.startsAt, slot.endsAt)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-between px-6 py-4 z-10">
        <Button
          variant="secondary"
          className="text-gray-500 font-bold"
          onClick={() => {
            onCancel?.();
          }}
        >
          キャンセル
        </Button>
        <Button
          className={`rounded-full px-8 py-2 font-bold text-white ${selectedDate ? "bg-primary" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          disabled={!selectedDate}
          onClick={() => {
            onNext?.();
          }}
        >
          次へ
        </Button>
      </div>
    </div>
  );
};

export default TimeSlotList;
