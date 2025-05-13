"use client";

import { useSearch, PREFECTURES } from "@/app/search/hooks/useSearch";
import { SearchHeader } from "@/app/search/components/SearchHeader";
import { SearchTabs } from "@/app/search/components/SearchTabs";
import { SearchForm } from "@/app/search/components/SearchForm";
import { SearchFilters } from "@/app/search/components/SearchFilters";
import { SearchFooter } from "@/app/search/components/SearchFooter";
import { FilterSheets } from "@/app/search/components/FilterSheets";

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
          <SearchTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

          <SearchForm searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

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

      <SearchFooter onClear={handleClear} onSearch={handleSearch} />

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
        getSheetHeight={() => "90vh"}
        prefectures={PREFECTURES}
      />
    </div>
  );
}
