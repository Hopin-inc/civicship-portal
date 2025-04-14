"use client";

import { FC, useState, useEffect } from "react";
import { MapPin, CalendarIcon, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import OpportunityCard, { OpportunityCardProps } from "@/app/components/features/activity/OpportunityCard";
import { useHeader } from "@/contexts/HeaderContext";
import { useQuery } from "@apollo/client";
import { SEARCH_OPPORTUNITIES } from "@/graphql/queries/search";
import { OpportunityCategory, PublishStatus, OpportunityFilterInput, OpportunityEdge, Opportunity as GraphQLOpportunity } from "@/gql/graphql";

interface SearchResultPageProps {
  searchParams?: {
    location?: string;
    from?: string;
    to?: string;
    guests?: string;
    type?: "activity" | "quest";
  };
}

export default function Page({ searchParams = {} }: SearchResultPageProps) {
  const { updateConfig } = useHeader();

  const buildFilter = (): OpportunityFilterInput => {
    const filter: OpportunityFilterInput = {
      publishStatus: [PublishStatus.Public],
    };

    // Filter by type (experience or quest)
    if (searchParams.type === "activity") {
      filter.category = OpportunityCategory.Activity;
    } else if (searchParams.type === "quest") {
      filter.category = OpportunityCategory.Quest;
    }

    // Filter by location (prefecture)
    if (searchParams.location) {
      filter.cityCodes = [searchParams.location];
    }

    // Filter by date range with proper date handling
    if (searchParams.from || searchParams.to) {
      if (searchParams.from) {
        const fromDate = new Date(searchParams.from);
        fromDate.setUTCHours(0, 0, 0, 0);
        filter.slotStartsAt = fromDate.toISOString() as any;
      }

      if (searchParams.to) {
        const toDate = new Date(searchParams.to);
        toDate.setUTCHours(23, 59, 59, 999);
        filter.slotEndsAt = toDate.toISOString() as any;
      }
    }

    // Filter by guest count
    if (searchParams.guests) {
      const guestCount = parseInt(searchParams.guests, 10);
      if (!isNaN(guestCount) && guestCount > 0) {
        filter.slotRemainingCapacity = guestCount;
      }
    }

    return filter;
  };

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery(SEARCH_OPPORTUNITIES, {
    variables: {
      filter: buildFilter(),
      first: 20,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    updateConfig({
      showSearchForm: true,
      searchParams: {
        location: searchParams.location,
        from: searchParams.from,
        to: searchParams.to,
        guests: searchParams.guests,
      },
      showLogo: false,
      showBackButton: true,
    });
  }, [
    searchParams.location,
    searchParams.from,
    searchParams.to,
    searchParams.guests,
    updateConfig,
  ]);

  if (queryLoading && !data) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { opportunities } = data || { opportunities: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } } };

  const mapNodeToCardProps = (node: GraphQLOpportunity): OpportunityCardProps => ({
    id: node.id,
    title: node.title,
    price: node.feeRequired || null,
    location: node.place?.name || '場所未定',
    imageUrl: node.images?.[0] || null,
    community: node.community ? { id: node.community.id } : undefined,
  });

  const recommendedOpportunities = opportunities.edges
    .filter((edge: OpportunityEdge) => edge?.node?.slots?.edges?.[0]?.node?.startsAt)
    .map((edge: OpportunityEdge) => edge.node && mapNodeToCardProps(edge.node))
    .filter(Boolean) as OpportunityCardProps[];

  const groupedOpportunities = opportunities.edges.reduce(
    (acc: { [key: string]: OpportunityCardProps[] }, edge: OpportunityEdge) => {
      if (!edge?.node?.slots?.edges?.[0]?.node?.startsAt) return acc;
      
      const dateKey = format(new Date(edge.node.slots.edges[0].node.startsAt), "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(mapNodeToCardProps(edge.node));
      return acc;
    },
    {},
  );

  return (
    <div className="min-h-screen">
      <main className="pt-4 px-4 pb-24">
        {opportunities.edges.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500">
              検索条件に一致する体験・クエストが見つかりませんでした。
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {recommendedOpportunities.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">おすすめの体験</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {recommendedOpportunities.map((props: OpportunityCardProps) => (
                    <OpportunityCard key={props.id} {...props} />
                  ))}
                </div>
              </section>
            )}

            {Object.entries(groupedOpportunities)
              .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
              .map(([dateKey, dateOpportunities]) => {
                const date = new Date(dateKey);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const weekday = format(date, "E", { locale: ja });

                return (
                  <section key={dateKey}>
                    <div className="flex items-center mb-4">
                      <div className="flex items-baseline mr-3">
                        <span className="text-md font-medium text-[#71717A]">{month}/</span>
                        <span className="text-[32px] font-normal text-[#09090B]">{day}</span>
                        <div className="flex items-baseline">
                          <span className="text-xs font-medium text-[#71717A]">(</span>
                          <span className="text-sm font-normal text-[#09090B]">{weekday}</span>
                          <span className="text-xs font-medium text-[#71717A]">)</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {(dateOpportunities as OpportunityCardProps[]).map((props: OpportunityCardProps) => (
                        <OpportunityCard key={props.id} {...props} vertical />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}