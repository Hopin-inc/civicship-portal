

import React from 'react';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';

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

/**
 * Component for payment options and ticket selection
 */
export const PaymentSection: React.FC<PaymentSectionProps> = ({
  ticketCount,
  onIncrement,
  onDecrement,
  maxTickets,
  pricePerPerson,
  participantCount,
  useTickets,
  setUseTickets
}) => {
  const handleUseTicketsChange = (value: boolean) => {
    if (maxTickets > 0) {
      setUseTickets(value);
    }
  };

  return (
    <div className="rounded-lg p-4 mb-6">
      <h3 className="text-2xl font-bold mb-6">お支払い</h3>
      
      <div className="rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Switch 
              checked={useTickets} 
              onCheckedChange={handleUseTicketsChange}
              disabled={maxTickets === 0}
              className="scale-125 data-[state=checked]:bg-[#4361EE] data-[state=checked]:hover:bg-[#4361EE]"
            />
            <div className="flex flex-col">
              <span className="text-lg">チケットを利用する</span>
              <p className="text-gray-500">保有しているチケット: {maxTickets}枚</p>
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
        <span className="text-lg font-bold">{(pricePerPerson * (participantCount - (useTickets ? ticketCount : 0))).toLocaleString()}円</span>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex justify-between text-base text-gray-600">
            <span>通常申し込み</span>
            <div>
              <span>{pricePerPerson.toLocaleString()}円</span>
              <span className="mx-2">×</span>
              <span>{participantCount - (useTickets ? ticketCount : 0)}名</span>
              <span className="mx-2">=</span>
              <span>{(pricePerPerson * (participantCount - (useTickets ? ticketCount : 0))).toLocaleString()}円</span>
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
};

export default PaymentSection;
