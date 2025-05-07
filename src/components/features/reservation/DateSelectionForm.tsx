
import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import type { DateSection } from '@/hooks/features/reservation/useReservationDateSelection';
import { Button } from '@/components/ui/button';

interface DateSelectionFormProps {
  selectedDate: string | null;
  onOpenDateForm: () => void;
}

/**
 * Component for selecting a date
 */
export const DateSelectionForm: React.FC<DateSelectionFormProps> = ({
  selectedDate,
  onOpenDateForm
}) => {
  return (
    <Button
      onClick={onOpenDateForm}
      variant="tertiary"
      className="w-full bg-background rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <Calendar className="h-6 w-6 text-muted-foreground" />
        <span
          className={`text-base ${selectedDate ? "text-foreground font-medium" : "text-muted-foreground"}`}
        >
          日付
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-base">{selectedDate || "日付を選択"}</span>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </Button>
  );
};

export default DateSelectionForm;
