import { useSelection } from "../../context/SelectionContext";
import { useReservationDateLoader } from "../../hooks/useOpportunitySlotQuery";
import React, { useMemo } from "react";
import TimeSlotList from "./TimeSlotList";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { STEPS } from "../CredentialIssuanceWizard";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

const STEP_NUMBERS = {
  CURRENT: 2,
  TOTAL: 3,
} as const;

export default function TimeSlotSelector({ setStep }: { setStep: (step: number) => void }) {
  const { selectedSlot, setSelectedSlot } = useSelection();
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: "証明書発行",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { groupedSlots, loading } = useReservationDateLoader({
    opportunityIds: selectedSlot?.opportunityId ? [selectedSlot?.opportunityId] : [],
  });
  const now = new Date();
  const currentSections = groupedSlots
    .filter((section) => section.opportunityId === selectedSlot?.opportunityId)
    .map((section) => ({
      ...section,
      slots: section.slots.filter((slot) => new Date(slot.startsAt) <= now),
    }))
    .filter((section) => section.slots.length > 0);
  const selectedSlotId = selectedSlot?.slotId ?? null;

  const handleDateSelect = (slotId: string) => {
    setSelectedSlot({ opportunityId: selectedSlot?.opportunityId!, slotId, userIds: [] });
  };

  const canProceed = !!selectedSlotId;

  const handleNext = () => {
    setStep(STEPS.SELECT_CREDENTIAL_RECIPIENT);
  };

  if (loading) return <LoadingIndicator fullScreen={true} />;

  return (
    <div>
      <div className="flex items-end gap-2 mb-6">
        <h1 className="text-2xl font-bold">開催日を選ぶ</h1>
        <p className="ml-1 flex mb-1 items-baseline text-caption text-base">
          <span className="mr-1">(</span>
          <span className="text-xl font-bold">{STEP_NUMBERS.CURRENT}</span>
          /{STEP_NUMBERS.TOTAL}
          <span className="ml-1">)</span>
        </p>
      </div>
      <TimeSlotList
        dateSections={currentSections}
        selectedDate={selectedSlotId}
        onSelectDate={handleDateSelect}
        onNext={canProceed ? handleNext : undefined}
        onCancel={() => router.push("/admin/credentials")}
      />
    </div>
  );
}
