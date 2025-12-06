import React, { memo } from "react";

interface PaymentSummaryProps {
  pricePerPerson: number | null;
  participantCount: number;
  usePoints: boolean;
  pointCount: number;
  pointsRequired: number | null;
  isPointsOnly?: boolean;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = memo(
  ({ pricePerPerson, participantCount, usePoints, pointCount, pointsRequired, isPointsOnly }) => {
    const totalAmount = pricePerPerson != null ? pricePerPerson * (participantCount - pointCount) : null;
    const summaryAmount = totalAmount != null ? totalAmount : null;
    const hasPaymentMethod = usePoints && pointCount > 0;
    const totalPointsRequired = (pointsRequired ?? 0) * participantCount;
    
    return (
      <>
        <div className="mb-[6px] flex justify-between items-center">
          <h4 className="text-display-sm font-bold">{isPointsOnly ? "必要ポイント" : "合計金額"}</h4>
          <span
            className={`text-body-lg font-bold ${
              pricePerPerson == null && !isPointsOnly ? "text-muted-foreground/50" : ""
            }`}
          >
            {isPointsOnly 
              ? `${totalPointsRequired.toLocaleString()}pt` 
              : (totalAmount != null ? `${summaryAmount?.toLocaleString()}円` : "料金未定")
            }
          </span>
        </div>
        {!isPointsOnly && <p className="text-body-sm text-caption mb-4">料金は現地でお支払いください。</p>}

        <div className="bg-muted rounded-lg p-4">
          <div className="space-y-2">
            <h2 className="text-body-sm text-caption font-bold">内訳</h2>
            
            {isPointsOnly ? (
              <div className="flex justify-between text-body-sm text-muted-foreground">
                <span>ポイント利用</span>
                <div>
                  <span>{pointsRequired?.toLocaleString()}pt</span>
                  <span className="mx-2">×</span>
                  <span>{participantCount}名</span>
                  <span className="mx-2">=</span>
                  <span className="font-bold">{totalPointsRequired.toLocaleString()}pt</span>
                </div>
              </div>
            ) : (
              <>
                {/* 通常申し込み */}
                <div className={`flex justify-between text-body-sm text-muted-foreground  pb-2 ${hasPaymentMethod ? "border-b border-foreground-caption" : "border-none"}`}>
                  <span>通常申し込み</span>
                  <div>
                    {pricePerPerson != null ? (
                      <>
                        <span>{pricePerPerson.toLocaleString()}円</span>
                        <span className="mx-2">×</span>
                        <span>{participantCount - pointCount}名</span>
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
              </>
            )}
          </div>
        </div>
      </>
    );
  },
);

PaymentSummary.displayName = "PaymentSummary";
