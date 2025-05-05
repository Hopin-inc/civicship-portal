'use client';

import { useSearch, PREFECTURES } from '@/hooks/features/search/useSearch';
import { SearchHeader } from '@/app/components/features/search/SearchHeader';
import { SearchTabs } from '@/app/components/features/search/SearchTabs';
import { SearchForm } from '@/app/components/features/search/SearchForm';
import { SearchFilters } from '@/app/components/features/search/SearchFilters';
import { SearchFooter } from '@/app/components/features/search/SearchFooter';
import { FilterSheets } from '@/app/components/features/search/FilterSheets';

/**
 * SearchPage - Main search page component
 * 
 * This component is responsible for:
 * - Managing search state and user interactions
 * - Rendering the search UI components
 */
export default function SearchPage() {
  const {
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
    formatDateRange,
    handleClear,
    handleSearch,
    clearActiveFilter,
  } = useSearch();

  return (
    <div className="flex flex-col h-full">
      <SearchHeader />
      
      <div className="flex-1 overflow-auto">
        <div className="container px-4 py-6">
          <SearchTabs 
            selectedTab={selectedTab} 
            onTabChange={setSelectedTab} 
          />
          
          <SearchForm 
            searchQuery={searchQuery} 
            onSearchQueryChange={setSearchQuery} 
          />
          
          <SearchFilters 
            location={location}
            dateRange={dateRange}
            guests={guests}
            useTicket={useTicket}
            onFilterClick={setActiveForm}
            formatDateRange={formatDateRange}
            prefectures={PREFECTURES}
          />
        </div>
      </div>
      
      <SearchFooter 
        onClear={handleClear}
        onSearch={handleSearch}
      />
      
      <FilterSheets 
        activeForm={activeForm}
        setActiveForm={setActiveForm}
        location={location}
        setLocation={setLocation}
        dateRange={dateRange}
        setDateRange={setDateRange}
        guests={guests}
        setGuests={setGuests}
        useTicket={useTicket}
        setUseTicket={setUseTicket}
        clearActiveFilter={clearActiveFilter}
        getSheetHeight={() => '90vh'}
        prefectures={PREFECTURES}
      />
    </div>
  );
}
