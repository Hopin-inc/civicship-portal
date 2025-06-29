import { useSelection } from "../../context/SelectionContext";
import { useReservationDateLoader } from "../../hooks/useOpportunitySlotQuery";
import React from "react";
import TimeSlotList from "./TimeSlotList";

export default function TimeSlotSelector({ setStep }: { setStep: (step: number) => void }) {
  const {selectedSlot, setSelectedSlot } = useSelection();

  const { groupedSlots } = useReservationDateLoader({ opportunityIds: selectedSlot?.opportunityId ? [selectedSlot?.opportunityId] : [] });
  const now = new Date();
  const currentSections = groupedSlots
    .filter(section => section.opportunityId === selectedSlot?.opportunityId)
    .map(section => ({
      ...section,
      slots: section.slots.filter(slot => new Date(slot.startsAt) <= now)
    }))
    .filter(section => section.slots.length > 0);
  const selectedSlotId = selectedSlot?.slotId ?? null;
  
  const handleDateSelect = (slotId: string) => {
    setSelectedSlot({ opportunityId: selectedSlot?.opportunityId!, slotId, userIds: [] });
  };

  const canProceed = !!selectedSlotId;

  const handleNext = () => {
    setStep(3);
  };

  const handleCancel = () => {
    setStep(1);
  };

  return (
    <div>
      <div className="flex items-end gap-2 mb-6">
        <h1 className="text-2xl font-bold">開催日を選ぶ</h1>
        <span className="ml-1 flex items-end">
          <span className="text-gray-400 text-base">(</span>
          <span className="text-lg font-bold text-[#71717A] mx-1">2</span>
          <span className="text-gray-400 text-base">/3</span>
          <span className="text-gray-400 text-base">)</span>
        </span>
      </div>
      <TimeSlotList
        dateSections={currentSections}
        selectedDate={selectedSlotId}
        onSelectDate={handleDateSelect}
        onNext={canProceed ? handleNext : undefined}
        onCancel={handleCancel}
      />
    </div>
  );
} 