"use client";

import React, { useState} from "react";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { SameStateActivities } from "./SimilarActivitiesList";
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
      <ActivityBodySection body={opportunity.body} />
      <HostInfoSection host={opportunity.host} />
      <PlaceSection place={opportunity.place} />
      <ScheduleSection
        slots={availableDates}
        opportunityId={opportunity.id}
        communityId={communityId}
      />
      <NoticeSection requiredApproval={opportunity.requiredApproval} />
      <SameStateActivities
        header={"近くの体験"}
        opportunities={sameStateActivities}
        currentOpportunityId={opportunity.id}
      />
    </>
  );
};

const INITIAL_DISPLAY_LINES = 6;

const ActivityBodySection = ({ body }: { body: string }) => {
  const [expanded, setExpanded] = useState(false);
  const lines = body.split('\n');
  const hasMoreLines = lines.length > INITIAL_DISPLAY_LINES;

  return (
    <section className="pt-6 pb-8 mt-0">
      <h2 className="text-display-md text-foreground mb-4">体験できること</h2>
      <div className="relative">
        <p
          className={`text-body-md text-foreground whitespace-pre-wrap transition-all duration-300 ${!expanded && hasMoreLines ? `line-clamp-${INITIAL_DISPLAY_LINES}` : ""}`}
        >
          {body}
        </p>
        {hasMoreLines && !expanded && (
          <div className="absolute bottom-0 left-0 w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            <div className="relative flex justify-center pt-8">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setExpanded(true)}
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
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={host.image || "/placeholder.png"}
              alt={host.name || "案内者"}
              fill
              className="object-cover"
            />
          </div>
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
  if (!place?.latitude || !place?.longitude) return null;

  const lat = place.latitude;
  const lng = place.longitude;

  const mapUrl =
    lat && lng
      ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${lat},${lng}`
      : `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(place.address)}`;

  return (
    <section className="pt-6 pb-8 mt-0">
      <h2 className="text-display-md text-foreground mb-4">集合場所</h2>
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          className="border-0"
          allowFullScreen
          loading="lazy"
          lang={"JP"}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {place?.description && <p className="text-body-sm text-foreground mt-4">{place.description}</p>}
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
}) => (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-6">開催日</h2>
    <p className="text-gray-600 mb-4">申込可能な時間枠の数：{slots.length}</p>
    <div className="relative">
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
    </div>
  </section>
);

const NoticeSection = ({ requiredApproval }: { requiredApproval?: boolean }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-6">注意事項</h2>
    <ul className="space-y-4">
      <li className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
        <span>参加には事前予約が必要です</span>
      </li>
      {requiredApproval && (
        <li className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
          <span>参加には承認が必要です</span>
        </li>
      )}
    </ul>
  </section>
);

export default ActivityDetailsContent;
