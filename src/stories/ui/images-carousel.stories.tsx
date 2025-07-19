import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import ImagesCarousel from "@/components/ui/images-carousel";

const meta: Meta<typeof ImagesCarousel> = {
  title: "Shared/UI/ImagesCarousel",
  component: ImagesCarousel,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImagesCarousel>;

const mockImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=480&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=480&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=480&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=480&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=480&fit=crop",
];

export const Default: Story = {
  args: {
    images: mockImages,
    title: "Beautiful Landscapes",
  },
};

export const SingleImage: Story = {
  args: {
    images: [mockImages[0]],
    title: "Single Image",
  },
};

export const TwoImages: Story = {
  args: {
    images: mockImages.slice(0, 2),
    title: "Two Images",
  },
};

export const ManyImages: Story = {
  args: {
    images: [
      ...mockImages,
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=480&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=480&fit=crop",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=480&fit=crop",
    ],
    title: "Gallery with Many Images",
  },
};

export const ActivityGallery: Story = {
  args: {
    images: mockImages,
    title: "Community Activity Photos",
  },
};

export const EventPhotos: Story = {
  args: {
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=480&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=480&fit=crop",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=480&fit=crop",
    ],
    title: "Event Highlights",
  },
};
