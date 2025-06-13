"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { MapPin, Calendar as CalendarIcon, Users, Tags } from "lucide-react";
import { SearchFilterType } from "@/app/search/hooks/useSearch";
import { DateRange } from "react-day-picker";
import { FormItem, FormField, FormControl } from "@/components/ui/form";
import FilterButton from "@/app/search/components/Button";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

interface SearchFiltersProps {
  onFilterClick: (filter: SearchFilterType) => void;
  formatDateRange: (range: DateRange | undefined) => string;
  prefectureLabels: Record<string, string>;
  location: string;
  dateRange: DateRange | undefined;
  guests: number;
  useTicket: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFilterClick,
  formatDateRange,
  prefectureLabels,
  location,
  dateRange,
  guests,
  useTicket,
}) => {
  const { control } = useFormContext();

  return (
    <div className="bg-background rounded-xl overflow-hidden">
      {COMMUNITY_ID === "neo88" && (
        <FormField
          control={control}
          name="location"
          render={() => (
            <FormItem>
              <FormControl>
                <FilterButton
                  icon={<MapPin className="h-4 w-4" />}
                  label="場所"
                  value={location ? (prefectureLabels[location] ?? "不明な場所") : "場所を指定"}
                  active={!!location}
                  onClick={() => onFilterClick("location")}
                  className="rounded-t-xl border-b-0"
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="dateRange"
        render={() => (
          <FormItem>
            <FormControl>
              <FilterButton
                icon={<CalendarIcon className="h-4 w-4" />}
                label="日付"
                value={dateRange?.from ? formatDateRange(dateRange) : "日付を追加"}
                active={!!dateRange?.from}
                onClick={() => onFilterClick("date")}
                className="border-b-0"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="guests"
        render={() => (
          <FormItem>
            <FormControl>
              <FilterButton
                icon={<Users className="h-4 w-4" />}
                label="人数"
                value={guests > 0 ? `${guests}人` : "人数を指定"}
                active={guests > 0}
                onClick={() => onFilterClick("guests")}
                className="border-b-0"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="useTicket"
        render={() => (
          <FormItem>
            <FormControl>
              <FilterButton
                icon={<Tags className="h-4 w-4" />}
                label="その他の条件"
                value=""
                active={useTicket}
                onClick={() => onFilterClick("other")}
                verticalLayout={true}
                className="rounded-b-xl"
              >
                {useTicket && "チケットで支払える"}
              </FilterButton>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default SearchFilters;
