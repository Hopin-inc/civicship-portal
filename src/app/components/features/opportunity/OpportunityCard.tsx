import Link from "next/link";
import Image from "next/image";
import type { Opportunity } from "@/types";
import { Clock, Globe, MapPin, Coins, Gift } from "lucide-react";
import { format, isPast } from "date-fns";
import { ja } from "date-fns/locale";
import { mockCommunities } from "@/lib/data";
import { cn } from "@/lib/utils";

type OpportunityCardProps = {
  opportunity: Opportunity;
  isJoined?: boolean;
  isInvited?: boolean;
  bonusPoints?: number;
  invitedBy?: {
    id: string;
    name: string;
    image?: string;
  };
};

const getStatusBadgeText = ({
  isPastEvent,
  isJoined,
  isInvited,
  isEvent,
}: {
  isPastEvent: boolean;
  isJoined: boolean;
  isInvited: boolean;
  isEvent: boolean;
}) => {
  if (isPastEvent) return "参加済み";
  if (isJoined) return "参加予定";
  if (isInvited) return "特別招待";
  return isEvent ? "参加募集中" : "応募受付中";
};

const getStatusBadgeColor = ({
  isPastEvent,
  isInvited,
  isEvent,
}: {
  isPastEvent: boolean;
  isInvited: boolean;
  isEvent: boolean;
}) => {
  if (isPastEvent) return "bg-muted-foreground";
  if (isInvited) return "bg-[#C37C09]";
  return "bg-primary";
  // return isEvent ? "bg-primary" : "bg-primary/60";
};

export default function OpportunityCard({
  opportunity,
  isJoined,
  isInvited,
  bonusPoints = 0,
  invitedBy,
}: OpportunityCardProps) {
  const isEvent = opportunity.type === "EVENT";
  const isPastEvent = isPast(new Date(opportunity.startsAt));
  const project = mockCommunities.find((p) => p.id === opportunity.communityId);

  const statusBadgeText = getStatusBadgeText({
    isPastEvent,
    isJoined: isJoined ?? false,
    isInvited: isInvited ?? false,
    isEvent,
  });

  const statusBadgeColor = getStatusBadgeColor({
    isPastEvent,
    isInvited: isInvited ?? false,
    isEvent,
  });

  return (
    <Link
      href={`/opportunities/${opportunity.id}`}
      className="rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-border transition-all overflow-hidden relative before:absolute before:left-[-20px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-border before:ring-4 before:ring-background block"
    >
      <div className="flex items-start gap-4 p-2 py-3 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm group rounded-lg">
        <div className="relative w-18 h-18 flex-shrink-0">
          <Image
            src={opportunity?.image || "/placeholder.svg"}
            alt={opportunity?.title || ""}
            width={72}
            height={72}
            className="rounded-xl transition-transform duration-200 group-hover:scale-[1.02] object-cover aspect-square"
          />
          {(isJoined || isInvited) && (
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 py-1 text-[10px] text-center text-white font-medium rounded-b-xl group-hover:scale-[1.02] transition-transform duration-200",
                statusBadgeColor
              )}
            >
              {statusBadgeText}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            {project?.title && (
              <span className="truncate">{project.title}</span>
            )}
          </div>

          <h3 className="text-base mb-1 truncate text-foreground group-hover:text-primary transition-colors duration-200">
            {opportunity.title}
          </h3>
          <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              <span>
                {format(new Date(opportunity.startsAt), "HH:mm", {
                  locale: ja,
                })}
              </span>
            </div>
            {opportunity.location && (
              <div className="flex items-center gap-1">
                {opportunity.location.isOnline ? (
                  <>
                    <Globe className="w-3 h-3 shrink-0" />
                    <span>オンライン</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{opportunity.location.name}</span>
                  </>
                )}
              </div>
            )}
            {(opportunity?.pointsForComplete ?? 0) > 0 && (
              <div className="flex items-center gap-1 whitespace-nowrap">
                <Gift className="w-3 h-3 shrink-0" />
                <span>
                  {opportunity.pointsForComplete}pt
                  {bonusPoints > 0 && (
                    <span className="text-[#C37C09]">
                      {" "}
                      +{bonusPoints}pt
                      <span className="text-xs ml-0.5">(招待特典)</span>
                    </span>
                  )}
                  獲得
                </span>
              </div>
            )}
            {(opportunity?.pointsForJoin ?? 0) > 0 && (
              <div className="flex items-center gap-1 whitespace-nowrap">
                <Coins className="w-3 h-3 shrink-0" />
                <span>
                  {bonusPoints > 0 ? (
                    <>
                      <span className="line-through text-muted-foreground/70">
                        {opportunity.pointsForJoin}pt
                      </span>
                      <span className="text-[#C37C09] ml-1">
                        → {(opportunity.pointsForJoin ?? 0) - bonusPoints}pt
                      </span>
                    </>
                  ) : (
                    <>{opportunity.pointsForJoin}pt</>
                  )}
                  必要
                </span>
              </div>
            )}
            {bonusPoints > 0 &&
              (opportunity?.pointsForComplete ?? 0) === 0 &&
              (opportunity?.pointsForJoin ?? 0) === 0 && (
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Gift className="w-3 h-3 shrink-0" />
                  <span>
                    <span className="line-through text-muted-foreground/70">
                      0pt
                    </span>
                    <span className="text-[#C37C09]"> → {bonusPoints}pt</span>
                    獲得
                  </span>
                </div>
              )}
          </div>
          {invitedBy && (
            <div className="flex items-center gap-1.5 mt-2 mr-auto justify-end">
              <div className="relative w-4 h-4 rounded-full overflow-hidden">
                <Image
                  src={
                    invitedBy.image ||
                    "https://api.dicebear.com/7.x/personas/svg?seed=" +
                      invitedBy.id
                  }
                  alt={invitedBy.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs mt-1 text-muted-foreground/80">
                {invitedBy.name}からの招待
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
