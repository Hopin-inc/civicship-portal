import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import SearchFilterSheets from "@/app/search/components/SearchFilterSheet";
import { SearchFilterType } from "@/app/search/hooks/useSearch";
import { IPrefecture } from "@/app/search/data/type";
import { DateRange } from "react-day-picker";
import MainContent from "@/components/layout/MainContent";

const mockPrefectures: IPrefecture[] = [
  { id: "kagawa", name: "香川県" },
  { id: "tokushima", name: "徳島県" },
  { id: "ehime", name: "愛媛県" },
  { id: "kochi", name: "高知県" },
  { id: "osaka", name: "大阪府" },
  { id: "kyoto", name: "京都府" },
  { id: "hyogo", name: "兵庫県" },
  { id: "nara", name: "奈良県" },
];

const SearchFilterSheetsWrapper = ({ 
  initialActiveForm = null,
  initialLocation = "",
  initialDateRange = undefined,
  initialGuests = 0,
  initialUseTicket = false,
}: {
  initialActiveForm?: SearchFilterType;
  initialLocation?: string;
  initialDateRange?: DateRange | undefined;
  initialGuests?: number;
  initialUseTicket?: boolean;
}) => {
  const [activeForm, setActiveForm] = useState<SearchFilterType>(initialActiveForm);
  const [location, setLocation] = useState(initialLocation);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
  const [guests, setGuests] = useState(initialGuests);
  const [useTicket, setUseTicket] = useState(initialUseTicket);

  const clearActiveFilter = () => {
    switch (activeForm) {
      case "location":
        setLocation("");
        break;
      case "date":
        setDateRange(undefined);
        break;
      case "guests":
        setGuests(0);
        break;
      case "other":
        setUseTicket(false);
        break;
    }
  };

  const getSheetHeight = () => {
    switch (activeForm) {
      case "location":
        return "h-[400px]";
      case "date":
        return "h-[500px]";
      case "guests":
        return "h-[300px]";
      case "other":
        return "h-[250px]";
      default:
        return "h-[400px]";
    }
  };

  return (
    <>
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">フィルターシートのテスト</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveForm("location")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            場所フィルター
          </button>
          <button
            onClick={() => setActiveForm("date")}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            日付フィルター
          </button>
          <button
            onClick={() => setActiveForm("guests")}
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            人数フィルター
          </button>
          <button
            onClick={() => setActiveForm("other")}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            その他フィルター
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p>選択中の場所: {location || "未選択"}</p>
          <p>選択中の日付: {dateRange?.from ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString() || ""}` : "未選択"}</p>
          <p>参加人数: {guests}人</p>
          <p>チケット利用: {useTicket ? "はい" : "いいえ"}</p>
        </div>
      </div>
      
      <SearchFilterSheets
        activeForm={activeForm}
        setActiveForm={setActiveForm}
        location={location}
        setLocation={setLocation}
        dateRange={dateRange}
        setDateRange={setDateRange}
        guests={guests}
        setGuests={setGuests}
        useTicket={useTicket}
        setUseTicket={setUseTicket}
        clearActiveFilter={clearActiveFilter}
        getSheetHeight={getSheetHeight}
        prefectures={mockPrefectures}
      />
    </>
  );
};

const meta: Meta<typeof SearchFilterSheetsWrapper> = {
  title: "App/Search/SearchFilterSheet",
  component: SearchFilterSheetsWrapper,
  tags: ["autodocs"],
  argTypes: {
    initialActiveForm: {
      control: "select",
      options: [null, "location", "date", "guests", "other"],
      description: "Initially active filter form",
    },
    initialLocation: {
      control: "text",
      description: "Initial location selection",
    },
    initialGuests: {
      control: "number",
      description: "Initial guest count",
    },
    initialUseTicket: {
      control: "boolean",
      description: "Initial ticket usage setting",
    },
  },
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <MainContent>
        <Story />
      </MainContent>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SearchFilterSheetsWrapper>;

export const Default: Story = {
  args: {
    initialActiveForm: null,
    initialLocation: "",
    initialGuests: 0,
    initialUseTicket: false,
  },
};

export const LocationFilter: Story = {
  args: {
    initialActiveForm: "location",
    initialLocation: "",
    initialGuests: 0,
    initialUseTicket: false,
  },
};

export const DateFilter: Story = {
  args: {
    initialActiveForm: "date",
    initialLocation: "",
    initialGuests: 0,
    initialUseTicket: false,
  },
};

export const GuestsFilter: Story = {
  args: {
    initialActiveForm: "guests",
    initialLocation: "",
    initialGuests: 2,
    initialUseTicket: false,
  },
};

export const OtherFilter: Story = {
  args: {
    initialActiveForm: "other",
    initialLocation: "",
    initialGuests: 0,
    initialUseTicket: true,
  },
};

export const WithPreselectedValues: Story = {
  args: {
    initialActiveForm: null,
    initialLocation: "kagawa",
    initialGuests: 4,
    initialUseTicket: true,
  },
};
