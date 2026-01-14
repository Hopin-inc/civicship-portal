"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";
import { SearchFilterType } from "@/app/[communityId]/search/hooks/useSearch";
import { IPrefecture } from "@/app/[communityId]/search/data/type";
import { Checkbox } from "@/components/ui/checkbox";

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
  usePoints: boolean;
  setUsePoints: (usePoints: boolean) => void;
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
  usePoints,
  setUsePoints,
  clearActiveFilter,
  getSheetHeight,
  prefectures,
}) => {
  const renderFooterButtons = () => (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-background max-w-mobile-l w-full h-16 flex items-center justify-between mx-auto">
      <Button
        onClick={clearActiveFilter}
        variant="link"
        className="text-label-md px-0 underline !text-foreground"
      >
        選択を解除
      </Button>
      <Button onClick={() => setActiveForm(null)} variant="primary" className="px-8 py-3">
        決定
      </Button>
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
            variant="tertiary"
            className={`py-3 rounded-xl text-label-md ${
              location === pref.id
                ? "border-2 border-primary text-primary bg-primary/5 font-bold"
                : "border border-input text-foreground font-medium"
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
        <div className="-mx-6 px-4 flex justify-center">
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
        <SheetTitle>その他の条件を設定</SheetTitle>
      </SheetHeader>
      <div className="space-y-4">
        <p className="text-label-md font-bold">決済手段</p>
        <div className="rounded-xl border px-4 py-3">
          <div className="flex items-start gap-x-2">
            <Checkbox id="use-ticket" checked={useTicket} onCheckedChange={setUseTicket} />
            <div>
              <Label htmlFor="use-ticket" className="text-label-md font-bold">
                チケット利用可
              </Label>
              <p className="text-muted-foreground text-sm mt-1 leading-tight">
                主催者から受け取ったチケットを使って、
                <br />
                無料で参加することができます。
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border px-4 py-3">
          <div className="flex items-start gap-x-2">
            <Checkbox id="use-points" checked={usePoints} onCheckedChange={setUsePoints} />
            <div>
              <Label htmlFor="use-points" className="text-label-md font-bold">
                ポイント利用可
              </Label>
              <p className="text-muted-foreground text-sm mt-1 leading-tight">
                お手伝いで受け取ったポイントを使って、
                <br />
                無料で参加することができます。
              </p>
            </div>
          </div>
        </div>
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
        className={`${getSheetHeight()} rounded-t-3xl overflow-auto max-w-md mx-auto pt-2 px-6`}
        onPointerDownOutside={() => setActiveForm(null)}
      >
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
        </div>
        {renderSheetContent()}
      </SheetContent>
    </Sheet>
  );
};

export default SearchFilterSheets;
