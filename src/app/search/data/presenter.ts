"use client";

import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { GqlOpportunity as GraphQLOpportunity, GqlOpportunityEdge } from "@/types/graphql";
import { ActivityCard } from "@/app/activities/data/type";

export interface SearchParams {
  location?: string;
  from?: string;
  to?: string;
  guests?: string;
  type?: "activity" | "quest";
  ticket?: string;
  q?: string;
}

export const formatDateRange = (range: DateRange | undefined): string => {
  if (!range?.from) return "";
  if (!range.to) return format(range.from, "M/d", { locale: ja });
  return `${format(range.from, "M/d", { locale: ja })} - ${format(range.to, "M/d", { locale: ja })}`;
};

export function buildSearchResultParams(
  q: string,
  location: string,
  dateRange: DateRange | undefined,
  guests: number,
  useTicket: boolean,
  type: "activity" | "quest",
): URLSearchParams {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (location) params.set("location", location);
  if (dateRange?.from) params.set("from", formatDateToJST(dateRange.from));
  if (dateRange?.to) params.set("to", formatDateToJST(dateRange.to));
  if (guests > 0) params.set("guests", guests.toString());
  if (useTicket) params.set("ticket", "1");
  params.set("type", type);

  return params;
}

function formatDateToJST(date: Date): string {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

export const mapNodeToCardProps = (node: GraphQLOpportunity): ActivityCard => ({
  id: node.id,
  title: node.title,
  category: node.category,
  feeRequired: node.feeRequired || 0,
  location: node.place?.name || "場所未定",
  images: node.images || [],
  communityId: node.community?.id || "",
  hasReservableTicket: node.isReservableWithTicket || false,
});

export const groupOpportunitiesByDate = (
  opportunities: { edges: GqlOpportunityEdge[] },
  dateRange?: { gte?: Date; lte?: Date },
): { [key: string]: ActivityCard[] } => {
  return opportunities.edges.reduce((acc: { [key: string]: ActivityCard[] }, edge) => {
    const node = edge?.node;
    if (!node || !node.slots || node.slots.length === 0) return acc;

    const matchedSlot = node.slots.find((slot) => {
      const start = new Date(slot.startsAt);
      if (dateRange?.gte && start < dateRange.gte) return false;
      return !(dateRange?.lte && start > dateRange.lte);
    });

    if (!matchedSlot) return acc;

    const dateKey = format(new Date(matchedSlot.startsAt), "yyyy-MM-dd");

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(mapNodeToCardProps(node));
    return acc;
  }, {});
};
