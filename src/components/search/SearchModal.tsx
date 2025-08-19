"use client";

import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { buildSearchResultParams, formatDateRange } from "@/app/search/data/presenter";
import SearchTabs, { SearchTabType } from "@/app/search/components/Tabs";
import { SearchFilterType } from "@/app/search/hooks/useSearch";
import { visiblePrefectureLabels } from "@/app/users/data/presenter";
import { useSearchForm } from "@/app/search/hooks/useSearchForm";
import SearchForm from "@/app/search/components/SearchForm";
import SearchFilters from "@/app/search/components/SearchFilters";
import SearchFooter from "@/app/search/components/Footer";
import SearchFilterSheets from "@/app/search/components/SearchFilterSheet";
import { useFeatureCheck } from "@/hooks/useFeatureCheck";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialParams?: {
    location?: string;
    from?: string;
    to?: string;
    guests?: string;
    q?: string;
    type?: string;
    ticket?: string;
    points?: string;
  };
}

export default function SearchModal({ isOpen, onClose, initialParams = {} }: SearchModalProps) {
  const router = useRouter();
  const shouldShowQuests = useFeatureCheck("quests");
  
  const defaultTab: SearchTabType = shouldShowQuests && initialParams.type === "quest" ? "quest" : "activity";
  const [selectedTab, setSelectedTab] = useState<SearchTabType>(defaultTab);
  const [activeForm, setActiveForm] = useState<SearchFilterType>(null);

  // Initialize form with initial parameters
  const methods = useForm({
    defaultValues: {
      searchQuery: initialParams.q || "",
      location: initialParams.location || "",
      dateRange: (() => {
        const fromStr = initialParams.from;
        const toStr = initialParams.to;
        if (fromStr && toStr) {
          const fromDate = new Date(fromStr);
          const toDate = new Date(toStr);
          if (!Number.isNaN(fromDate.valueOf()) && !Number.isNaN(toDate.valueOf())) {
            return { from: fromDate, to: toDate };
          }
        }
        return undefined;
      })(),
      guests: (() => {
        if (!initialParams.guests) return 0;
        const parsed = parseInt(initialParams.guests, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
      })(),
      useTicket: initialParams.ticket === "true",
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center">
      <div className="bg-white w-full max-w-md max-h-[100vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-white relative">
          <Button variant="icon-only" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <h2 className="text-title-md font-semibold text-black absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            体験・お手伝いを検索
          </h2>
          <div className="w-10"></div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 bg-white">
          <FormProvider {...methods}>
            <SearchModalContent
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              activeForm={activeForm}
              setActiveForm={setActiveForm}
              shouldShowQuests={shouldShowQuests}
              onClose={onClose}
              router={router}
            />
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

function SearchModalContent({
  selectedTab,
  setSelectedTab,
  activeForm,
  setActiveForm,
  shouldShowQuests,
  onClose,
  router,
}: {
  selectedTab: SearchTabType;
  setSelectedTab: (tab: SearchTabType) => void;
  activeForm: SearchFilterType;
  setActiveForm: (f: SearchFilterType) => void;
  shouldShowQuests: boolean;
  onClose: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const {
    location,
    dateRange,
    guests,
    useTicket,
    usePoints,
    getValues,
    setValue,
    handleClear,
    baseClearActiveFilter,
  } = useSearchForm();

  const clearActiveFilter = () => {
    if (activeForm) {
      baseClearActiveFilter(activeForm);
    }
    setActiveForm(null);
  };

  const handleSearch = () => {
    const values = getValues();
    const type = selectedTab === "quest" ? "quest" : "activity";
    const params = buildSearchResultParams(
      values.searchQuery,
      values.location,
      values.dateRange,
      values.guests,
      values.useTicket,
      values.usePoints,
      type,
    );
    
    router.push(`/opportunities/search?${params.toString()}`);
    onClose();
  };

  const values = getValues();
  const isNoCondition =
    !values.searchQuery &&
    !values.location &&
    !values.dateRange &&
    !values.guests &&
    !values.useTicket &&
    !values.usePoints;

  return (
    <div className="space-y-4 bg-white">
      {shouldShowQuests && (
        <div className="bg-white">
          <SearchTabs
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
        </div>
      )}
      
      <div className="bg-white">
        <SearchForm onSearch={handleSearch} />
      </div>
      
      <div className="bg-white">
        <SearchFilters
          onFilterClick={setActiveForm}
          formatDateRange={formatDateRange}
          prefectureLabels={visiblePrefectureLabels}
          location={location}
          dateRange={dateRange}
          guests={guests}
          useTicket={useTicket}
          usePoints={usePoints}
        />
      </div>
      
      <div className="bg-white">
        <SearchFilterSheets
          activeForm={activeForm}
          setActiveForm={setActiveForm}
          location={location}
          setLocation={(val) => setValue("location", val)}
          dateRange={dateRange}
          setDateRange={(val) => setValue("dateRange", val)}
          guests={guests}
          setGuests={(val) => setValue("guests", val)}
          useTicket={useTicket}
          setUseTicket={(val) => setValue("useTicket", val)}
          usePoints={usePoints}
          setUsePoints={(val) => setValue("usePoints", val)}
          clearActiveFilter={clearActiveFilter}
          getSheetHeight={() => "60vh"}
          prefectures={Object.entries(visiblePrefectureLabels).map(([id, name]) => ({ id, name }))}
        />
      </div>
      
      <div className="border-t bg-white">
        <SearchFooter 
          onClear={handleClear} 
          onSearch={handleSearch} 
          isNoCondition={isNoCondition} 
        />
      </div>
    </div>
  );
} 