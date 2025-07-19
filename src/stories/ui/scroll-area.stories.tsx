import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "Shared/UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border p-4">
      <div className="space-y-4">
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="text-sm">
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="shrink-0 rounded-md bg-muted p-4 text-sm"
            style={{ width: "150px" }}
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const LongContent: Story = {
  render: () => (
    <ScrollArea className="h-96 w-full rounded-md border p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Long Content Example</h3>
        {Array.from({ length: 100 }, (_, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            This is paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua.
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};
