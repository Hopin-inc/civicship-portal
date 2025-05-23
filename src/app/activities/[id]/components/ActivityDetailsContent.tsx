"use client";

import React from "react";
import Image from "next/image";
import { AlertCircle, Calendar, MapPin, Users, Clock, CalendarX } from "lucide-react";
import SameStateActivities from "./SimilarActivitiesList";
import ActivityScheduleCard from "./ActivityScheduleCard";
import {
  ActivityCard,
  ActivityDetail,
  OpportunityHost,
  OpportunityPlace,
} from "@/app/activities/data/type";
import ArticleCard from "@/app/articles/components/Card";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { Button } from "@/components/ui/button";
import { useReadMore } from "@/hooks/useReadMore";
import Link from "next/link";
import IconWrapper from "@/components/shared/IconWrapper";
import AddressMap from "@/components/shared/AddressMap";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface ActivityDetailsContentProps {
  opportunity: ActivityDetail;
  availableTickets: number;
  availableDates: ActivitySlot[];
  sameStateActivities: ActivityCard[];
  communityId?: string;
}

const ActivityDetailsContent = ({
  opportunity,
  availableTickets,
  availableDates,
  sameStateActivities,
  communityId = "",
}: ActivityDetailsContentProps) => {
  return (
    <>
      <ActivityBodySection body={opportunity.description + "\n\n" + opportunity.body} />
      <HostInfoSection host={opportunity.host} />
      <PlaceSection place={opportunity.place} />
      <ScheduleSection
        slots={availableDates}
        opportunityId={opportunity.id}
        communityId={communityId}
      />
      <NoticeSection />
      <SameStateActivities
        header={"近くでおすすめの体験"}
        opportunities={sameStateActivities}
        currentOpportunityId={opportunity.id}
      />
    </>
  );
};

const INITIAL_DISPLAY_LINES = 6;

const ActivityBodySection = ({ body }: { body: string }) => {
  const { textRef, expanded, showReadMore, toggleExpanded, getTextStyle } = useReadMore({
    text: body,
    maxLines: INITIAL_DISPLAY_LINES,
  });

  return (
    <section className="pt-6 pb-8 mt-0">
      <h2 className="text-display-md text-foreground mb-4">体験できること</h2>
      <div className="relative">
        <p
          ref={textRef}
          className="text-body-md text-foreground whitespace-pre-wrap transition-all duration-300"
          style={getTextStyle()}
        >
          {body}
        </p>
        {showReadMore && !expanded && (
          <div className="absolute bottom-0 left-0 w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            <div className="relative flex justify-center pt-8">
              <Button
                variant="tertiary"
                size="sm"
                onClick={toggleExpanded}
                className="bg-white px-6"
              >
                <span className="text-label-sm font-bold">もっと見る</span>
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* #TODO: 体験画像のギャラリー表示 */}
    </section>
  );
};

const HostInfoSection = ({ host }: { host: OpportunityHost }) => {
  if (!host) return null;

  return (
    <section className="pt-6 pb-8 mt-0 bg-background-hover -mx-4 px-4">
      <h2 className="text-display-md text-foreground mb-4">案内人</h2>
      <div className="rounded-xl flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {host.id ? (
            <Link
              href={`/users/${host.id}`}
              className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
            >
              <Image
                src={host.image || PLACEHOLDER_IMAGE}
                alt={host.name || "案内者"}
                fill
                className="object-cover"
              />
            </Link>
          ) : (
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={host.image || PLACEHOLDER_IMAGE}
                alt={host.name || "案内者"}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="text-title-sm font-bold mb-1 text-caption">
              <span className="text-display-sm mr-1 text-foreground">{host.name}</span>さん
            </h3>
            {host.bio && <p className="text-body-sm text-caption line-clamp-2">{host.bio}</p>}
          </div>
        </div>
        {host.interview && <ArticleCard article={host.interview} />}
      </div>
    </section>
  );
};

const PlaceSection = ({ place }: { place: OpportunityPlace }) => {
  return (
    <section className="pt-6 pb-8 mt-0">
      <h2 className="text-display-md text-foreground mb-4">集合場所</h2>
      <div>
        <p className="text-body-md font-bold">{place.name}</p>
        <p className="text-body-sm text-caption mb-2">{place.address}</p>
        <AddressMap
          address={place.address}
          markerTitle={place.name || "集合場所"}
          height={300}
          latitude={place.latitude}
          longitude={place.longitude}
        />
        {place?.description && (
          <p className="text-body-sm text-caption mt-4">{place.description}</p>
        )}
      </div>
    </section>
  );
};

const ScheduleSection = ({
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

  const hasSchedule = slots.length > 0;

  return (
    <section className="pt-6 pb-8 mt-0">
      <h2 className="text-display-md text-foreground mb-4">開催日</h2>
      <div className="relative">
        {hasSchedule ? (
          <>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide px-4 -mx-4">
              {slots.map((slot, index) => (
                <div key={index} className="flex-shrink-0 first:ml-0">
                  <ActivityScheduleCard
                    slot={slot}
                    opportunityId={opportunityId}
                    communityId={communityId}
                  />
                </div>
              ))}
            </div>
            <Link href={`/reservation/select-date?${query.toString()}`}>
              <Button variant="secondary" size="md" className="w-full">
                参加できる日程を探す
              </Button>
            </Link>
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

const NoticeSection: React.FC = () => {
  return (
    <section className="pt-6 pb-8 mt-0 bg-background-hover -mx-4 px-4">
      <h2 className="text-display-md text-foreground mb-4">注意事項</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={20} strokeWidth={2.5} />
          </IconWrapper>
          <p className="text-body-md flex-1 font-bold">ホストによる確認後に、予約が確定します。</p>
        </div>
        <div className="flex items-center gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={20} strokeWidth={2.5} />
          </IconWrapper>
          <p className="text-body-md flex-1">
            実施確定または中止のどちらの場合でも、公式LINEからご連絡します。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={20} strokeWidth={2.5} />
          </IconWrapper>
          <p className="text-body-md flex-1">当日は現金をご用意下さい。</p>
        </div>
        <div className="flex items-center gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={20} strokeWidth={2.5} />
          </IconWrapper>
          <p className="text-body-md flex-1">キャンセルは開催日の7日前まで可能です。</p>
        </div>
      </div>
    </section>
  );
};

export default ActivityDetailsContent;
