'use client';

import React from 'react';
import { MapPin, Calendar as CalendarIcon, Users, Tags, ChevronRight } from 'lucide-react';
import { SearchFilterType, Prefecture } from '@/hooks/features/search/useSearch';
import { DateRange } from 'react-day-picker';

interface SearchFiltersProps {
  location: string;
  dateRange: DateRange | undefined;
  guests: number;
  useTicket: boolean;
  onFilterClick: (filter: SearchFilterType) => void;
  formatDateRange: (range: DateRange | undefined) => string;
  prefectures: Prefecture[];
}

/**
 * Component for displaying search filters
 */
export const SearchFilters: React.FC<SearchFiltersProps> = ({
  location,
  dateRange,
  guests,
  useTicket,
  onFilterClick,
  formatDateRange,
  prefectures
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
      <button
        onClick={() => onFilterClick('location')}
        className="w-full px-4 py-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <MapPin className="h-6 w-6 text-gray-400" />
          <span className={`text-base ${location ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            場所
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-base">
            {location ? prefectures.find(p => p.id === location)?.name : '場所を指定'}
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </button>

      <button
        onClick={() => onFilterClick('date')}
        className="w-full px-4 py-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-6 w-6 text-gray-400" />
          <span className={`text-base ${dateRange?.from ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            日付
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-base">
            {dateRange?.from ? formatDateRange(dateRange) : '日付を追加'}
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </button>

      <button
        onClick={() => onFilterClick('guests')}
        className="w-full px-4 py-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Users className="h-6 w-6 text-gray-400" />
          <span className={`text-base ${guests > 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            人数
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-base">
            {guests > 0 ? `${guests}人` : '人数を指定'}
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </button>

      <button
        onClick={() => onFilterClick('other')}
        className="w-full px-4 py-4 flex items-center justify-between"
      >
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-4">
            <Tags className="h-6 w-6 text-gray-400" />
            <span className={`text-base ${useTicket ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
              その他の条件
            </span>
          </div>
          {useTicket && (
            <div className="pl-10 text-base">
              チケットで支払える
            </div>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );
};

export default SearchFilters;
