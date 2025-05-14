import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { buildSearchParams, formatDateRange } from "@/app/search/data/presenter";
import { useState } from "react";
import { SearchTabType } from "@/app/search/components/Tabs";

export type SearchFilterType = "location" | "date" | "guests" | "other" | null;

export const useSearch = () => {
  const router = useRouter();
  const { getValues, setValue } = useFormContext(); // ← ここ重要

  const [selectedTab, setSelectedTab] = useState<SearchTabType>("activity");
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
    const params = buildSearchParams(
      values.searchQuery,
      values.location,
      values.dateRange,
      values.guests,
      values.useTicket,
      selectedTab,
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
    selectedTab,
    setSelectedTab,
    activeForm,
    setActiveForm,
    handleClear,
    handleSearch,
    clearActiveFilter,
    formatDateRange,
  };
};
