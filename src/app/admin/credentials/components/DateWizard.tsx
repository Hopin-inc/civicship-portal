import { useSelection } from "../context/SelectionContext";
import { useRouter } from "next/navigation";
import TimeSlotList from "./TimeSlotList";
import { useReservationDateLoader } from "../hooks/useOpportunitySlotQuery";
import React, { useState } from "react";

export default function DateWizard({ setStep }: { setStep: (step: number) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedTicketIds, selectedSlots, setSelectedSlots } = useSelection();
  const router = useRouter();

  const currentId = selectedTicketIds[currentIndex];
  const { groupedSlots } = useReservationDateLoader({ opportunityIds: selectedTicketIds });
  const currentSections = groupedSlots.filter(section => section.opportunityId === currentId);
  const selectedSlot = selectedSlots.find(item => item.opportunityId === currentId);
  const selectedSlotId = selectedSlot ? selectedSlot.slotId : null;

  const handleDateSelect = (slotId: string) => {
    setSelectedSlots(prev => {
      const filtered = prev.filter(item => item.opportunityId !== currentId);
      return [...filtered, { opportunityId: currentId, slotId, userIds: [] }];
    });
  };

  const canProceed = !!selectedSlotId;

  const handleNext = () => {
    if (currentIndex < selectedTicketIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStep(3);
    }
  };

  const handleCancel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      router.push("/admin/credentials");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">
        開催日を選ぶ（{currentIndex + 1}/{selectedTicketIds.length}）
      </h1>
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