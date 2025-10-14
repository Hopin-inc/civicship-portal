import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { memo, useCallback, useState, useEffect } from "react";

interface PointsToggleProps {
  usePoints: boolean;
  setUsePoints: (value: boolean) => void;
  maxPoints: number;
  participantCount: number;
  pointsRequired: number | null;
  onPointCountChange: (count: number) => void;
  remainingSlots: number;
  disabled: boolean;
  allDisabled: boolean;
}

export const PointsToggle: React.FC<PointsToggleProps> = memo(
  ({ 
    usePoints, 
    setUsePoints, 
    maxPoints, 
    participantCount, 
    pointsRequired, 
    onPointCountChange, 
    remainingSlots, 
    disabled,
    allDisabled
  }) => {
    const [pointCount, setPointCount] = useState(0);

    const toggleUsePoints = useCallback(() => {
      if (maxPoints > 0 && !disabled) {
        setUsePoints(!usePoints);
      }
    }, [maxPoints, setUsePoints, usePoints, disabled]);

    const handleIncrement = () => {
      const maxUsablePoints = Math.floor(maxPoints / (pointsRequired ?? 0));
      if (pointCount < maxUsablePoints && !allDisabled) {
        setPointCount(pointCount + 1);
      }
    };

    const handleDecrement = () => {
      if (pointCount > 0) {
        setPointCount(pointCount - 1);
      }
    };

    // ポイント使用数が変更されたときに親コンポーネントに通知
    useEffect(() => {
      onPointCountChange(pointCount);
    }, [pointCount, onPointCountChange]);

    return (
      <div className="rounded-2xl border border-input bg-background mb-6 overflow-hidden">
        {/* 上部セクション（常に青い背景） */}
        <div className={`flex items-center justify-between p-4 ${usePoints ? "bg-blue-50" : ""}`}>
          <div className="flex items-start gap-4">
            <Switch
              checked={usePoints}
              onCheckedChange={toggleUsePoints}
              disabled={maxPoints === 0 || disabled}
            />
            <div className="flex flex-col gap-y-1">
              <span className={`text-label-md ${disabled ? 'text-gray-400' : ''}`}>
                ポイントを利用する
              </span>
              <p className={`text-body-sm ${disabled ? 'text-gray-400' : ''}`}>
                保有しているポイント: {Number(maxPoints).toLocaleString()}pt
              </p>
              {disabled && (
                <p className="text-xs text-gray-500 mt-1">
                  チケットで参加者数分をカバーしているため使用できません
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 下部セクション（ON時は白い背景） */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            usePoints ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 space-y-4 border-gray-200 bg-background text-foreground">
            <p className="text-body-sm text-caption">
              1人あたり{pointsRequired?.toLocaleString()}ポイントで参加可能です。参加する人数を入力してください。
            </p>
            
            <div className="flex items-center justify-center">
              <Button
                onClick={handleDecrement}
                variant="tertiary"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={pointCount <= 0}
              >
                -
              </Button>
              <span className="text-xl font-medium w-8 text-center mx-4">{pointCount}</span>
              <Button
                onClick={handleIncrement}
                variant="tertiary"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={pointCount >= Math.floor(maxPoints / (pointsRequired ?? 0)) || allDisabled}
              >
                +
              </Button>
            </div>
            
            <p className="text-xs text-caption text-center">
              ({(pointCount * (pointsRequired ?? 0)).toLocaleString()}pt消費されます)
            </p>
          </div>
        </div>
      </div>
    );
  },
);

PointsToggle.displayName = "PointsToggle";
