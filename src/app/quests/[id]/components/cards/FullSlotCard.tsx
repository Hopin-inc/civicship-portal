import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export const FullSlotCard = ({ slot }: { slot: ActivitySlot }) => {
    const startDate = new Date(slot.startsAt);
    const endDate = new Date(slot.endsAt);
  
    const isFeeSpecified = slot.feeRequired != null;
    const feeText = isFeeSpecified ? `${slot.feeRequired!.toLocaleString()}円` : "料金未定";
    const feeClass = `text-body-md font-bold ${!isFeeSpecified ? "text-gray-400" : "text-gray-400"}`;
  
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-xl px-6 py-6 w-[280px] flex flex-col">
        <div className="flex-1">
          <h3 className="text-title-md text-gray-500 font-bold mb-1">
            {format(startDate, "M月d日", { locale: ja })}
            <span className="text-label-sm text-gray-400">
              （{format(startDate, "E", { locale: ja })}）
            </span>
          </h3>
          <p className="text-body-md text-gray-400 mb-4">
            {format(startDate, "HH:mm")}〜{format(endDate, "HH:mm")}
          </p>
          <div className="space-y-2">
            <div className="flex items-baseline">
              <p className={feeClass}>{feeText}</p>
              {isFeeSpecified && <p className="text-body-sm ml-1 text-gray-300">/ 人</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button disabled variant="tertiary" size="md" className="px-6">
            満席
          </Button>
        </div>
      </div>
    );
  };