"use client";

import { useState } from "react";
import { Search, Calendar, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import SearchModal from "@/components/search/SearchModal";
import { FormProvider, useForm } from "react-hook-form";

interface SearchFormProps {
  location?: string;
  from?: string;
  to?: string;
  guests?: string;
  q?: string;
  type?: string;
  ticket?: string;
  points?: string;
}

const PREFECTURE_LABELS: Record<string, string> = {
  KAGAWA: "香川県",
  TOKUSHIMA: "徳島県",
  KOUCHI: "高知県",
  EHIME: "愛媛県",
};
const DEFAULT_LABEL = "四国";

const SearchBox = ({ location, from, to, guests, q, type, ticket, points }: SearchFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getLocationText = (location: string | undefined, isDefault: boolean = false): string => {
    const label = location ? PREFECTURE_LABELS[location] || DEFAULT_LABEL : DEFAULT_LABEL;
    return isDefault ? label : `${label}の体験`;
  };

  const getKeywordText = (keyword?: string, location?: string): string => {
    if (keyword) {
      return keyword;
    }
    if (location) {
      return getLocationText(location, false); // 例: "香川県の体験"
    }
    return "すべての体験";
  };

  const formatDateRange = () => {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    if (!fromDate) return "日付未定";
    if (!toDate) {
      return format(fromDate, "M/d", { locale: ja });
    }
    return `${format(fromDate, "M/d", { locale: ja })}〜${format(toDate, "M/d", { locale: ja })}`;
  };

  const getGuestsText = () => {
    if (!guests) return "人数未定";
    return `${guests}人`;
  };

  const handleClick = () => {
    setIsModalOpen(true);
  };
  
  const badgeCount = [ticket, points].filter(Boolean).length;

  const methods = useForm({
    defaultValues: {
      searchQuery: q || "",
      location: location || "",
      dateRange: (() => {
        const fromStr = from;
        const toStr = to;
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
        if (!guests) return 0;
        const parsed = parseInt(guests, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
      })(),
      useTicket: ticket === "true",
    },
  });

  return (
    <>
      <Button
        onClick={handleClick}
        variant="tertiary"
        className="flex flex-col w-full max-w-xl rounded-full h-12 px-4 text-left hover:bg-muted transition-colors relative"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        {!location && !from && !to && !guests && !q && !points && !ticket ? (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-body-sm text-caption font-medium">タップして検索する</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
          {/* 上部テキストを画像通りに表示 */}
          <div className="flex items-center justify-center gap-2">
            <span>{getKeywordText(q, location)}</span>
            {badgeCount > 0 && (
              <span className="ml-1 rounded-full bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5">
                +{badgeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">{getLocationText(location, true)}</span>
            </div>
            <span className="text-xs text-muted-foreground mx-1">・</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">{formatDateRange()}</span>
            </div>
            <span className="text-xs text-muted-foreground mx-1">・</span>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">{getGuestsText()}</span>
            </div>
          </div>
        </div>
        )}
      </Button>
      <FormProvider {...methods}>
        <SearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={type}
        />
      </FormProvider>
    </>
  );
};

export default SearchBox;
