import React, { memo, useCallback, useEffect, useState } from "react";
import { PointsToggle } from "./PointsToggle";
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";

interface PaymentSectionProps {
  pricePerPerson: number | null;
  participantCount: number;
  usePoints: boolean;
  setUsePoints: (value: boolean) => void;
  userWallet: number | null;
  pointsRequired: number;
  onPointCountChange?: (count: number) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = memo(
  ({
    participantCount,
    usePoints,
    setUsePoints,
    userWallet,
    pointsRequired,
    pricePerPerson,
    onPointCountChange,
  }) => {
    const [selectedPointCount, setSelectedPointCount] = useState(0);
    const [allDisabled, setAllDisabled] = useState(false);

    const isPointsOnly = isPointsOnlyOpportunity(pricePerPerson, pointsRequired);

    const totalSelected = selectedPointCount;
    const remainingSlots = Math.max(0, participantCount - totalSelected);

    useEffect(() => {
      const shouldBeDisabled = selectedPointCount >= participantCount;

      if (shouldBeDisabled) {
        setAllDisabled(true);
      } else {
        setAllDisabled(false);
      }
    }, [selectedPointCount, participantCount]);

    const handlePointCountChange = useCallback(
      (count: number) => {
        setSelectedPointCount(count);
        if (onPointCountChange) {
          onPointCountChange(count);
        }
      },
      [onPointCountChange],
    );
    const getTitle = () => {
      if (pointsRequired > 0) {
        return "ポイントを利用";
      }
      return "支払い方法";
    };
    return (
      <div className="rounded-lg px-6">
        <h3 className="text-display-sm mb-4">{getTitle()}</h3>
        {pointsRequired > 0 && !isPointsOnly && (
          <PointsToggle
            usePoints={usePoints}
            setUsePoints={setUsePoints}
            maxPoints={userWallet ?? 0}
            participantCount={participantCount}
            pointsRequired={pointsRequired}
            onPointCountChange={handlePointCountChange}
            remainingSlots={remainingSlots}
            disabled={!userWallet || userWallet < pointsRequired}
            allDisabled={allDisabled}
            isPointsOnly={isPointsOnly}
          />
        )}
      </div>
    );
  },
);

PaymentSection.displayName = "PaymentSection";

export default PaymentSection;
