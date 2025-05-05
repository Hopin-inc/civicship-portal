'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/contexts/HeaderContext';
import { useOpportunity } from '@/hooks/features/activity/useOpportunity';
import { useLoading } from '@/hooks/core/useLoading';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export interface TimeSlot {
  time: string;
  participants: number;
  maxParticipants: number;
  price: number;
  id: string;
  startsAt: string;
  endsAt: string;
  remainingCapacityView?: {
    remainingCapacity: number;
  };
}

export interface DateSection {
  date: string;
  day: string;
  timeSlots: TimeSlot[];
}

interface UseReservationDateSelectionProps {
  opportunityId: string;
  communityId: string;
}

/**
 * Custom hook for managing reservation date and guest selection
 */
export const useReservationDateSelection = ({ 
  opportunityId, 
  communityId 
}: UseReservationDateSelectionProps) => {
  const router = useRouter();
  const { updateConfig } = useHeader();
  const { opportunity, loading, error } = useOpportunity(opportunityId);
  const { setIsLoading } = useLoading();
  
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

  const dateSections: DateSection[] = opportunity?.slots?.edges
    ?.reduce((acc: DateSection[], edge) => {
      if (!edge?.node) return acc;

      const startDate = new Date(edge.node.startsAt);
      const endDate = new Date(edge.node.endsAt);
      const dateStr = format(startDate, "M月d日", { locale: ja });
      const dayStr = format(startDate, "E", { locale: ja });
      const timeStr = `${format(startDate, "HH:mm")}~${format(endDate, "HH:mm")}`;
      const participants = edge.node.participations?.edges?.length || 0;
      const maxParticipants = opportunity.capacity || 10;
      const price = opportunity.feeRequired || 0;
      const remainingCapacityView = {
        remainingCapacity: maxParticipants - participants
      };

      const existingSection = acc.find((section) => section.date === dateStr);
      if (existingSection) {
        existingSection.timeSlots.push({
          time: timeStr,
          participants,
          maxParticipants,
          price,
          id: edge.node.id,
          startsAt: String(edge.node.startsAt),
          endsAt: String(edge.node.endsAt),
          remainingCapacityView,
        });
      } else {
        acc.push({
          date: dateStr,
          day: dayStr,
          timeSlots: [
            {
              time: timeStr,
              participants,
              maxParticipants,
              price,
              id: edge.node.id,
              startsAt: String(edge.node.startsAt),
              endsAt: String(edge.node.endsAt),
              remainingCapacityView,
            },
          ],
        });
      }
      return acc;
    }, [])
    .sort((a, b) => {
      const dateA = new Date(a.timeSlots[0].startsAt);
      const dateB = new Date(b.timeSlots[0].startsAt);
      return dateA.getTime() - dateB.getTime();
    }) || [];

  const handleReservation = (slot: TimeSlot) => {
    if (!selectedDate) return;

    const params = new URLSearchParams({
      id: opportunityId,
      community_id: communityId,
      slot_id: slot.id,
      starts_at: slot.startsAt,
      ends_at: slot.endsAt,
      guests: selectedGuests.toString(),
    });

    router.push(`/reservation/confirm?${params.toString()}`);
  };

  const filteredDateSections = dateSections.filter((section) => {
    if (!selectedDate) return true;
    return `${section.date} (${section.day})` === selectedDate;
  });

  const isSlotAvailable = (slot: TimeSlot) => {
    const remainingCapacity = slot.remainingCapacityView?.remainingCapacity || 0;
    return remainingCapacity >= selectedGuests;
  };

  return {
    opportunity,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    selectedGuests,
    setSelectedGuests,
    activeForm,
    setActiveForm,
    dateSections,
    filteredDateSections,
    handleReservation,
    isSlotAvailable
  };
};

export default useReservationDateSelection;
