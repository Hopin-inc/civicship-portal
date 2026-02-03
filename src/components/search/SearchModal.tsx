"use client";

import { useState, useMemo } from "react";
import { useAppRouter } from "@/lib/navigation";
import { buildSearchResultParams, formatDateRange } from "@/app/search/data/presenter";
import SearchTabs, { SearchTabType } from "@/app/search/components/Tabs";
import { SearchFilterType } from "@/app/search/hooks/useSearch";
import { prefectureOptions } from "@/shared/prefectures/constants";
import { useSearchForm } from "@/app/search/hooks/useSearchForm";
import SearchForm from "@/app/search/components/SearchForm";
import SearchFilters from "@/app/search/components/SearchFilters";
import SearchFooter from "@/app/search/components/Footer";
import SearchFilterSheets from "@/app/search/components/SearchFilterSheet";
import { useFeatureCheck } from "@/hooks/useFeatureCheck";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getPrefectureKey } from "@/lib/i18n/prefectures";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: string;
}

export default function SearchModal({ isOpen, onClose, type }: SearchModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useAppRouter();
  const shouldShowQuests = useFeatureCheck("quests");

  const defaultTab: SearchTabType = shouldShowQuests && type === "quest" ? "quest" : "activity";
  const [selectedTab, setSelectedTab] = useState<SearchTabType>(defaultTab);
  const [activeForm, setActiveForm] = useState<SearchFilterType>(null);

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

  const values = getValues();
  const isNoCondition =
    !values.searchQuery &&
    !values.location &&
    !values.dateRange &&
    !values.guests &&
    !values.useTicket &&
    !values.usePoints;

  const prefectureLabels = useMemo(
    () =>
      Object.fromEntries(
        prefectureOptions.map((value) => [value, t(getPrefectureKey(value))])
      ),
    [t, locale]
  );

  const prefectures = useMemo(
    () =>
      prefectureOptions.map((value) => ({
        id: value,
        name: t(getPrefectureKey(value)),
      })),
    [t, locale]
  );

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

  const clearActiveFilter = () => {
    if (activeForm) {
      baseClearActiveFilter(activeForm);
    }
    setActiveForm(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center z-50">
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
          <div className="space-y-4">
            {shouldShowQuests && (
              <SearchTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />
            )}
            <SearchForm onSearch={handleSearch} />
            <SearchFilters
              onFilterClick={setActiveForm}
              formatDateRange={formatDateRange}
              prefectureLabels={prefectureLabels}
              location={location}
              dateRange={dateRange}
              guests={guests}
              useTicket={useTicket}
              usePoints={usePoints}
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
              usePoints={usePoints}
              setUsePoints={(val) => setValue("usePoints", val)}
              clearActiveFilter={clearActiveFilter}
              getSheetHeight={() => "60vh"}
              prefectures={prefectures}
            />
            <div className="border-t">
              <SearchFooter
                onClear={handleClear}
                onSearch={handleSearch}
                isNoCondition={isNoCondition}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
