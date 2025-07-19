import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import SearchFilters from "@/app/search/components/SearchFilters";
import { SearchFilterType } from "@/app/search/hooks/useSearch";
import { DateRange } from "react-day-picker";
import { FormProvider, useForm } from "react-hook-form";

const mockPrefectureLabels: Record<string, string> = {
  kagawa: "香川県",
  tokushima: "徳島県",
  ehime: "愛媛県",
  kochi: "高知県",
  osaka: "大阪府",
  kyoto: "京都府",
  hyogo: "兵庫県",
  nara: "奈良県",
};

const SearchFiltersWrapper = ({
  location = "",
  dateRange = undefined,
  guests = 0,
  useTicket = false,
}: {
  location?: string;
  dateRange?: DateRange | undefined;
  guests?: number;
  useTicket?: boolean;
}) => {
  const form = useForm({
    defaultValues: {
      location,
      dateRange,
      guests,
      useTicket,
    },
  });

  const handleFilterClick = (filter: SearchFilterType) => {
    console.log(`Filter clicked: ${filter}`);
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "日付を追加";
    if (!range.to) return range.from.toLocaleDateString("ja-JP");
    return `${range.from.toLocaleDateString("ja-JP")} - ${range.to.toLocaleDateString("ja-JP")}`;
  };

  return (
    <FormProvider {...form}>
      <SearchFilters
        onFilterClick={handleFilterClick}
        formatDateRange={formatDateRange}
        prefectureLabels={mockPrefectureLabels}
        location={location}
        dateRange={dateRange}
        guests={guests}
        useTicket={useTicket}
      />
    </FormProvider>
  );
};

const meta: Meta<typeof SearchFiltersWrapper> = {
  title: "App/Search/SearchFilters",
  component: SearchFiltersWrapper,
  tags: ["autodocs"],
  argTypes: {
    location: {
      control: "select",
      options: ["", "kagawa", "tokushima", "ehime", "kochi"],
      description: "Selected location",
    },
    guests: {
      control: "number",
      description: "Number of guests",
    },
    useTicket: {
      control: "boolean",
      description: "Whether to use ticket",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SearchFiltersWrapper>;

export const Default: Story = {
  args: {
    location: "",
    dateRange: undefined,
    guests: 0,
    useTicket: false,
  },
};

export const WithLocation: Story = {
  args: {
    location: "kagawa",
    dateRange: undefined,
    guests: 0,
    useTicket: false,
  },
};

export const WithDateRange: Story = {
  args: {
    location: "",
    dateRange: {
      from: new Date("2024-02-15"),
      to: new Date("2024-02-20"),
    },
    guests: 0,
    useTicket: false,
  },
};

export const WithGuests: Story = {
  args: {
    location: "",
    dateRange: undefined,
    guests: 4,
    useTicket: false,
  },
};

export const WithTicket: Story = {
  args: {
    location: "",
    dateRange: undefined,
    guests: 0,
    useTicket: true,
  },
};

export const AllFiltersActive: Story = {
  args: {
    location: "kagawa",
    dateRange: {
      from: new Date("2024-02-15"),
      to: new Date("2024-02-20"),
    },
    guests: 2,
    useTicket: true,
  },
};

export const SingleDateSelected: Story = {
  args: {
    location: "ehime",
    dateRange: {
      from: new Date("2024-02-15"),
      to: undefined,
    },
    guests: 1,
    useTicket: false,
  },
};
