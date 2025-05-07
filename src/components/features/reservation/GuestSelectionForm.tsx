import React from 'react';
import { User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestSelectionFormProps {
  selectedGuests: number;
  onOpenGuestForm: () => void;
}

/**
 * Component for selecting number of guests
 */
export const GuestSelectionForm: React.FC<GuestSelectionFormProps> = ({
  selectedGuests,
  onOpenGuestForm
}) => {
  return (
    <Button
      onClick={onOpenGuestForm}
      variant="tertiary"
      className="w-full bg-background rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <User className="h-6 w-6 text-muted-foreground" />
        <span
          className={`text-base ${selectedGuests > 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}
        >
          人数
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-base">{selectedGuests}人</span>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </Button>
  );
};

export default GuestSelectionForm;
