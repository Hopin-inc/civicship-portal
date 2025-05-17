import React, { useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ActivitySlotGroup } from "@/app/reservation/data/type/opportunitySlot";

interface SelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeForm: 'date' | 'guests' | null;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedGuests: number;
  setSelectedGuests: (guests: number) => void;
  dateSections: ActivitySlotGroup[];
}

/**
 * Sheet component for date and guest selection
 */
export const SelectionSheet: React.FC<SelectionSheetProps> = ({
  isOpen,
  onClose,
  activeForm,
  selectedDate,
  setSelectedDate,
  selectedGuests,
  setSelectedGuests,
  dateSections
}) => {
  if (!activeForm) return null;

  const handleClearSelection = useCallback(() => {
    if (activeForm === 'date') {
      setSelectedDate(null);
    } else {
      setSelectedGuests(1);
    }
  }, [activeForm, setSelectedDate, setSelectedGuests]);

  const handleSelectDate = useCallback(
    (dateLabel: string) => () => setSelectedDate(dateLabel),
    [setSelectedDate]
  );

  const handleDecreaseGuests = useCallback(
    () => setSelectedGuests(Math.max(1, selectedGuests - 1)),
    [selectedGuests, setSelectedGuests]
  );

  const handleIncreaseGuests = useCallback(
    () => setSelectedGuests(selectedGuests + 1),
    [selectedGuests, setSelectedGuests]
  );

  const handleSheetOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose();
    },
    [onClose]
  );

  const renderFooterButtons = () => (
    <div className="max-w-md mx-auto fixed bottom-0 left-0 right-0 bg-background p-4 border-t">
      <div className="flex justify-between items-center">
        <Button
          onClick={handleClearSelection}
          variant="link"
        >
          選択を解除
        </Button>
        <Button
          onClick={onClose}
          variant="primary"
        >
          決定
        </Button>
      </div>
    </div>
  );

  const renderDateSelection = () => (
    <div className="flex-1 overflow-auto pb-24">
      <div className="space-y-2">
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
      <Button
        onClick={handleDecreaseGuests}
        variant="tertiary"
        size="icon"
        className="p-2"
      >
        <Minus className="h-6 w-6 text-muted-foreground" />
      </Button>
      <span className="text-2xl font-medium w-8 text-center">{selectedGuests}</span>
      <Button
        onClick={handleIncreaseGuests}
        variant="tertiary"
        size="icon"
        className="p-2"
      >
        <Plus className="h-6 w-6 text-gray-400" />
      </Button>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[300px] rounded-t-3xl overflow-hidden max-w-md mx-auto"
        onPointerDownOutside={onClose}
      >
        <div className="h-full flex flex-col">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>
              <div className="flex items-center">
                <span className="text-lg font-bold">
                  {activeForm === 'date' ? '日付を選択' : '人数を選択'}
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>
          
          {activeForm === 'date' ? renderDateSelection() : renderGuestSelection()}
          
          {renderFooterButtons()}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SelectionSheet;
