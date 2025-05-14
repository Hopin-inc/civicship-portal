"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";
import { SearchFilterType } from "@/app/search/hooks/useSearch";
import { IPrefecture } from "@/app/search/data/type";

interface FilterSheetsProps {
  activeForm: SearchFilterType;
  setActiveForm: (form: SearchFilterType) => void;
  location: string;
  setLocation: (location: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
  useTicket: boolean;
  setUseTicket: (useTicket: boolean) => void;
  clearActiveFilter: () => void;
  getSheetHeight: () => string;
  prefectures: IPrefecture[];
}

const SearchFilterSheets: React.FC<FilterSheetsProps> = ({
  activeForm,
  setActiveForm,
  location,
  setLocation,
  dateRange,
  setDateRange,
  guests,
  setGuests,
  useTicket,
  setUseTicket,
  clearActiveFilter,
  getSheetHeight,
  prefectures,
}) => {
  const renderFooterButtons = () => (
    <div className="absolute bottom-0 left-0 right-0 bg-background p-4">
      <div className="flex justify-between items-center">
        <Button
          onClick={clearActiveFilter}
          variant="link"
          className="text-muted-foreground text-sm"
        >
          選択を解除
        </Button>
        <Button onClick={() => setActiveForm(null)} variant="primary" className="px-8 py-3">
          決定
        </Button>
      </div>
    </div>
  );

  const renderLocationContent = () => (
    <div className="h-full pb-20 relative">
      <SheetHeader className="text-left pb-6">
        <SheetTitle>場所を選択</SheetTitle>
      </SheetHeader>
      <div className="grid grid-cols-2 gap-2">
        {prefectures.map((pref) => (
          <Button
            key={pref.id}
            onClick={() => {
              setLocation(pref.id);
            }}
            variant={location === pref.id ? "primary" : "tertiary"}
            className={`py-3 ${
              location === pref.id ? "text-primary bg-primary-foreground" : "text-foreground"
            }`}
          >
            {pref.name}
          </Button>
        ))}
      </div>
      {renderFooterButtons()}
    </div>
  );

  const renderDateContent = () => (
    <div className="h-full flex flex-col relative">
      <SheetHeader className="text-left pb-6">
        <SheetTitle>日付を選択</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-auto pb-24">
        <div className="-mx-6 px-4">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            fromDate={new Date()}
          />
        </div>
      </div>
      {renderFooterButtons()}
    </div>
  );

  const renderGuestsContent = () => (
    <div className="h-full pb-16 relative">
      <SheetHeader className="text-left pb-4">
        <SheetTitle>参加人数を選択</SheetTitle>
      </SheetHeader>
      <div className="flex items-center justify-center space-x-8">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setGuests(Math.max(0, guests - 1));
          }}
          variant="tertiary"
          size="icon"
          className="p-2"
        >
          <Minus className="h-6 w-6 text-gray-400" />
        </Button>
        <span className="text-2xl font-medium w-8 text-center">{guests}</span>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setGuests(guests + 1);
          }}
          variant="tertiary"
          size="icon"
          className="p-2"
        >
          <Plus className="h-6 w-6 text-gray-400" />
        </Button>
      </div>
      {renderFooterButtons()}
    </div>
  );

  const renderOtherContent = () => (
    <div className="h-full pb-20 relative">
      <SheetHeader className="text-left pb-6">
        <SheetTitle>その他の条件</SheetTitle>
      </SheetHeader>
      <div className="space-y-4">
        <Label className="flex items-center space-x-2">
          <Input
            type="checkbox"
            checked={useTicket}
            onChange={(e) => setUseTicket(e.target.checked)}
            className="h-5 w-5"
          />
          <span className="text-gray-700">チケットで支払える</span>
        </Label>
      </div>
      {renderFooterButtons()}
    </div>
  );

  const renderSheetContent = () => {
    switch (activeForm) {
      case "location":
        return renderLocationContent();
      case "date":
        return renderDateContent();
      case "guests":
        return renderGuestsContent();
      case "other":
        return renderOtherContent();
      default:
        return null;
    }
  };

  return (
    <Sheet open={activeForm !== null} onOpenChange={(open) => !open && setActiveForm(null)}>
      <SheetContent
        side="bottom"
        className={`${getSheetHeight()} rounded-t-3xl overflow-auto max-w-md mx-auto`}
        onPointerDownOutside={() => setActiveForm(null)}
      >
        {renderSheetContent()}
      </SheetContent>
    </Sheet>
  );
};

export default SearchFilterSheets;
