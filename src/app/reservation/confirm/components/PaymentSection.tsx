import React, { memo, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface PaymentSectionProps {
  ticketCount: number;
  onIncrement: () => void;
  onDecrement: () => void;
  maxTickets: number;
  pricePerPerson: number | null;
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

    const maxUsableTickets = Math.min(participantCount, maxTickets);

    return (
      <div className="rounded-lg px-6 py-6">
        <h3 className="text-display-sm mb-4">お支払い</h3>
        <div className="rounded-2xl border border-input p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-start gap-4">
              <Switch
                checked={useTickets}
                onCheckedChange={toggleUseTickets}
                disabled={maxTickets === 0}
              />
              <div className="flex flex-col gap-y-1">
                <span className="text-label-md">チケットを利用する</span>
                <p className="text-body-sm text-caption">保有しているチケット: {maxTickets}枚</p>
              </div>
            </div>
          </div>

          {useTickets && (
            <div className="flex items-center justify-center mt-4">
              <Button
                onClick={onDecrement}
                variant="tertiary"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={ticketCount <= 1}
              >
                -
              </Button>
              <span className="text-xl font-medium w-8 text-center mx-4">{ticketCount}</span>
              <Button
                onClick={onIncrement}
                variant="tertiary"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={ticketCount >= maxUsableTickets}
              >
                +
              </Button>
            </div>
          )}
        </div>

        <div className="mb-3 flex justify-between items-center">
          <h4 className="text-display-sm font-bold">当日のお支払い</h4>
          <span
            className={`text-body-lg font-bold ${
              pricePerPerson == null ? "text-muted-foreground/50" : ""
            }`}
          >
            {pricePerPerson != null
              ? `${(
                  pricePerPerson *
                  (participantCount - (useTickets ? ticketCount : 0))
                ).toLocaleString()}円`
              : "料金未定"}
          </span>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex justify-between text-body-sm text-muted-foreground">
              <span>通常申し込み</span>
              <div>
                {pricePerPerson != null ? (
                  <>
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
                  </>
                ) : (
                  <span>料金未定</span>
                )}
              </div>
            </div>

            {useTickets && (
              <div className="flex justify-between text-body-sm text-muted-foreground">
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
