import React, { memo, useCallback, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AvailableTicket } from "@/app/[communityId]/reservation/confirm/presenters/presentReservationConfirm";

interface TicketsToggleProps {
  useTickets: boolean;
  setUseTickets: (value: boolean) => void;
  maxTickets: number;
  availableTickets: AvailableTicket[];
  participantCount: number;
  onTicketCountChange: (count: number) => void;
  onSelectedTicketsChange?: (selectedTickets: { [ticketId: string]: number }) => void;
  selectedTicketCount: number;
  remainingSlots: number;
  allDisabled: boolean;
}

export const TicketsToggle: React.FC<TicketsToggleProps> = memo(
  ({ useTickets, setUseTickets, maxTickets, availableTickets, onTicketCountChange, onSelectedTicketsChange, remainingSlots, participantCount, allDisabled }) => {
    const [ticketCounts, setTicketCounts] = useState<{ [key: string]: number }>({});

    const toggleUseTickets = useCallback(() => {
      if (maxTickets > 0) {
        setUseTickets(!useTickets);
      }
    }, [maxTickets, setUseTickets, useTickets]);

    const handleIncrement = (ticketId: string) => {
      const ticket = availableTickets.find(t => t.id === ticketId);
      if (!ticket) return;
      
      const currentCount = ticketCounts[ticketId] || 0;
      
      // チケットの枚数制限とallDisabledの制限をチェック
      if (currentCount < ticket.count && !allDisabled) {
        setTicketCounts(prev => ({
          ...prev,
          [ticketId]: currentCount + 1
        }));
      }
    };

    const handleDecrement = (ticketId: string) => {
      setTicketCounts(prev => ({
        ...prev,
        [ticketId]: Math.max(0, (prev[ticketId] || 0) - 1)
      }));
    };

    const totalSelectedTickets = Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);

    // 選択されたチケット数が変更されたときに親コンポーネントに通知
    useEffect(() => {
      onTicketCountChange(totalSelectedTickets);
    }, [totalSelectedTickets, onTicketCountChange]);

    // 選択されたチケットの詳細情報を親コンポーネントに通知
    useEffect(() => {
      if (onSelectedTicketsChange) {
        onSelectedTicketsChange(ticketCounts);
      }
    }, [ticketCounts, onSelectedTicketsChange]);

    return (
      <div className="rounded-2xl border border-input bg-background mb-6 overflow-hidden">
        <div className={`flex items-center justify-between p-4 ${useTickets ? "bg-blue-50" : ""}`}>
          <div className="flex items-start gap-4">
            <Switch
              checked={useTickets}
              onCheckedChange={toggleUseTickets}
              disabled={maxTickets === 0}
            />
            <div className="flex flex-col gap-y-1">
              <span className="text-label-md">チケットを利用する</span>
              <p className="text-body-sm text-caption">利用可能なチケット: {maxTickets}枚</p>
            </div>
          </div>
        </div>

        {/* 下部セクション（ON時は表示） */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            useTickets ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 space-y-4 border-gray-200 bg-background text-foreground">
            {/* チケット詳細リスト */}
            <div className="space-y-3">
              {availableTickets.map((ticket, index) => {
                const currentCount = ticketCounts[ticket.id] || 0;
                const canIncrement = currentCount < ticket.count;
                const isLast = index === availableTickets.length - 1;
                
                return (
                  <div key={ticket.id} className={`p-3 bg-white ${!isLast ? 'border-b border-gray-200' : ''}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">
                          {ticket.utility?.name || "無名のチケット"}
                        </p>
                        {ticket.utility?.owner && (
                          <p className="text-xs text-gray-600 mt-1">
                            {ticket.utility.owner.name}さんが発行
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          onClick={() => handleDecrement(ticket.id)}
                          variant="tertiary"
                          size="sm"
                          className="h-6 w-6 rounded-full p-0"
                          disabled={!ticketCounts[ticket.id] || ticketCounts[ticket.id] <= 0}
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">
                          {currentCount}
                        </span>
                        <Button
                          onClick={() => handleIncrement(ticket.id)}
                          variant="tertiary"
                          size="sm"
                          className="h-6 w-6 rounded-full p-0"
                          disabled={!canIncrement || allDisabled}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TicketsToggle.displayName = "TicketsToggle";
