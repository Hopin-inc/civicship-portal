import { QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export const FullSlotCard = ({ slot, pointsToEarn }: { slot: QuestSlot, pointsToEarn: number }) => {
    const startDate = new Date(slot.startsAt);
    const endDate = new Date(slot.endsAt);
  
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
          <div className="flex items-center gap-1 pt-1">
              <p className="bg-primary text-[11px] rounded-full w-4 h-4 flex items-center justify-center font-bold text-white leading-none">
                P
              </p>
              <p className="text-sm font-bold">
                  {pointsToEarn}ptもらえる
              </p>
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