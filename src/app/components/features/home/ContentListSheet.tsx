import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  X,
  Sparkles,
  Flag,
  PartyPopper,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as UiCalendar } from "@/components/ui/calendar";
import {
  Activity,
  ContentType,
  DateFilter,
  Opportunity,
  Article,
} from "@/types";

type ContentItem = Activity | Opportunity | Article;

type ImageObject = {
  url: string;
  caption?: string;
};

type ContentListSheetProps = {
  items: ContentItem[];
  onItemClick: (item: ContentItem) => void;
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  getContentCounts: () => Record<ContentType, number>;
};

const getItemImages = (item: ContentItem): (string | ImageObject)[] => {
  if ("images" in item && Array.isArray(item.images)) {
    return item.images;
  }
  if ("image" in item && item.image) {
    return [item.image];
  }
  if ("thumbnail" in item && item.thumbnail) {
    return [item.thumbnail];
  }
  return [];
};

const getImageUrl = (image: string | ImageObject | undefined): string => {
  if (!image) return "/placeholder.svg";
  if (typeof image === "string") return image;
  if ("url" in image) return image.url;
  return "/placeholder.svg";
};

export const ContentListSheet = ({
  items,
  onItemClick,
  selectedType,
  onTypeChange,
  dateFilter,
  onDateFilterChange,
  getContentCounts,
}: ContentListSheetProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: dateFilter.startDate || undefined,
    to: dateFilter.endDate || undefined,
  });

  const filterTabs = [
    {
      id: "EXPERIENCE",
      label: "体験",
      count: getContentCounts().EXPERIENCE,
      icon: (props: { isActive: boolean }) => (
        <div
          className={`w-8 h-8 ${
            props.isActive
              ? "bg-[#2563EB] shadow-sm shadow-blue-100/80"
              : "bg-white border border-gray-200 hover:border-blue-200"
          } rounded-xl flex items-center justify-center transition-all duration-200 ${
            props.isActive ? "text-white" : "text-gray-400 hover:text-[#2563EB]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: "QUEST",
      label: "クエスト",
      count: getContentCounts().QUEST,
      icon: (props: { isActive: boolean }) => (
        <div
          className={`w-8 h-8 ${
            props.isActive
              ? "bg-[#2563EB] shadow-sm shadow-blue-100/80"
              : "bg-white border border-gray-200 hover:border-blue-200"
          } rounded-xl flex items-center justify-center transition-all duration-200 ${
            props.isActive ? "text-white" : "text-gray-400 hover:text-[#2563EB]"
          }`}
        >
          <Flag className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: "EVENT",
      label: "イベント",
      count: getContentCounts().EVENT,
      icon: (props: { isActive: boolean }) => (
        <div
          className={`w-8 h-8 ${
            props.isActive
              ? "bg-[#2563EB] shadow-sm shadow-blue-100/80"
              : "bg-white border border-gray-200 hover:border-blue-200"
          } rounded-xl flex items-center justify-center transition-all duration-200 ${
            props.isActive ? "text-white" : "text-gray-400 hover:text-[#2563EB]"
          }`}
        >
          <PartyPopper className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: "ARTICLE",
      label: "記事",
      count: getContentCounts().ARTICLE,
      icon: (props: { isActive: boolean }) => (
        <div
          className={`w-8 h-8 ${
            props.isActive
              ? "bg-[#2563EB] shadow-sm shadow-blue-100/80"
              : "bg-white border border-gray-200 hover:border-blue-200"
          } rounded-xl flex items-center justify-center transition-all duration-200 ${
            props.isActive ? "text-white" : "text-gray-400 hover:text-[#2563EB]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-background rounded-t-3xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center gap-2">
          {/* Filter Tabs */}
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto">
            {filterTabs.map((tab) => {
              const isActive = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTypeChange(tab.id as ContentType)}
                  className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg transition-all duration-200 shrink-0 ${
                    isActive ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  {tab.icon({ isActive })}
                  <div className="flex flex-col items-start">
                    <span
                      className={`text-sm font-bold ${
                        isActive ? "text-[#2563EB]" : "text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isActive ? "text-[#2563EB]" : "text-gray-400"
                      }`}
                    >
                      {tab.count}件
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-gray-200" />

          {/* Date Filter */}
          {selectedType !== "ARTICLE" && (
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className="shrink-0 px-3 py-1.5 border rounded-lg text-sm text-muted-foreground flex items-center gap-2 hover:bg-muted/50">
                  <Calendar className="w-4 h-4" />
                  <span className="flex-1 text-left whitespace-nowrap">
                    {dateFilter.startDate
                      ? format(dateFilter.startDate, "M/d") +
                        (dateFilter.endDate &&
                        dateFilter.endDate !== dateFilter.startDate
                          ? ` - ${format(dateFilter.endDate, "M/d")}`
                          : "")
                      : "日程"}
                  </span>
                  {dateFilter.startDate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDateFilterChange({
                          startDate: null,
                          endDate: null,
                        });
                        setDateRange(undefined);
                      }}
                      className="hover:bg-muted rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <UiCalendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateFilter.startDate || new Date()}
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    onDateFilterChange({
                      startDate: range?.from || null,
                      endDate: range?.to || null,
                    });
                    setCalendarOpen(false);
                  }}
                  numberOfMonths={1}
                  locale={ja}
                  classNames={{
                    day_selected: "bg-[#2563EB] text-white",
                    day_today: "bg-accent text-accent-foreground",
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      {/* Content List */}
      <div className="p-4 space-y-6">
        {items.map((item) => {
          const itemImages = getItemImages(item);
          const isExperience = "schedule" in item && "price" in item;

          return (
            <div
              key={item.id}
              className="space-y-4 cursor-pointer"
              onClick={() => onItemClick(item)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={getImageUrl(itemImages[0])}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium line-clamp-1">{item.title}</h3>
                    <div className="text-sm text-muted-foreground">
                      {isExperience && (
                        <>
                          <span>
                            ¥{(item as Activity).price.toLocaleString()}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {(item as Activity).location.name || "場所未定"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {itemImages.slice(0, 3).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${item.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
