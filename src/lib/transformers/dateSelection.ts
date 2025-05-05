'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Opportunity } from '../../types';
import { OpportunityEdge } from '../../gql/graphql';

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

/**
 * Transform opportunity slots into date sections
 */
export const transformSlotsToDateSections = (opportunity: Opportunity | null): DateSection[] => {
  if (!opportunity?.slots?.edges) return [];

  return opportunity.slots.edges
    .reduce((acc: DateSection[], edge: any) => {
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
    });
};

/**
 * Filter date sections by selected date
 */
export const filterDateSectionsByDate = (
  dateSections: DateSection[], 
  selectedDate: string | null
): DateSection[] => {
  if (!selectedDate) return dateSections;
  
  return dateSections.filter((section) => {
    return `${section.date} (${section.day})` === selectedDate;
  });
};

/**
 * Check if a slot has enough capacity for the selected number of guests
 */
export const isSlotAvailable = (slot: TimeSlot, selectedGuests: number): boolean => {
  const remainingCapacity = slot.remainingCapacityView?.remainingCapacity || 0;
  return remainingCapacity >= selectedGuests;
};

/**
 * Build URL parameters for reservation confirmation
 */
export const buildReservationParams = (
  opportunityId: string,
  communityId: string,
  slot: TimeSlot,
  selectedGuests: number
): URLSearchParams => {
  return new URLSearchParams({
    id: opportunityId,
    community_id: communityId,
    slot_id: slot.id,
    starts_at: slot.startsAt,
    ends_at: slot.endsAt,
    guests: selectedGuests.toString(),
  });
};
