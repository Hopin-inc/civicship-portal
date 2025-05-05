'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { useHeader } from '../../../contexts/HeaderContext';

export type SearchTabType = 'activity' | 'quest';
export type SearchFilterType = 'location' | 'date' | 'guests' | 'other' | null;

export interface Prefecture {
  id: string;
  name: string;
}

export const PREFECTURES: Prefecture[] = [
  { id: 'kagawa', name: '香川県' },
  { id: 'tokushima', name: '徳島県' },
  { id: 'kochi', name: '高知県' },
  { id: 'ehime', name: '愛媛県' },
];

/**
 * Hook for managing search UI state
 */
export const useSearchState = () => {
  const { updateConfig, resetConfig } = useHeader();
  
  const [selectedTab, setSelectedTab] = useState<SearchTabType>('activity');
  const [activeForm, setActiveForm] = useState<SearchFilterType>(null);
  const [location, setLocation] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [useTicket, setUseTicket] = useState(false);

  useEffect(() => {
    updateConfig({
      showLogo: false,
      title: '体験・お手伝いを検索',
      showBackButton: true
    });

    return () => {
      resetConfig();
    };
  }, [updateConfig, resetConfig]);

  /**
   * Get sheet height based on active form
   */
  const getSheetHeight = () => {
    switch (activeForm) {
      case 'location':
        return 'h-[300px]';
      case 'date':
        return 'h-[90vh]';
      case 'guests':
        return 'h-[240px]';
      case 'other':
        return 'h-[300px]';
      default:
        return 'h-auto';
    }
  };

  /**
   * Clear filter based on active form
   */
  const clearActiveFilter = () => {
    switch (activeForm) {
      case 'location':
        setLocation('');
        break;
      case 'date':
        setDateRange(undefined);
        break;
      case 'guests':
        setGuests(0);
        break;
      case 'other':
        setUseTicket(false);
        break;
    }
  };

  /**
   * Increment guest count
   */
  const incrementGuests = () => {
    setGuests(prev => prev + 1);
  };

  /**
   * Decrement guest count
   */
  const decrementGuests = () => {
    setGuests(prev => Math.max(0, prev - 1));
  };

  return {
    selectedTab,
    setSelectedTab,
    activeForm,
    setActiveForm,
    location,
    setLocation,
    dateRange,
    setDateRange,
    guests,
    setGuests,
    searchQuery,
    setSearchQuery,
    useTicket,
    setUseTicket,
    
    getSheetHeight,
    clearActiveFilter,
    incrementGuests,
    decrementGuests,
    
    PREFECTURES
  };
};
