'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/components/providers/HeaderProvider';
import { useLoading } from '@/hooks/core/useLoading';
import { useReservationDateSelectionQuery } from '@/hooks/features/reservation/useReservationDateSelectionQuery';
import { 
  TimeSlot, 
  DateSection,
  transformSlotsToDateSections,
  filterDateSectionsByDate,
  isSlotAvailable as checkSlotAvailability,
  buildReservationParams
} from '@/presenters/opportunitySlot';

interface UseReservationDateSelectionProps {
  opportunityId: string;
  communityId: string;
}

/**
 * Controller hook for managing reservation date and guest selection
 */
export const useReservationDateSelectionController = ({ 
  opportunityId, 
  communityId 
}: UseReservationDateSelectionProps) => {
  const router = useRouter();
  const { updateConfig } = useHeader();
  const { opportunity, loading, error } = useReservationDateSelectionQuery(opportunityId);
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

  const dateSections = transformSlotsToDateSections(opportunity);
  
  const filteredDateSections = filterDateSectionsByDate(dateSections, selectedDate);

  const handleReservation = (slot: TimeSlot) => {
    if (!selectedDate) return;

    const params = buildReservationParams(opportunityId, communityId, slot, selectedGuests);
    router.push(`/reservation/confirm?${params.toString()}`);
  };

  const isSlotAvailable = (slot: TimeSlot) => {
    return checkSlotAvailability(slot, selectedGuests);
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
