'use client';

import { useSearch } from '@/hooks/features/search';
import SearchHeader from '@/app/components/features/search/SearchHeader';
import SearchTabs from '@/app/components/features/search/SearchTabs';
import SearchForm from '@/app/components/features/search/SearchForm';
import SearchFilters from '@/app/components/features/search/SearchFilters';
import SearchFooter from '@/app/components/features/search/SearchFooter';
import FilterSheets from '@/app/components/features/search/FilterSheets';

/**
 * SearchContainer - Container component for the search page
 * 
 * This component is responsible for:
 * - Managing state for the search page
 * - Handling user interactions
 * - Rendering the search UI components
 */
export default function SearchContainer() {
  const {
    searchParams,
    activeTab,
    showFilterSheet,
    activeFilterSheet,
    handleTabChange,
    handleSearchSubmit,
    handleFilterChange,
    handleFilterSheetOpen,
    handleFilterSheetClose,
    handleFilterSheetApply,
    handleFilterSheetReset,
    handleFilterSheetCancel,
    handleClearFilters,
  } = useSearch();

  return (
    <div className="flex flex-col h-full">
      <SearchHeader />
      
      <div className="flex-1 overflow-auto">
        <div className="container px-4 py-6">
          <SearchTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
          
          <SearchForm 
            initialKeyword={searchParams.get('keyword') || ''} 
            onSubmit={handleSearchSubmit} 
          />
          
          <SearchFilters 
            filters={searchParams}
            onFilterChange={handleFilterChange}
            onFilterSheetOpen={handleFilterSheetOpen}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
      
      <SearchFooter 
        onFilterSheetOpen={handleFilterSheetOpen} 
      />
      
      <FilterSheets 
        show={showFilterSheet}
        activeSheet={activeFilterSheet}
        filters={searchParams}
        onClose={handleFilterSheetClose}
        onApply={handleFilterSheetApply}
        onReset={handleFilterSheetReset}
        onCancel={handleFilterSheetCancel}
      />
    </div>
  );
}
