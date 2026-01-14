"use client";

import { useFormContext } from "react-hook-form";
import { SearchFilterType } from "@/app/search/hooks/useSearch";
import { DateRange } from "react-day-picker";

export function useSearchForm() {
  const { setValue, watch, getValues } = useFormContext();

  const location = watch("location") as string;
  const dateRange = watch("dateRange") as DateRange | undefined;
  const guests = watch("guests") as number;
  const useTicket = watch("useTicket") as boolean;
  const usePoints = watch("usePoints") as boolean;

  const handleClear = () => {
    setValue("location", "");
    setValue("dateRange", undefined);
    setValue("guests", 1);
    setValue("useTicket", false);
    setValue("usePoints", false);
    setValue("type", "activity");
  };

  const baseClearActiveFilter = (activeForm: SearchFilterType) => {
    switch (activeForm) {
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
    location,
    dateRange,
    guests,
    useTicket,
    usePoints,
    handleClear,
    baseClearActiveFilter,
    getValues,
    setValue,
  };
}
