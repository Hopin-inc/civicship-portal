"use client";

import Link from "next/link";
import { ChevronLeft, Clock, MapPin, CalendarDays, AlertCircle, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useOpportunity } from "@/hooks/useOpportunity";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { RecentActivitiesList } from "@/app/components/features/activity/RecentActivitiesList";
import { useSimilarOpportunities } from "@/hooks/useSimilarOpportunities";
import { SimilarActivitiesList } from "@/app/components/features/activity/SimilarActivitiesList";

const ScheduleCard: React.FC<{
  startsAt: string;
  endsAt: string;
  participants: number;
  price: number;
  opportunityId: string;
}> = ({ startsAt, endsAt, participants, price, opportunityId }) => {
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);
  
  return (
    <div className="bg-white rounded-xl border px-10 py-8 w-[280px] h-[316px] flex flex-col">
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-1">
          {format(startDate, "M月d日", { locale: ja })}
          <span className="text-lg">（{format(startDate, "E", { locale: ja })}）</span>
        </h3>
        <p className="text-md text-gray-600 mb-4">
          {format(startDate, "HH:mm")}〜{format(endDate, "HH:mm")}
        </p>
        <p className="text-md text-gray-500 mb-4">参加予定 {participants}人</p>
        <p className="text-lg font-bold mb-6">¥{price.toLocaleString()}</p>
      </div>
      <div className="flex justify-center">
        <Link href={`/reservation/confirm?opportunity_id=${opportunityId}&slot_starts_at=${startsAt}`}>
          <Button
            variant="default"
            size="selection"
          >
            選択
          </Button>
        </Link>
      </div>
    </div>
  );
};

interface ActivityPageProps {
  params: {
    id: string;
  };
  searchParams: {
    community_id?: string;
  };
}

export default function ActivityPage({ params, searchParams }: ActivityPageProps) {
  const { opportunity, loading, error } = useOpportunity(params.id, searchParams.community_id || "");
  const { similarOpportunities, loading: similarLoading } = useSimilarOpportunities({
    opportunityId: params.id,
    communityId: searchParams.community_id || "",
  });

  if (!searchParams.community_id) {
    return <div>Community ID is required</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!opportunity) return <div>No opportunity found</div>;

  const availableDates = opportunity.slots?.edges?.map(edge => ({
    startsAt: edge?.node?.startsAt ? format(new Date(edge.node.startsAt), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : "",
    endsAt: edge?.node?.endsAt ? format(new Date(edge.node.endsAt), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : "",
    participants: edge?.node?.participations?.edges?.length || 0,
    price: opportunity.feeRequired || 0
  })).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()) || [];

  return (
    <>
      <main className="min-h-screen pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
            <Image
              src={opportunity.image || "/placeholder.png"}
              alt={opportunity.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{opportunity.title}</h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{opportunity.place?.name || "場所未定"}</span>
              </div>
            </div>
          </div>

          {/* 体験内容 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">体験できること</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{opportunity.body}</p>
          </section>

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
                  <Link href="#" className="block">
                    <div className="bg-white rounded-xl border hover:shadow-md transition-shadow duration-200">
                      <div className="relative w-full h-[200px]">
                        <Image
                          src={opportunity.createdByUser.articlesAboutMe.edges[0].node.image || "/placeholder.png"}
                          alt={opportunity.createdByUser.articlesAboutMe.edges[0].node.title}
                          fill
                          className="object-cover rounded-t-xl"
                        />
                      </div>
                      <div className="p-6">
                        <h5 className="text-xl font-bold mb-2 line-clamp-2">
                          {opportunity.createdByUser.articlesAboutMe.edges[0].node.title}
                        </h5>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {opportunity.createdByUser.articlesAboutMe.edges[0].node.description}
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
                  opportunities={opportunity.createdByUser.opportunitiesCreatedByMe.edges.map(edge => edge).filter(Boolean)} 
                />
              </div>
            )}
          </section>

          {/* 集合場所 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">集合場所</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="mb-4">{opportunity.place?.address || "住所は未定です"}</p>
              {opportunity.place?.latitude && opportunity.place?.longitude && (
                <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(opportunity.place.address)}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">開催日</h2>
            <p className="text-gray-600 mb-4">申込可能な時間枠の数：{availableDates.length}</p>
            <div className="relative">
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide px-4 -mx-4">
                {availableDates.map((schedule, index) => (
                  <div key={index} className="flex-shrink-0 first:ml-0">
                    <ScheduleCard
                      startsAt={schedule.startsAt}
                      endsAt={schedule.endsAt}
                      participants={schedule.participants}
                      price={schedule.price}
                      opportunityId={opportunity.id}
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
              {opportunity.requireApproval && (
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
                  <span>参加には承認が必要です</span>
                </li>
              )}
            </ul>
          </section>

          <section className="mb-12">
            {!similarLoading && similarOpportunities && (
              <SimilarActivitiesList
                opportunities={similarOpportunities}
                currentOpportunityId={opportunity.id}
              />
            )}
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">1人あたり</p>
            <p className="text-xl font-bold">¥{(opportunity.feeRequired || 0).toLocaleString()}</p>
          </div>
          <Link href={`/reservation/select-date?id=${opportunity.id}&community_id=${searchParams.community_id}`}>
            <Button
              variant="default"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
            >
              予約する
            </Button>
          </Link>
        </div>
      </footer>
    </>
  );
}

