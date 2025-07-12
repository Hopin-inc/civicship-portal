"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { buildSearchResultParams, formatDateRange } from "@/app/search/data/presenter";
import SearchTabs, { SearchTabType } from "@/app/search/components/Tabs";
import { SearchFilterType } from "@/app/search/hooks/useSearch";
import { visiblePrefectureLabels } from "@/app/users/data/presenter";
import { DateRange } from "react-day-picker";
import { useSearchForm } from "@/app/search/hooks/useSearchForm";
import SearchForm from "@/app/search/components/SearchForm";
import SearchFilters from "@/app/search/components/SearchFilters";
import SearchFooter from "@/app/search/components/Footer";
import SearchFilterSheets from "@/app/search/components/SearchFilterSheet";
import { logger } from "@/lib/logging";

export default function SearchPage() {
  const headerConfig = useMemo(
    () => ({
      title: "体験・お手伝いを検索",
      showBackButton: true,
      showLogo: false,
      backTo: "/",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  // タブの状態をuseStateで管理
  const [selectedTab, setSelectedTab] = useState<SearchTabType>(typeParam === "quest" ? "quest" : "activity");
  const [activeForm, setActiveForm] = useState<SearchFilterType>(null);

  // Initialize form with search parameters from URL
  const methods = useForm({
    defaultValues: {
      searchQuery: searchParams.get("q") || "",
      location: searchParams.get("location") || "",
      dateRange: (() => {
        const fromStr = searchParams.get("from");
        const toStr = searchParams.get("to");
        if (fromStr && toStr) {
          const fromDate = new Date(fromStr);
          const toDate = new Date(toStr);
          if (!Number.isNaN(fromDate.valueOf()) && !Number.isNaN(toDate.valueOf())) {
            return {
              from: fromDate,
              to: toDate,
            };
          }
          logger.warn("Invalid date strings in URL", {
            from: fromStr,
            to: toStr,
            component: "SearchPage",
          });
        }
        return undefined; // Default if params not present or dates are invalid
      })(),
      guests: searchParams.get("guests")
        ? ((parsed) => (Number.isNaN(parsed) ? 0 : parsed))(
            parseInt(searchParams.get("guests") as string, 10),
          )
        : 0,
      useTicket: searchParams.get("ticket") === "true",
    },
  });

  // isNoConditionをここで定義
  const values = methods.getValues();
  // isNoConditionのusePointsを除外
  const isNoCondition =
    !values.searchQuery &&
    !values.location &&
    !values.dateRange &&
    !values.guests &&
    !values.useTicket;

  // 初期表示や「条件をクリア」時のみ自動でタブを切り替える
  useEffect(() => {
    if (isNoCondition && selectedTab !== "quest") {
      setSelectedTab("quest");
    }
  }, [isNoCondition]);

  const router = useRouter();
  // const [selectedTab, setSelectedTab] = useState<SearchTabType>("activity");
  // const [activeForm, setActiveForm] = useState<SearchFilterType>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="container px-4 py-2">
          {/* 常に上部にタブを表示（条件ありの場合） */}
          <FormProvider {...methods}>
            {!isNoCondition && (
            <SearchTabs
              selectedTab={selectedTab}
              onTabChange={(tab: SearchTabType) => {
                setSelectedTab(tab);
                // typeパラメータも切り替え
                const params = new URLSearchParams(searchParams.toString());
                params.set("type", tab);
                window.history.replaceState(null, "", `?${params.toString()}`);
              }}
            />
            )}
            <SearchPageContent
              activeForm={activeForm}
              setActiveForm={setActiveForm}
              selectedTab={selectedTab}
              onTabChange={(tab) => {
                setSelectedTab(tab);
                const params = new URLSearchParams(searchParams.toString());
                params.set("type", tab);
                window.history.replaceState(null, "", `?${params.toString()}`);
              }}
              formatDateRange={formatDateRange}
              prefectureLabels={visiblePrefectureLabels}
              router={router}
              type={selectedTab}
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
  onTabChange,
  formatDateRange,
  prefectureLabels,
  router,
  type,
}: {
  activeForm: SearchFilterType;
  setActiveForm: (f: SearchFilterType) => void;
  selectedTab: SearchTabType;
  onTabChange: (tab: SearchTabType) => void;
  formatDateRange: (r: DateRange | undefined) => string;
  prefectureLabels: Record<string, string>;
  router: ReturnType<typeof useRouter>;
  type: "activity" | "quest";
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
    // typeによって遷移先を切り替え
    const nextPath = type === "activity" ? "/activities" : "/quests";
    const params = buildSearchResultParams(
      values.searchQuery,
      values.location,
      values.dateRange,
      values.guests,
      values.useTicket,
      values.usePoints,
      type,
    );
    router.push(`${nextPath}?${params.toString()}`);
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
    <div className="space-y-6 pt-4">
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
        getSheetHeight={() => "90vh"}
        prefectures={Object.entries(prefectureLabels).map(([id, name]) => ({ id, name }))}
      />
      {/* isNoConditionのときだけタブをfooterの上に表示 */}
      {isNoCondition && (
        <div className="fixed bottom-10 left-0 right-0 z-50 bg-background flex justify-center">
          <div className="w-full max-w-mobile-l mx-auto">
            <SearchTabs selectedTab={selectedTab} onTabChange={onTabChange} />
          </div>
        </div>
      )}
      <SearchFooter onClear={handleClear} onSearch={handleSearch} isNoCondition={isNoCondition} />
    </div>
  );
}
