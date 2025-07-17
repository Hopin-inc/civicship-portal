import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const MockAddressMap = ({ 
  address, 
  markerTitle, 
  height = 300, 
  width = "100%",
  zoom = 12,
  latitude,
  longitude,
  placeId,
}: {
  address: string;
  markerTitle?: string;
  height?: number | string;
  width?: number | string;
  zoom?: number;
  latitude?: number;
  longitude?: number;
  placeId: string;
}) => {
  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: "0.5rem",
  };

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center"
      style={containerStyle}
    >
      <div className="text-center p-4">
        <div className="text-lg font-semibold text-gray-700 mb-2">📍 Map Preview</div>
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Address:</strong> {address}</div>
          {markerTitle && <div><strong>Title:</strong> {markerTitle}</div>}
          {latitude && longitude && (
            <div><strong>Coordinates:</strong> {latitude}, {longitude}</div>
          )}
          <div><strong>Zoom:</strong> {zoom}</div>
          <div><strong>Place ID:</strong> {placeId}</div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          (Mock component - Google Maps integration disabled for Storybook)
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockAddressMap> = {
  title: "Shared/Components/AddressMap",
  component: MockAddressMap,
  tags: ["autodocs"],
  argTypes: {
    address: {
      control: "text",
      description: "Address to display on the map",
    },
    markerTitle: {
      control: "text",
      description: "Title for the map marker",
    },
    height: {
      control: "number",
      description: "Height of the map container",
    },
    width: {
      control: "text",
      description: "Width of the map container",
    },
    zoom: {
      control: { type: "range", min: 1, max: 20, step: 1 },
      description: "Map zoom level",
    },
    latitude: {
      control: "number",
      description: "Fallback latitude coordinate",
    },
    longitude: {
      control: "number",
      description: "Fallback longitude coordinate",
    },
    placeId: {
      control: "text",
      description: "Google Places ID",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MockAddressMap>;

export const Default: Story = {
  args: {
    address: "東京都渋谷区渋谷1-1-1",
    markerTitle: "渋谷駅",
    placeId: "ChIJXSModoAGGGARILWiCfeu2M0",
  },
};

export const WithCoordinates: Story = {
  args: {
    address: "大阪府大阪市北区梅田1-1-1",
    markerTitle: "梅田駅",
    latitude: 34.7024,
    longitude: 135.4959,
    placeId: "ChIJXSModoAGGGARILWiCfeu2M1",
  },
};

export const CustomSize: Story = {
  args: {
    address: "神奈川県横浜市西区みなとみらい1-1-1",
    markerTitle: "みなとみらい",
    height: 400,
    width: "100%",
    zoom: 15,
    placeId: "ChIJXSModoAGGGARILWiCfeu2M2",
  },
};

export const SmallMap: Story = {
  args: {
    address: "京都府京都市東山区清水1-294",
    markerTitle: "清水寺",
    height: 200,
    width: "300px",
    zoom: 16,
    placeId: "ChIJXSModoAGGGARILWiCfeu2M3",
  },
};

export const HighZoom: Story = {
  args: {
    address: "東京都千代田区丸の内1-1-1",
    markerTitle: "東京駅",
    zoom: 18,
    latitude: 35.6812,
    longitude: 139.7671,
    placeId: "ChIJXSModoAGGGARILWiCfeu2M4",
  },
};

export const MultipleExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">イベント会場</h3>
        <MockAddressMap
          address="東京都渋谷区神宮前6-35-3"
          markerTitle="表参道ヒルズ"
          height={250}
          zoom={16}
          placeId="ChIJXSModoAGGGARILWiCfeu2M5"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">集合場所</h3>
        <MockAddressMap
          address="東京都新宿区新宿3-38-1"
          markerTitle="新宿駅南口"
          height={200}
          zoom={17}
          placeId="ChIJXSModoAGGGARILWiCfeu2M6"
        />
      </div>
    </div>
  ),
};
