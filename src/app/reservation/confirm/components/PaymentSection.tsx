import React, { memo, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TicketsToggle } from "./payment/TicketsToggle";
import { PaymentSummary } from "./PaymentSummary";
import { PointsToggle } from "./payment/PointsToggle";
import { AvailableTicket } from "@/app/tickets/hooks/useAvailableTickets";

interface PaymentSectionProps {
  ticketCount: number;
  onIncrement: () => void;
  onDecrement: () => void;
  maxTickets: number;
  availableTickets: AvailableTicket[];
  pricePerPerson: number | null;
  participantCount: number;
  useTickets: boolean;
  setUseTickets: (value: boolean) => void;
  usePoints: boolean;
  setUsePoints: (value: boolean) => void;
  userWallet: number | null;
  pointsRequired: number;
  onPointCountChange?: (count: number) => void;
  onTicketCountChange?: (count: number) => void;
  onSelectedTicketsChange?: (selectedTickets: { [ticketId: string]: number }) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = memo(
  ({
    maxTickets,
    participantCount,
    useTickets,
    setUseTickets,
    usePoints,
    setUsePoints,
    userWallet,
    pointsRequired,
    availableTickets,
    onPointCountChange,
    onTicketCountChange,
    onSelectedTicketsChange,
  }) => {
    const [selectedTicketCount, setSelectedTicketCount] = useState(0);
    const [selectedPointCount, setSelectedPointCount] = useState(0);
    const [allDisabled, setAllDisabled] = useState(false);

    const totalSelected = selectedTicketCount + selectedPointCount;
    const remainingSlots = Math.max(0, participantCount - totalSelected);

    useEffect(() => {
      const shouldBeDisabled = selectedTicketCount + selectedPointCount >= participantCount;
      
      if(shouldBeDisabled) {
        setAllDisabled(true);
      } else {
        setAllDisabled(false);
      }
    }, [selectedTicketCount, selectedPointCount, participantCount]);

    const handleTicketCountChange = useCallback((count: number) => {
      setSelectedTicketCount(count);
      if (onTicketCountChange) {
        onTicketCountChange(count);
      }
    }, [onTicketCountChange]);

    const handlePointCountChange = useCallback((count: number) => {
      setSelectedPointCount(count);
      if (onPointCountChange) {
        onPointCountChange(count);
      }
    }, [onPointCountChange]);

    const handleSelectedTicketsChange = useCallback((tickets: { [ticketId: string]: number }) => {
      if (onSelectedTicketsChange) {
        onSelectedTicketsChange(tickets);
      }
    }, [onSelectedTicketsChange]);
    const getTitle = () => {
      if (maxTickets > 0 && pointsRequired > 0) {
        return "ポイント・チケットを利用";
      } else if(pointsRequired > 0) {
        return "ポイントを利用";
      }else{
        return "チケットを利用";
      }
    }
    return (
      <div className="rounded-lg px-6">
        <h3 className="text-display-sm mb-4">{getTitle()}</h3>
        {maxTickets > 0 && (
          <TicketsToggle
            useTickets={useTickets}
            setUseTickets={setUseTickets}
            maxTickets={maxTickets}
            availableTickets={availableTickets}
            participantCount={participantCount}
            onTicketCountChange={handleTicketCountChange}
            selectedTicketCount={selectedTicketCount}
            remainingSlots={remainingSlots}
            allDisabled={allDisabled}
            onSelectedTicketsChange={handleSelectedTicketsChange}
          />
        )}
        {pointsRequired > 0 && (
          <PointsToggle
            usePoints={usePoints}
            setUsePoints={setUsePoints}
            maxPoints={userWallet ?? 0}
            participantCount={participantCount}
            pointsRequired={pointsRequired}
            onPointCountChange={handlePointCountChange}
            remainingSlots={remainingSlots}
            disabled={selectedTicketCount >= participantCount || !userWallet || userWallet < pointsRequired}
            allDisabled={allDisabled}
          />
        )}
      </div>
    );
  },
);

PaymentSection.displayName = "PaymentSection";

export default PaymentSection;
