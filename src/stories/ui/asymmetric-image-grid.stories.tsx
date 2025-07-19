import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import AsymmetricImageGrid from "@/components/ui/asymmetric-image-grid";

const meta: Meta<typeof AsymmetricImageGrid> = {
  title: "Shared/UI/AsymmetricImageGrid",
  component: AsymmetricImageGrid,
  tags: ["autodocs"],
  argTypes: {
    remainingCount: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AsymmetricImageGrid>;

const mockImages = [
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop",
    alt: "Mountain landscape",
  },
  {
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=250&fit=crop",
    alt: "Forest path",
  },
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=250&fit=crop",
    alt: "Ocean view",
  },
];

export const Default: Story = {
  args: {
    images: mockImages,
  },
};

export const WithRemainingCount: Story = {
  args: {
    images: mockImages,
    remainingCount: 5,
  },
};

export const SingleImage: Story = {
  args: {
    images: [mockImages[0]],
  },
};

export const TwoImages: Story = {
  args: {
    images: mockImages.slice(0, 2),
  },
};

export const EmptyState: Story = {
  args: {
    images: [],
  },
};

export const LargeGrid: Story = {
  args: {
    images: [
      ...mockImages,
      {
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=250&fit=crop",
        alt: "Desert landscape",
      },
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=250&fit=crop",
        alt: "City skyline",
      },
    ],
    remainingCount: 10,
  },
};

export const CustomClassName: Story = {
  args: {
    images: mockImages,
    className: "border rounded-lg overflow-hidden",
  },
};
