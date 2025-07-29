import React, { memo } from "react";

interface PaymentSummaryProps {
  pricePerPerson: number | null;
  participantCount: number;
  useTickets: boolean;
  ticketCount: number;
  usePoints: boolean;
  pointCount: number;
  pointsRequired: number | null;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = memo(
  ({ pricePerPerson, participantCount, useTickets, ticketCount, usePoints, pointCount, pointsRequired }) => {
    const totalAmount = pricePerPerson != null ? pricePerPerson * (participantCount - ticketCount - pointCount) : null;
    const summaryAmount = totalAmount != null ? totalAmount : null;
    return (
      <>
        <div className="mb-[6px] flex justify-between items-center">
          <h4 className="text-display-sm font-bold">合計金額</h4>
          <span
            className={`text-body-lg font-bold ${
              pricePerPerson == null ? "text-muted-foreground/50" : ""
            }`}
          >
            {totalAmount != null ? `${summaryAmount?.toLocaleString()}円` : "料金未定"}
          </span>
        </div>
        <p className="text-body-sm text-caption mb-4">料金は現地でお支払いください。</p>

        <div className="bg-muted rounded-lg p-4">
          <div className="space-y-2">
            <h2 className="text-body-sm text-caption font-bold">内訳</h2>
            
            {/* 通常申し込み */}
            <div className="flex justify-between text-body-sm text-muted-foreground border-b border-foreground-caption pb-2">
              <span>通常申し込み</span>
              <div>
                {pricePerPerson != null ? (
                  <>
                    <span>{pricePerPerson.toLocaleString()}円</span>
                    <span className="mx-2">×</span>
                    <span>{participantCount - ticketCount - pointCount}名</span>
                    <span className="mx-2">=</span>
                    <span className="font-bold">{totalAmount?.toLocaleString()}円</span>
                  </>
                ) : (
                  <span>料金未定</span>
                )}
              </div>
            </div>

            {/* ポイント利用 */}
            {usePoints && pointCount > 0 ? (
              <div className="flex justify-between text-body-sm text-muted-foreground">
                <span>ポイント利用</span>
                <div>
                  <span>{pointsRequired?.toLocaleString()}pt</span>
                  <span className="mx-2">×</span>
                  <span>{pointCount}名</span>
                  <span className="mx-2">=</span>
                  <span className="font-bold">{((pointsRequired ?? 0) * pointCount).toLocaleString()}pt</span>
                </div>
              </div>
            ) : null }

            {/* チケット利用 */}
            {useTickets && ticketCount > 0 ? (
              <div className="flex justify-between text-body-sm text-muted-foreground">
                <span>チケット利用</span>
                <span>{ticketCount}名分</span>
              </div>
            ) : null }
          </div>
        </div>
      </>
    );
  },
);

PaymentSummary.displayName = "PaymentSummary";