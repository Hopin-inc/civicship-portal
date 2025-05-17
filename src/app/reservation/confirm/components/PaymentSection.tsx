import React, { useCallback, memo } from "react";
import { Button } from "@/components/ui/button";

interface PaymentSectionProps {
  ticketCount: number;
  onIncrement: () => void;
  onDecrement: () => void;
  maxTickets: number;
  pricePerPerson: number;
  participantCount: number;
  useTickets: boolean;
  setUseTickets: (value: boolean) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = memo(
  ({
    ticketCount,
    onIncrement,
    onDecrement,
    maxTickets,
    pricePerPerson,
    participantCount,
    useTickets,
    setUseTickets,
  }) => {
    const toggleUseTickets = useCallback(() => {
      if (maxTickets > 0) {
        setUseTickets(!useTickets);
      }
    }, [maxTickets, setUseTickets, useTickets]);

    return (
      <div className="rounded-lg p-4 mb-6">
        <h3 className="text-2xl font-bold mb-6">お支払い</h3>

        <div className="rounded-2xl border border-input p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              {/* Replace Switch with a simple button */}
              <Button
                onClick={toggleUseTickets}
                variant={useTickets ? "primary" : "tertiary"}
                disabled={maxTickets === 0}
                className="min-w-[24px] h-[24px] p-0 rounded-full"
              >
                {useTickets ? "✓" : " "}
              </Button>
              <div className="flex flex-col">
                <span className="text-lg">チケットを利用する</span>
                <p className="text-muted-foreground">保有しているチケット: {maxTickets}枚</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-center gap-8">
              <Button
                onClick={onDecrement}
                variant="secondary"
                size="icon"
                className="w-12 h-12 rounded-full text-2xl"
                disabled={!useTickets || ticketCount <= 1}
              >
                -
              </Button>
              <span className="text-2xl font-medium w-8 text-center">{ticketCount}</span>
              <Button
                onClick={onIncrement}
                variant="secondary"
                size="icon"
                className="w-12 h-12 rounded-full text-2xl"
                disabled={!useTickets || ticketCount >= maxTickets}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-3 flex justify-between items-center">
          <h4 className="text-lg font-bold">当日のお支払い</h4>
          <span className="text-lg font-bold">
            {(
              pricePerPerson *
              (participantCount - (useTickets ? ticketCount : 0))
            ).toLocaleString()}
            円
          </span>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex justify-between text-base text-muted-foreground">
              <span>通常申し込み</span>
              <div>
                <span>{pricePerPerson.toLocaleString()}円</span>
                <span className="mx-2">×</span>
                <span>{participantCount - (useTickets ? ticketCount : 0)}名</span>
                <span className="mx-2">=</span>
                <span>
                  {(
                    pricePerPerson *
                    (participantCount - (useTickets ? ticketCount : 0))
                  ).toLocaleString()}
                  円
                </span>
              </div>
            </div>
            {useTickets && (
              <div className="flex justify-between text-base text-gray-600">
                <span>チケット利用</span>
                <div>
                  <span>0円</span>
                  <span className="mx-2">×</span>
                  <span>{ticketCount}名</span>
                  <span className="mx-2">=</span>
                  <span>0円</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

PaymentSection.displayName = "PaymentSection";

export default PaymentSection;
