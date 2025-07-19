import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const MockMapComponent = ({ 
  placePins, 
  selectedPlaceId, 
  onPlaceSelect,
  onRecenterReady 
}: {
  placePins: any[];
  selectedPlaceId: string | null;
  onPlaceSelect: (id: string | null) => void;
  onRecenterReady?: (fn: () => void) => void;
}) => {
  React.useEffect(() => {
    if (onRecenterReady) {
      onRecenterReady(() => console.log("Recenter to selected marker"));
    }
  }, [onRecenterReady]);

  return (
    <div className="w-full h-96 bg-gray-100 border rounded-lg flex flex-col items-center justify-center relative">
      <div className="text-center mb-4">
        <div className="text-lg font-bold mb-2">Google Maps (Mock)</div>
        <div className="text-sm text-gray-600 mb-2">
          {placePins?.length || 0} places, selected: {selectedPlaceId || "none"}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 max-w-md">
        {placePins?.slice(0, 4).map((pin, index) => (
          <button
            key={pin.id}
            onClick={() => onPlaceSelect(pin.id)}
            className={`p-2 text-xs border rounded ${
              selectedPlaceId === pin.id 
                ? 'bg-blue-500 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            📍 {pin.name || `Place ${index + 1}`}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onPlaceSelect(null)}
        className="mt-4 px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
      >
        Clear Selection
      </button>
    </div>
  );
};

const mockPlacePins = [
  {
    id: "place1",
    name: "渋谷コミュニティセンター",
    latitude: 35.6762,
    longitude: 139.6503,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop",
    host: {
      id: "host1",
      name: "田中太郎",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
    },
  },
  {
    id: "place2",
    name: "大阪市民会館",
    latitude: 34.6937,
    longitude: 135.5023,
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=100&h=100&fit=crop",
    host: {
      id: "host2",
      name: "佐藤花子",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop",
    },
  },
  {
    id: "place3",
    name: "横浜みなとみらいホール",
    latitude: 35.4564,
    longitude: 139.6317,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop",
    host: {
      id: "host3",
      name: "山田次郎",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
    },
  },
];

const meta: Meta<typeof MockMapComponent> = {
  title: "App/Places/MapComponent",
  component: MockMapComponent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Google Maps統合コンポーネント（モック版）。拠点のマーカー表示と選択機能。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockMapComponent>;

export const Default: Story = {
  args: {
    placePins: mockPlacePins,
    selectedPlaceId: null,
    onPlaceSelect: (id: string | null) => console.log("Selected place:", id),
    onRecenterReady: (fn: () => void) => console.log("Recenter function ready"),
  },
};

export const WithSelection: Story = {
  args: {
    placePins: mockPlacePins,
    selectedPlaceId: "place1",
    onPlaceSelect: (id: string | null) => console.log("Selected place:", id),
    onRecenterReady: (fn: () => void) => console.log("Recenter function ready"),
  },
};

export const SinglePlace: Story = {
  args: {
    placePins: [mockPlacePins[0]],
    selectedPlaceId: null,
    onPlaceSelect: (id: string | null) => console.log("Selected place:", id),
    onRecenterReady: (fn: () => void) => console.log("Recenter function ready"),
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    return (
      <MockMapComponent 
        placePins={mockPlacePins}
        selectedPlaceId={selectedId}
        onPlaceSelect={setSelectedId}
        onRecenterReady={(fn) => console.log("Recenter function ready")}
      />
    );
  },
};
