'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/contexts/HeaderContext';
import { useLoading } from '@/hooks/core/useLoading';
import { useGetOpportunityQuery } from "@/types/graphql";
import { COMMUNITY_ID } from '@/utils';
import { presenterActivityDetail } from '@/presenters/opportunity';
import {
  groupActivitySlotsByDate,
  filterSlotGroupsBySelectedDate,
  buildReservationParams,
  isSlotAvailable as checkSlotAvailability,
} from "@/presenters";
import { ActivitySlot, ActivitySlotGroup } from '@/types/opportunitySlot';
import { ActivityDetail } from "@/types/opportunity";

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

  const { data, loading, error } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId: COMMUNITY_ID },
    },
    skip: !opportunityId,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    onError: (err) => {
      console.error("Opportunity query error:", err);
    },
  });

  const opportunity: ActivityDetail | null = useMemo(() => {
    return data?.opportunity ? presenterActivityDetail(data.opportunity) : null;
  }, [data]);

  const activitySlots: ActivitySlot[] = useMemo(() => {
    return opportunity?.slots ?? [];
  }, [opportunity?.slots]);
  const groupedSlots: ActivitySlotGroup[] = useMemo(() => {
    return groupActivitySlotsByDate(activitySlots);
  }, [activitySlots]);

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
        year: "numeric", month: "long", day: "numeric", weekday: "long",
      });
      setSelectedDate(dateLabel);
    }
    const params = buildReservationParams(opportunityId, communityId, slot, selectedGuests);
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
    isSlotAvailable: (slot: ActivitySlot) => checkSlotAvailability(slot, selectedGuests),
  };
};
