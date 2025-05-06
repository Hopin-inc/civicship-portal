
import React from 'react';
import { Minus, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';
import { ja } from 'date-fns/locale';
import { SearchFilterType, Prefecture } from '@/hooks/features/search/useSearch';

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
  prefectures: Prefecture[];
}

/**
 * Component for filter sheets (location, date, guests, other)
 */
export const FilterSheets: React.FC<FilterSheetsProps> = ({
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
  prefectures
}) => {
  const renderFooterButtons = () => (
    <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
      <div className="flex justify-between items-center">
        <Button
          onClick={clearActiveFilter}
          variant="link"
          className="text-gray-500 text-sm"
        >
          選択を解除
        </Button>
        <Button
          onClick={() => setActiveForm(null)}
          variant="primary"
          className="px-8 py-3"
        >
          決定
        </Button>
      </div>
    </div>
  );

  const renderSheetContent = () => {
    if (!activeForm) return null;

    const content = {
      location: (
        <div className="h-full pb-20 relative">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>
              <div className="flex items-center">
                <span className="text-lg font-bold">場所を選択</span>
              </div>
            </SheetTitle>
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
                  location === pref.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-900'
                }`}
              >
                {pref.name}
              </Button>
            ))}
          </div>
          {renderFooterButtons()}
        </div>
      ),
      date: (
        <div className="h-full flex flex-col relative">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>
              <div className="flex items-center">
                <span className="text-lg font-bold">日付を選択</span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto pb-24">
            <div className="-mx-6 px-4">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                locale={ja}
                className="w-full"
                fromDate={new Date()}
                numberOfMonths={6}
                showOutsideDays={false}
                classNames={{
                  months: "space-y-8",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-xl font-medium",
                  caption_label: "text-lg font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-between mb-2",
                  head_cell: "text-gray-500 w-10 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2 justify-between",
                  cell: "relative p-0 text-center text-[16px] w-10",
                  day: "h-10 w-10 p-0 font-normal hover:bg-gray-100 flex items-center justify-center rounded-full",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-600 focus:bg-blue-600",
                  day_today: "bg-gray-100",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-gray-400 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                  IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                }}
                formatters={{
                  formatCaption: (date) => {
                    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
                  }
                }}
              />
            </div>
          </div>
          {renderFooterButtons()}
        </div>
      ),
      guests: (
        <div className="h-full pb-16 relative">
          <SheetHeader className="text-left pb-4">
            <SheetTitle>
              <div className="flex items-center">
                <span className="text-lg font-bold">参加人数を選択</span>
              </div>
            </SheetTitle>
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
      ),
      other: (
        <div className="h-full pb-20 relative">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>
              <div className="flex items-center">
                <span className="text-lg font-bold">その他の条件</span>
              </div>
            </SheetTitle>
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
      ),
    }[activeForm];

    return content;
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

export default FilterSheets;
