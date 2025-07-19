import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const meta: Meta<typeof Toaster> = {
  title: "Shared/UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div>
      <Toaster />
      <div className="space-x-2">
        <Button onClick={() => toast("Hello World!")}>
          Show Toast
        </Button>
        <Button onClick={() => toast.success("Success message!")}>
          Success
        </Button>
        <Button onClick={() => toast.error("Error message!")}>
          Error
        </Button>
        <Button onClick={() => toast.warning("Warning message!")}>
          Warning
        </Button>
        <Button onClick={() => toast.info("Info message!")}>
          Info
        </Button>
      </div>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast with Action
      </Button>
    </div>
  ),
};

export const PromiseToast: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() => {
          const myPromise = Promise.resolve("Success!");
          
          toast.promise(myPromise, {
            loading: 'Loading...',
            success: () => {
              return `Data has been loaded`;
            },
            error: 'Error loading data',
          });
        }}
      >
        Show Promise Toast
      </Button>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast("Custom styled toast", {
            description: "This toast has custom styling",
            duration: 5000,
            style: {
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              color: 'white',
              border: 'none',
            },
          })
        }
      >
        Custom Style Toast
      </Button>
    </div>
  ),
};

export const Positioning: Story = {
  render: () => (
    <div>
      <Toaster position="top-center" />
      <div className="space-x-2">
        <Button onClick={() => toast("Top Center Toast")}>
          Top Center
        </Button>
      </div>
    </div>
  ),
};
