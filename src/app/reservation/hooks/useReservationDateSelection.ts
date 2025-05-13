"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useHeader } from "@/contexts/HeaderContext";
import { useLoading } from "@/hooks/useLoading";
import { useGetOpportunitySlotsQuery } from "@/types/graphql";
import { ActivitySlot, ActivitySlotGroup } from "@/app/reservation/data/type/opportunitySlot";
import { ActivityDetail } from "@/app/activities/data/type";
import {
  buildReservationParams,
  filterSlotGroupsBySelectedDate,
  groupActivitySlotsByDate, isSlotAvailable,
  presenterOpportunitySlots,
} from "@/app/reservation/data/presenter/opportunitySlot";
import { presenterActivityDetail } from "@/app/activities/data/presenter";

interface UseReservationDateSelectionProps {
  opportunityId: string;
  communityId: string;
}

export const useReservationDateSelection = ({
  opportunityId,
  communityId,
}: UseReservationDateSelectionProps) => {
  const router = useRouter();
  const { updateConfig } = useHeader();
  const { setIsLoading } = useLoading();

  const { data, loading, error } = useGetOpportunitySlotsQuery({
    variables: {
      filter: {
        opportunityId: opportunityId,
        hostingStatus: "SCHEDULED",
      },
    },
    skip: !opportunityId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
    onError: (err) => {
      console.error("OpportunitySlot query error:", err);
    },
  });

  const { groupedSlots }: { groupedSlots: ActivitySlotGroup[] } = useMemo(() => {
    const slots = presenterOpportunitySlots(data?.opportunitySlots?.edges);
    const groupedSlots = groupActivitySlotsByDate(slots);
    return { groupedSlots };
  }, [data]);

  console.log("groupedSlots:", groupedSlots);

  const opportunity: ActivityDetail | null = useMemo(() => {
    const opportunity = data?.opportunitySlots?.edges?.find(
      (edge) => edge?.node?.opportunity != null,
    )?.node?.opportunity;
    return opportunity ? presenterActivityDetail(opportunity) : null;
  }, [data]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<number>(1);
  const [activeForm, setActiveForm] = useState<"date" | "guests" | null>(null);

  useEffect(() => {
    updateConfig({
      title: "日付をえらぶ",
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  const filteredDateSections = useMemo(() => {
    return filterSlotGroupsBySelectedDate(groupedSlots, selectedDate ? [selectedDate] : []);
  }, [groupedSlots, selectedDate]);

  const handleReservation = (slot: ActivitySlot) => {
    if (!selectedDate) {
      const date = new Date(slot.startsAt);
      const dateLabel = date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
      setSelectedDate(dateLabel);
    }
    const params = buildReservationParams(opportunityId, communityId, slot, selectedGuests);
    console.log(params.toString());
    router.push(`/reservation/confirm?${params.toString()}`);
  };

  return {
    opportunity,
    loading,
    error: error ?? null,
    selectedDate,
    setSelectedDate,
    selectedGuests,
    setSelectedGuests,
    activeForm,
    setActiveForm,
    dateSections: groupedSlots,
    filteredDateSections,
    handleReservation,
    isSlotAvailable: (slot: ActivitySlot) => isSlotAvailable(slot, selectedGuests),
  };
};
