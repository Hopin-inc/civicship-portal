import React from 'react';
import { Button } from '@/components/ui/button';

interface TicketDetailActionProps {
  onFindRelatedOpportunities: () => void;
  isLoading?: boolean;
}

/**
 * Action button component for the ticket detail page
 */
export const TicketDetailAction: React.FC<TicketDetailActionProps> = ({
  onFindRelatedOpportunities,
  isLoading = false
}) => {
  return (
    <Button 
      onClick={onFindRelatedOpportunities}
      disabled={isLoading}
    >
      {isLoading ? "読み込み中..." : "関わりを見つける"}
    </Button>
  );
};

export default TicketDetailAction;
