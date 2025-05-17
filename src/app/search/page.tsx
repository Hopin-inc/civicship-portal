"use client";

import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { buildSearchResultParams, formatDateRange } from "@/app/search/data/presenter";
import { SearchTabs, SearchTabType } from "@/app/search/components/Tabs";
import { SearchFilterType } from "@/app/search/hooks/useSearch";
import { visiblePrefectureLabels } from "@/app/users/data/presenter";
import { DateRange } from "react-day-picker";
import { useSearchForm } from "@/app/search/hooks/useSearchForm";
import SearchForm from "@/app/search/components/SearchForm";
import SearchFilters from "@/app/search/components/SearchFilters";
import SearchFooter from "@/app/search/components/Footer";
import SearchFilterSheets from "@/app/search/components/SearchFilterSheet";

export default function SearchPage() {
  const headerConfig = useMemo(
    () => ({
      title: "体験・お手伝いを検索",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const methods = useForm({
    defaultValues: {
      searchQuery: "",
      location: "",
      dateRange: undefined,
      guests: 0,
      useTicket: false,
    },
  });

  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<SearchTabType>("activity");
  const [activeForm, setActiveForm] = useState<SearchFilterType>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="container px-4 py-2">
          <SearchTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />
          <FormProvider {...methods}>
            <SearchPageContent
              activeForm={activeForm}
              setActiveForm={setActiveForm}
              selectedTab={selectedTab}
              formatDateRange={formatDateRange}
              prefectureLabels={visiblePrefectureLabels}
              router={router}
            />
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

function SearchPageContent({
  activeForm,
  setActiveForm,
  selectedTab,
  formatDateRange,
  prefectureLabels,
  router,
}: {
  activeForm: SearchFilterType;
  setActiveForm: (f: SearchFilterType) => void;
  selectedTab: SearchTabType;
  formatDateRange: (r: DateRange | undefined) => string;
  prefectureLabels: Record<string, string>;
  router: ReturnType<typeof useRouter>;
}) {
  const {
    location,
    dateRange,
    guests,
    useTicket,
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
    const params = buildSearchResultParams(
      values.searchQuery,
      values.location,
      values.dateRange,
      values.guests,
      values.useTicket,
      selectedTab,
    );
    router.push(`/search/result?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <SearchForm />
      <SearchFilters
        onFilterClick={setActiveForm}
        formatDateRange={formatDateRange}
        prefectureLabels={prefectureLabels}
        location={location}
        dateRange={dateRange}
        guests={guests}
        useTicket={useTicket}
      />
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
        clearActiveFilter={clearActiveFilter}
        getSheetHeight={() => "90vh"}
        prefectures={Object.entries(prefectureLabels).map(([id, name]) => ({ id, name }))}
      />
      <SearchFooter onClear={handleClear} onSearch={handleSearch} />
    </div>
  );
}
