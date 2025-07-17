import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { GqlOpportunitySlotHostingStatus } from "@/types/graphql";
import { Link, CalendarX } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScheduleCard } from "../ScheduleCard";

export const ScheduleSection = ({
    slots,
    opportunityId,
    communityId,
  }: {
    slots: ActivitySlot[];
    opportunityId: string;
    communityId: string;
  }) => {
    const query = new URLSearchParams({
      id: opportunityId,
      community_id: communityId ?? "",
    });
    const visibleSlots = useMemo(
      () =>
        slots.filter(
          (slot) =>
            slot.hostingStatus === GqlOpportunitySlotHostingStatus.Scheduled && slot.isReservable,
        ),
      [slots],
    );
  
    const hasSchedule = slots.length > 0;
  
    return (
      <section className="pt-6 pb-8 mt-0">
        <h2 className="text-display-md text-foreground mb-4">開催日</h2>
        <div className="relative">
          {hasSchedule ? (
            <>
              <p className="text-muted-foreground font-bold mb-4 px-1">
                ※予約は各日程の前日まで受付中{" "}
              </p>
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide px-4 -mx-4">
                {slots.map((slot, index) => (
                  <div key={index} className="flex-shrink-0 first:ml-0">
                    <ScheduleCard
                      slot={slot}
                      opportunityId={opportunityId}
                      communityId={communityId}
                    />
                  </div>
                ))}
              </div>
              {visibleSlots.length > 2 && (
                <Link href={`/reservation/select-date?${query.toString()}`}>
                  <Button variant="secondary" size="md" className="w-full">
                    参加できる日程を探す
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <div className="text-center py-8 px-4 bg-card rounded-lg border border-muted/20 flex flex-col items-center">
              <CalendarX className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-body-lg font-medium text-foreground">
                現在予定されている日程はありません
              </p>
              <p className="text-body-sm text-caption mt-2 max-w-xs">
                日程はまだ登録されていません。後日再度確認するか、主催者にお問い合わせください。
              </p>
            </div>
          )}
        </div>
      </section>
    );
  };