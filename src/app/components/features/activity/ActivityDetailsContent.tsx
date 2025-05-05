'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { AsymmetricImageGrid } from '@/app/components/ui/asymmetric-image-grid';
import { Opportunity } from '@/types';
import { RecentActivitiesList } from './RecentActivitiesList';
import { SimilarActivitiesList } from './SimilarActivitiesList';
import ActivityScheduleCard from './ActivityScheduleCard';

interface ActivityDetailsContentProps {
  opportunity: Opportunity;
  availableTickets: number;
  availableDates: Array<{
    startsAt: string;
    endsAt: string;
    participants: number;
    price: number;
  }>;
  similarOpportunities: Opportunity[];
  communityId?: string;
}

const ActivityDetailsContent: React.FC<ActivityDetailsContentProps> = ({
  opportunity,
  availableTickets,
  availableDates,
  similarOpportunities,
  communityId = '',
}) => {
  const participationImages = opportunity.slots?.edges
    ?.flatMap(
      (edge) =>
        edge?.node?.participations?.edges?.flatMap((p) => {
          const participation = p as any;
          return (
            Array.isArray(participation?.node?.images)
              ? participation.node.images
              : []
          ).map((img: string) => ({
            url: img,
            alt: "参加者の写真",
          }));
        }) || [],
    )
    .filter(Boolean) || [];

  const displayImages = participationImages.slice(0, 3);
  const remainingCount = Math.max(0, participationImages.length - 3);
  const hasParticipationImages = displayImages.length > 0;

  return (
    <>
      {/* 体験内容 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">体験できること</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{opportunity.body}</p>
      </section>

      {/* 参加者の写真 */}
      {hasParticipationImages && (
        <section className="mb-12">
          <div className="max-w-3xl">
            <div className="space-y-4">
              <AsymmetricImageGrid 
                images={displayImages} 
                remainingCount={remainingCount > 0 ? remainingCount : undefined} 
              />
            </div>
          </div>
        </section>
      )}

      {/* 案内者情報 */}
      <section className="mb-12">
        <div className="rounded-xl">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={opportunity.createdByUser?.image || "/placeholder.png"}
                  alt={opportunity.createdByUser?.name || "案内者"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">
                  <span className="text-xl">{opportunity.createdByUser?.name}</span>
                  <span>さん</span>
                </h3>
                <p className="text-gray-600">が案内します</p>
              </div>
            </div>
            {opportunity.createdByUser?.articlesAboutMe?.edges?.[0]?.node && (
              <Link
                href={`/articles/${opportunity.createdByUser.articlesAboutMe.edges[0].node.id}`}
                className="block"
              >
                <div className="bg-white rounded-xl border hover:shadow-md transition-shadow duration-200">
                  <div className="relative w-full h-[200px]">
                    <Image
                      src={
                        (opportunity.createdByUser.articlesAboutMe.edges[0].node.thumbnail ?? "/placeholder.png") as string
                      }
                      alt={
                        opportunity.createdByUser.articlesAboutMe.edges[0].node.title ||
                        "案内者の記事"
                      }
                      fill
                      className="object-cover rounded-t-xl"
                    />
                  </div>
                  <div className="p-6">
                    <h5 className="text-xl font-bold mb-2 line-clamp-2">
                      {opportunity.createdByUser.articlesAboutMe.edges[0].node.title}
                    </h5>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {opportunity.createdByUser.articlesAboutMe.edges[0].node.introduction}
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
        {opportunity.createdByUser?.opportunitiesCreatedByMe?.edges && (
          <div className="mt-8">
            <RecentActivitiesList
              opportunities={opportunity.createdByUser.opportunitiesCreatedByMe.edges
                .map((edge) => edge)
                .filter(Boolean)}
            />
          </div>
        )}
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
                style={{ border: 0 }}
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
                  startsAt={schedule.startsAt}
                  endsAt={schedule.endsAt}
                  participants={schedule.participants}
                  price={schedule.price}
                  opportunityId={opportunity.id}
                  communityId={communityId}
                  isReservableWithTicket={opportunity.isReservableWithTicket}
                  availableTickets={availableTickets}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 注意事項 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">注意事項</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
            <span>参加には事前予約が必要です</span>
          </li>
          {opportunity.requireApproval && (
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
              <span>参加には承認が必要です</span>
            </li>
          )}
        </ul>
      </section>

      {/* 似ている体験 */}
      <section className="mb-12">
        {similarOpportunities && similarOpportunities.length > 0 && (
          <SimilarActivitiesList
            opportunities={similarOpportunities}
            currentOpportunityId={opportunity.id}
          />
        )}
      </section>
    </>
  );
};

export default ActivityDetailsContent;
