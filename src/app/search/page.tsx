'use client'

import React from 'react'
import { Button } from '@/app/components/ui/button'
import { Sheet, SheetContent } from '@/app/components/ui/sheet'
import { useSearch } from '@/hooks/useSearch'
import SearchHeader from '@/app/components/features/search/SearchHeader'
import SearchTabs from '@/app/components/features/search/SearchTabs'
import SearchForm from '@/app/components/features/search/SearchForm'
import SearchFilters from '@/app/components/features/search/SearchFilters'
import SearchFooter from '@/app/components/features/search/SearchFooter'
import FilterSheets from '@/app/components/features/search/FilterSheets'

/**
 * Search page component
 */
export default function Page() {
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
    getSheetHeight,
    handleClear,
    handleSearch,
    clearActiveFilter,
    incrementGuests,
    decrementGuests,
    PREFECTURES
  } = useSearch();

  return (
    <div className="min-h-screen bg-white">
      <SearchHeader />

      <main className="pt-20 px-4 pb-16">
        <SearchTabs 
          selectedTab={selectedTab} 
          onTabChange={setSelectedTab} 
        />

        <div className="space-y-4">
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
      </main>

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
        getSheetHeight={getSheetHeight}
        prefectures={PREFECTURES}
      />
    </div>
  )
} 