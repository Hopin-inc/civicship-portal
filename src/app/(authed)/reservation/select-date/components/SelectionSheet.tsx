import React, { useCallback } from "react";
import { Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ActivitySlotGroup } from "@/app/(authed)/reservation/data/type/opportunitySlot";

interface SelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeForm: "date" | "guests" | null;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedGuests: number;
  setSelectedGuests: (guests: number) => void;
  dateSections: ActivitySlotGroup[];
}

/**
 * Sheet component for date and guest selection
 */
const SelectionSheet: React.FC<SelectionSheetProps> = ({
  isOpen,
  onClose,
  activeForm,
  selectedDate,
  setSelectedDate,
  selectedGuests,
  setSelectedGuests,
  dateSections,
}) => {
  const handleClearSelection = useCallback(() => {
    if (activeForm === "date") {
      setSelectedDate(null);
    } else {
      setSelectedGuests(1);
    }
  }, [activeForm, setSelectedDate, setSelectedGuests]);

  const handleSelectDate = useCallback(
    (dateLabel: string) => () => {
      setSelectedDate(dateLabel);
      setTimeout(() => {
        onClose();
      }, 0);
    },
    [setSelectedDate, onClose],
  );

  const handleDecreaseGuests = useCallback(
    () => setSelectedGuests(Math.max(1, selectedGuests - 1)),
    [selectedGuests, setSelectedGuests],
  );

  const handleIncreaseGuests = useCallback(
    () => setSelectedGuests(selectedGuests + 1),
    [selectedGuests, setSelectedGuests],
  );

  const handleSheetOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose();
    },
    [onClose],
  );

  if (!activeForm) return null;

  const renderFooterButtons = () => (
    <div className="bg-background max-w-mobile-l w-full h-16 flex items-center justify-between mx-auto pt-3">
      <Button
        onClick={handleClearSelection}
        variant="link"
        className="text-label-md px-0 underline !text-foreground"
      >
        選択を解除
      </Button>
      <Button onClick={onClose} variant="primary" className="px-8 py-3">
        決定
      </Button>
    </div>
  );

  const renderDateSelection = () => (
    <div className="flex-1 overflow-auto h-auto pb-0 mb-0">
      <div className="flex flex-wrap gap-x-2 gap-y-2 mb-2">
        {dateSections.map((section, index) => (
          <Button
            key={index}
            onClick={handleSelectDate(`${section.dateLabel}`)}
            variant={selectedDate === `${section.dateLabel}` ? "primary" : "tertiary"}
          >
            {section.dateLabel}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderGuestSelection = () => (
    <div className="flex items-center justify-center space-x-8 py-4">
      <Button onClick={handleDecreaseGuests} variant="tertiary" size="icon" className="p-2">
        <Minus className="h-6 w-6 text-muted-foreground" />
      </Button>
      <span className="text-2xl font-medium w-8 text-center">{selectedGuests}</span>
      <Button onClick={handleIncreaseGuests} variant="tertiary" size="icon" className="p-2">
        <Plus className="h-6 w-6 text-gray-400" />
      </Button>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl overflow-auto max-w-md mx-auto pt-2 px-6"
        onPointerDownOutside={onClose}
      >
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
        </div>
        <div className="h-full flex flex-col">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>{activeForm === "date" ? "日付を選択" : "人数を選択"}</SheetTitle>
          </SheetHeader>

          {activeForm === "date" ? renderDateSelection() : renderGuestSelection()}

          {renderFooterButtons()}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SelectionSheet;
