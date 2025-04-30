"use client";

import { FC, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePlaceMembership } from "@/hooks/usePlaceMembership";
import { RecentActivitiesTimeline } from "@/app/components/features/activity/RecentActivitiesTimeline";
import { Button } from "@/components/ui/button";
import { AsymmetricImageGrid } from "@/components/ui/asymmetric-image-grid";
import { Opportunity, Participation, ParticipationImage } from "@/types";
import Link from "next/link";
import OpportunityCard from '@/app/components/features/opportunity/OpportunityCard';

interface PlaceDetailProps {
  params: {
    id: string;
  };
  searchParams: {
    userId?: string;
  };
}

const PlaceDetail: FC<PlaceDetailProps> = ({ params, searchParams }) => {
  const { membership, opportunities, featuredArticle, loading, error } = usePlaceMembership(
    "neo88",
    searchParams.userId || "",
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = opportunities.flatMap((opportunity: Opportunity) => opportunity.images || []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!membership) return <div>Membership not found</div>;

  const hasParticipationImages = opportunities.some((opportunity: Opportunity) =>
    opportunity.slots?.edges?.some((edge) =>
      edge?.node?.participations?.edges?.some((p) => {
        const participation = p as Participation;
        return (
          participation?.node?.images &&
          Array.isArray(participation.node.images) &&
          participation.node.images.length > 0
        );
      }),
    ),
  );

  const displayImages = allImages.slice(0, 3);
  const remainingCount = Math.max(0, allImages.length - 3);

  return (
    <div className="min-h-screen bg-white overflow-auto">
      <div className="pb-6">
        <div className="relative mx-auto" style={{ width: "390px", height: "480px" }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={allImages[currentImageIndex].url || "/images/place-detail.jpg"}
                alt={`スライド ${currentImageIndex + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>
          </AnimatePresence>

          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {allImages.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-gray-700">{membership.place?.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-gray-700">
                {membership.participationView.participated.totalParticipatedCount}人
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">{membership.name}</h1>
          <h2 className="text-xl mb-4">{membership.headline}</h2>
          <p className="text-gray-600 mb-6">{membership.bio}</p>

          {hasParticipationImages && (
            <section className="mb-12">
              <div className="max-w-3xl">
                <div className="space-y-4">
                  <AsymmetricImageGrid images={displayImages} remainingCount={remainingCount > 0 ? remainingCount : undefined} />
                </div>
              </div>
            </section>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                募集中の関わり
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {opportunities.length}
                </span>
              </h2>
            </div>
            <div className="relative">
              <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-4">
                  {opportunities.map((opportunity: Opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      id={opportunity.id}
                      title={opportunity.title}
                      price={0}
                      imageUrl={opportunity.images?.[0] || "/placeholder.png"}
                      location=""
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {featuredArticle && (
            <section className="mb-12">
              <h2 className="text-xl font-bold mb-4">関連記事</h2>
              <Link href={`/articles/${featuredArticle.id}`} className="block">
                <div className="bg-white rounded-xl border hover:shadow-md transition-shadow duration-200">
                  <div className="relative w-full h-[200px]">
                    <Image
                      src={(featuredArticle.thumbnail?.url ?? "/placeholder.png") as string}
                      alt={featuredArticle.thumbnail?.alt || featuredArticle.title || ""}
                      fill
                      className="object-cover rounded-t-xl"
                    />
                  </div>
                  <div className="p-6">
                    <h5 className="text-xl font-bold mb-2 line-clamp-2">{featuredArticle.title}</h5>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {featuredArticle.introduction}
                    </p>
                    <div className="mt-2 text-sm text-gray-500">
                      {new Date(featuredArticle.createdAt).toLocaleDateString("ja-JP")}
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {opportunities.length > 0 && (
            <div className="mt-8">
              <RecentActivitiesTimeline opportunities={opportunities} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
