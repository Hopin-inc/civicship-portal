"use client";

import { useRouter } from "next/navigation";
import { Search, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  location?: string;
  from?: string;
  to?: string;
  guests?: string;
}

const PREFECTURE_LABELS: Record<string, string> = {
  KAGAWA: "香川県",
  TOKUSHIMA: "徳島県",
  KOUCHI: "高知県",
  EHIME: "愛媛県",
};
const DEFAULT_LABEL = "四国";

const SearchBox = ({ location, from, to, guests }: SearchFormProps) => {
  const router = useRouter();

  const getLocationText = (location: string | undefined): string => {
    const label = location ? PREFECTURE_LABELS[location] || DEFAULT_LABEL : DEFAULT_LABEL;
    return `${label}の体験`;
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
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (guests) params.set("guests", guests);

    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <Button
      onClick={handleClick}
      variant="tertiary"
      className="flex flex-col w-full max-w-xl rounded-full h-12 px-4 text-left hover:bg-muted transition-colors relative"
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      {!location && !from && !to && !guests ? (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-body-sm text-caption font-medium">タップして検索する</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-sm font-medium text-foreground">{getLocationText(location)}</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">{formatDateRange()}</span>
            </div>
            <span className="text-xs text-muted-foreground mx-1">・</span>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">{getGuestsText()}</span>
            </div>
          </div>
        </div>
      )}
    </Button>
  );
};

export default SearchBox;
