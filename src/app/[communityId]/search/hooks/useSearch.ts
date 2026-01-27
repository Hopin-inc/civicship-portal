import { useFormContext } from "react-hook-form";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";
import { buildSearchResultParams, formatDateRange } from "@/app/[communityId]/search/data/presenter";
import { useState } from "react";
// import { SearchTabType } from "@/app/[communityId]/search/components/Tabs";

export type SearchFilterType = "location" | "date" | "guests" | "other" | null;

export const useSearch = () => {
  const router = useCommunityRouter();
  const { getValues, setValue } = useFormContext(); // ← ここ重要

  // const [selectedTab, setSelectedTab] = useState<SearchTabType>("activity");
  const [activeForm, setActiveForm] = useState<SearchFilterType>(null);

  const handleClear = () => {
    setValue("location", "");
    setValue("dateRange", undefined);
    setValue("guests", 0);
    setValue("useTicket", false);
    setActiveForm(null);
  };

  const handleSearch = () => {
    const values = getValues(); // RHFの値を取得
    const params = buildSearchResultParams(
      values.searchQuery,
      values.location,
      values.dateRange,
      values.guests,
      values.useTicket,
      values.usePoints,
      "activity",
      // selectedTab,
    );
    router.push(`/search/result?${params.toString()}`);
  };

  const clearActiveFilter = () => {
    const filterKey = activeForm;
    if (!filterKey) return;
    switch (filterKey) {
      case "location":
        setValue("location", "");
        break;
      case "date":
        setValue("dateRange", undefined);
        break;
      case "guests":
        setValue("guests", 0);
        break;
      case "other":
        setValue("useTicket", false);
        break;
    }
  };

  return {
    // selectedTab,
    // setSelectedTab,
    activeForm,
    setActiveForm,
    handleClear,
    handleSearch,
    clearActiveFilter,
    formatDateRange,
  };
};
