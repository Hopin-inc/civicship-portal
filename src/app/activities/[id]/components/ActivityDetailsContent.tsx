"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { SimilarActivitiesList } from "./SimilarActivitiesList";
import ActivityScheduleCard from "./ActivityScheduleCard";
import { ActivityCard, ActivityDetail } from "@/app/activities/data/type";
import ArticleCard from "@/app/articles/components/Card";

interface ActivityDetailsContentProps {
  opportunity: ActivityDetail;
  availableTickets: number;
  availableDates: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
    participants: number;
    price: number;
  }>;
  similarActivities: ActivityCard[];
  communityId?: string;
}

const ActivityDetailsContent: React.FC<ActivityDetailsContentProps> = ({
  opportunity,
  availableTickets,
  availableDates,
  similarActivities,
  communityId = "",
}) => {
  return (
    <>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">体験できること</h2>
        <p className="text-foreground whitespace-pre-wrap">{opportunity.body}</p>
      </section>

      <section className="mb-12">
        <div className="rounded-xl">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={opportunity.host?.image || "/placeholder.png"}
                  alt={opportunity.host?.name || "案内者"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">
                  <span className="text-xl">{opportunity.host?.name}</span>
                  <span>さん</span>
                </h3>
                <p className="text-gray-600">が案内します</p>
              </div>
            </div>
            {opportunity.host.interview && (
              <ArticleCard article={opportunity.host.interview} />
            )}
          </div>
        </div>
      </section>

      {/* 集合場所 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">集合場所</h2>
        {opportunity.place?.latitude && opportunity.place?.longitude && (
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(opportunity.place.address)}`}
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </section>

      {/* 開催日 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">開催日</h2>
        <p className="text-gray-600 mb-4">申込可能な時間枠の数：{availableDates.length}</p>
        <div className="relative">
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide px-4 -mx-4">
            {availableDates.map((schedule, index) => (
              <div key={index} className="flex-shrink-0 first:ml-0">
                <ActivityScheduleCard
                  id={schedule.id}
                  startsAt={schedule.startsAt}
                  endsAt={schedule.endsAt}
                  participants={schedule.participants}
                  price={schedule.price}
                  opportunityId={opportunity.id}
                  communityId={communityId}
                  reservableTickets={opportunity.reservableTickets.length}
                  availableTickets={availableTickets}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">注意事項</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
            <span>参加には事前予約が必要です</span>
          </li>
          {opportunity.requiredApproval && (
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
              <span>参加には承認が必要です</span>
            </li>
          )}
        </ul>
      </section>

      <section className="mb-12">
        {similarActivities && similarActivities.length > 0 && (
          <SimilarActivitiesList
            opportunities={similarActivities}
            currentOpportunityId={opportunity.id}
          />
        )}
      </section>
    </>
  );
};

export default ActivityDetailsContent;
