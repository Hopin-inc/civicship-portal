
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { DateSection } from '@/hooks/features/reservation/useReservationDateSelection';

interface SelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeForm: 'date' | 'guests' | null;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedGuests: number;
  setSelectedGuests: (guests: number) => void;
  dateSections: DateSection[];
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

  const handleClearSelection = () => {
    if (activeForm === 'date') {
      setSelectedDate(null);
    } else {
      setSelectedGuests(1);
    }
  };

  const renderFooterButtons = () => (
    <div className="max-w-md mx-auto fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
      <div className="flex justify-between items-center">
        <button
          onClick={handleClearSelection}
          className="text-gray-500 text-sm"
        >
          選択を解除
        </button>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl"
        >
          決定
        </button>
      </div>
    </div>
  );

  const renderDateSelection = () => (
    <div className="flex-1 overflow-auto pb-24">
      <div className="space-y-2">
        {dateSections.map((section, index) => (
          <button
            key={index}
            onClick={() => setSelectedDate(`${section.date} (${section.day})`)}
            className={`w-full text-left p-4 rounded-lg border ${
              selectedDate === `${section.date} (${section.day})`
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-gray-200 text-gray-900"
            }`}
          >
            {section.date} ({section.day})
          </button>
        ))}
      </div>
    </div>
  );

  const renderGuestSelection = () => (
    <div className="flex items-center justify-center space-x-8 py-4">
      <button
        onClick={() => setSelectedGuests(Math.max(1, selectedGuests - 1))}
        className="rounded-full border border-gray-200 p-2 hover:bg-gray-50"
      >
        <Minus className="h-6 w-6 text-gray-400" />
      </button>
      <span className="text-2xl font-medium w-8 text-center">{selectedGuests}</span>
      <button
        onClick={() => setSelectedGuests(selectedGuests + 1)}
        className="rounded-full border border-gray-200 p-2 hover:bg-gray-50"
      >
        <Plus className="h-6 w-6 text-gray-400" />
      </button>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
