import { QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

export const AvailableSlotCard = ({
    slot,
    opportunityId,
    communityId,
    pointsToEarn,
  }: {
    slot: QuestSlot;
    opportunityId: string;
    communityId: string;
    pointsToEarn: number;
  }) => {
    const startDate = new Date(slot.startsAt);
    const endDate = new Date(slot.endsAt);
    const isReservable = slot.isReservable;
  
    const query = new URLSearchParams({
      id: opportunityId,
      community_id: communityId,
      slot_id: slot.id,
      guests: String(slot.applicantCount),
    });
  
    const href = `/reservation/confirm?${query.toString()}`;
  
    return (
      <div className="bg-background rounded-xl border px-6 py-6 w-[280px] flex flex-col">
        <div className="flex-1">
          <h3 className="text-title-md font-bold mb-1 justify-start">
            {format(startDate, "M月d日", { locale: ja })}
            <span>
              ({format(startDate, "E", { locale: ja })})
            </span>
          </h3>
          <p className="text-body-md text-foreground mb-2">
            {format(startDate, "HH:mm")}〜{format(endDate, "HH:mm")}
          </p>
            <div className="flex items-center gap-1 pt-1">
                <p className="bg-primary text-[11px] rounded-full w-4 h-4 flex items-center justify-center font-bold text-white leading-none">
                  P
                </p>
                <p>
                  <span className="font-bold text-body-md">{pointsToEarn.toLocaleString()}pt</span>
                  <span className="text-sm font-body-sm">もらえる</span>
                </p>
            </div>
          </div>
        <div className="flex justify-center mt-6 flex-col gap-2 items-center">
          {isReservable ? (
            <>
              {slot.remainingCapacity &&
                slot.remainingCapacity <= 10 &&
                slot.remainingCapacity > 0 && (
                  <span className="text-xs text-primary font-medium">
                    定員まで残り{slot.remainingCapacity}名
                  </span>
                )}
              <Link href={href} className="w-full">
                <Button variant="primary" size="md" className="w-full">
                  この日程を選択
                </Button>
              </Link>
            </>
          ) : (
            <Button disabled variant="tertiary" size="md" className="w-full">
              予約受付終了
            </Button>
          )}
        </div>
      </div>
    );
  };