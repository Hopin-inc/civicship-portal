import { useSelection } from "../context/SelectionContext";
import { useRouter } from "next/navigation";
import TimeSlotList from "./TimeSlotList";
import { useReservationDateLoader } from "../hooks/useOpportunitySlotQuery";
import React from "react";

export default function DateWizard({ setStep }: { setStep: (step: number) => void }) {
  const { selectedTicketId, selectedSlot, setSelectedSlot } = useSelection();
  const router = useRouter();

  const { groupedSlots } = useReservationDateLoader({ opportunityIds: selectedSlot?.opportunityId ? [selectedSlot?.opportunityId] : [] });
  const currentSections = groupedSlots.filter(section => section.opportunityId === selectedSlot?.opportunityId);
  const selectedSlotId = selectedSlot?.slotId ?? null;
  
  const handleDateSelect = (slotId: string) => {
    setSelectedSlot({ opportunityId: selectedSlot?.opportunityId!, slotId, userIds: [] });
  };

  const canProceed = !!selectedSlotId;

  const handleNext = () => {
    setStep(3);
  };

  const handleCancel = () => {
    router.push("/admin/credentials");
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