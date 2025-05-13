'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { useHeader } from '@/components/providers/HeaderProvider';
import { formatDateRange, buildSearchParams } from '@/app/search/data/presenter';

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

export const useSearch = () => {
  const router = useRouter();
  const { updateConfig, resetConfig } = useHeader();

  const [selectedTab, setSelectedTab] = useState<SearchTabType>('activity');
  const [activeForm, setActiveForm] = useState<SearchFilterType>(null);
  const [location, setLocation] = useState('');
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

  const handleClear = () => {
    setLocation('');
    setDateRange(undefined);
    setGuests(0);
    setActiveForm(null);
  };

  const handleSearch = () => {
    const params = buildSearchParams(
      searchQuery,
      location,
      dateRange,
      guests,
      useTicket,
      selectedTab
    );
    router.push(`/search/result?${params.toString()}`);
  };

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

  const incrementGuests = () => setGuests((prev) => prev + 1);
  const decrementGuests = () => setGuests((prev) => Math.max(0, prev - 1));

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

    handleClear,
    handleSearch,
    formatDateRange,

    getSheetHeight,
    clearActiveFilter,
    incrementGuests,
    decrementGuests,

    PREFECTURES
  };
};

export default useSearch;
