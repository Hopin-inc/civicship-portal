import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const meta: Meta<typeof Calendar> = {
  title: "Shared/UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Basic: Story = {
  args: {
    mode: "single",
    className: "rounded-md border"
  },
};

// Temporarily commented out due to React Hooks in render function ESLint error
// export const Default: Story = {
//   render: () => {
//     const [date, setDate] = useState<Date | undefined>(new Date());
//     
//     return (
//       <Calendar
//         mode="single"
//         selected={date}
//         onSelect={setDate}
//         className="rounded-md border"
//       />
//     );
//   },
// };

// Temporarily commented out due to React Hooks in render function ESLint error
// export const Multiple: Story = {
//   render: () => {
//     const [dates, setDates] = useState<Date[] | undefined>([]);
//     
//     return (
//       <Calendar
//         mode="multiple"
//         selected={dates}
//         onSelect={setDates}
//         className="rounded-md border"
//       />
//     );
//   },
// };

// Temporarily commented out due to React Hooks in render function ESLint error
// export const Range: Story = {
//   render: () => {
//     const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined} | undefined>();
//     
//     return (
//       <Calendar
//         mode="range"
//         selected={dateRange}
//         onSelect={setDateRange as any}
//         className="rounded-md border"
//       />
//     );
//   },
// };

// Temporarily commented out due to React Hooks in render function ESLint error
// export const WithDisabledDates: Story = {
//   render: () => {
//     const [date, setDate] = useState<Date | undefined>();
//     
//     const disabledDays = [
//       new Date(2024, 0, 1),
//       new Date(2024, 0, 15),
//       { from: new Date(2024, 0, 20), to: new Date(2024, 0, 25) }
//     ];
//     
//     return (
//       <Calendar
//         mode="single"
//         selected={date}
//         onSelect={setDate}
//         disabled={disabledDays}
//         className="rounded-md border"
//       />
//     );
//   },
// };

// Temporarily commented out due to React Hooks in render function ESLint error
// export const WithFooter: Story = {
//   render: () => {
//     const [date, setDate] = useState<Date | undefined>(new Date());
//     
//     return (
//       <Calendar
//         mode="single"
//         selected={date}
//         onSelect={setDate}
//         className="rounded-md border"
//         footer={
//           date ? (
//             <p className="text-sm text-muted-foreground mt-2">
//               Selected: {date.toLocaleDateString()}
//             </p>
//           ) : (
//             <p className="text-sm text-muted-foreground mt-2">
//               Please pick a date.
//             </p>
//           )
//         }
//       />
//     );
//   },
// };

// Temporarily commented out due to React Hooks in render function ESLint error
// export const Japanese: Story = {
//   render: () => {
//     const [date, setDate] = useState<Date | undefined>(new Date());
//     
//     return (
//       <Calendar
//         mode="single"
//         selected={date}
//         onSelect={setDate}
//         className="rounded-md border"
//       />
//     );
//   },
// };
