"use client";

import { useCallback, useState } from "react";
import GuestSelectionForm from "@/app/(authed)/reservation/select-date/components/GuestSelectionForm";
import SelectionSheet from "@/app/(authed)/reservation/select-date/components/SelectionSheet";

interface GuestCounterSelectorProps {
  value: number;
  onChange: (newValue: number) => void;
}

const GuestCounterSelector: React.FC<GuestCounterSelectorProps> = ({ value, onChange }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpen = useCallback(() => setIsSheetOpen(true), []);
  const handleClose = useCallback(() => setIsSheetOpen(false), []);

  return (
    <>
      <div className="px-6 py-6">
        <h2 className="text-display-sm mb-3">参加人数</h2>
        <GuestSelectionForm selectedGuests={value} onOpenGuestForm={handleOpen} />
        <SelectionSheet
          isOpen={isSheetOpen}
          onClose={handleClose}
          activeForm="guests"
          selectedDate={null}
          setSelectedDate={() => {}}
          selectedGuests={value}
          setSelectedGuests={onChange}
          dateSections={[]} // ゲストのみ使うので空でOK
        />
      </div>
    </>
  );
};

export default GuestCounterSelector;
