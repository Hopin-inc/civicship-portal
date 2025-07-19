import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const MockPlaceCardsSheet = ({ 
  places, 
  selectedPlaceId, 
  onPlaceSelect 
}: {
  places: any[];
  selectedPlaceId: string | null;
  onPlaceSelect: (id: string) => void;
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (selectedPlaceId) {
      const index = places.findIndex(place => place.id === selectedPlaceId);
      if (index >= 0) {
        setCurrentIndex(index);
      }
    }
  }, [selectedPlaceId, places]);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : places.length - 1;
    setCurrentIndex(newIndex);
    onPlaceSelect(places[newIndex].id);
  };

  const handleNext = () => {
    const newIndex = currentIndex < places.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onPlaceSelect(places[newIndex].id);
  };

  if (!places.length) return null;

  const currentPlace = places[currentIndex];

  return (
    <div className="w-full max-w-md mx-auto bg-white border rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handlePrevious}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={places.length <= 1}
          >
            ←
          </button>
          <div className="text-center">
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {places.length}
            </div>
          </div>
          <button
            onClick={handleNext}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={places.length <= 1}
          >
            →
          </button>
        </div>

        <div className="text-center">
          <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
            {currentPlace.image ? (
              <img 
                src={currentPlace.image} 
                alt={currentPlace.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <span className="text-gray-500">📷</span>
            )}
          </div>
          
          <h3 className="font-bold text-lg mb-1">{currentPlace.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{currentPlace.address}</p>
          
          {currentPlace.headline && (
            <p className="text-sm text-gray-700 mb-2">{currentPlace.headline}</p>
          )}
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>👥 {currentPlace.participantCount}人</span>
            {currentPlace.publicOpportunityCount > 0 && (
              <span>📋 {currentPlace.publicOpportunityCount}件募集中</span>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            もっと見る
          </button>
        </div>
      </div>
    </div>
  );
};

const mockPlaces = [
  {
    id: "place1",
    name: "渋谷コミュニティセンター",
    headline: "地域の交流拠点",
    address: "東京都渋谷区",
    participantCount: 24,
    publicOpportunityCount: 3,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
  },
  {
    id: "place2",
    name: "大阪市民会館",
    headline: "文化活動の中心地",
    address: "大阪府大阪市北区",
    participantCount: 18,
    publicOpportunityCount: 2,
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=200&fit=crop",
  },
  {
    id: "place3",
    name: "横浜みなとみらいホール",
    headline: "みなとみらいの文化施設",
    address: "神奈川県横浜市西区",
    participantCount: 42,
    publicOpportunityCount: 5,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop",
  },
];

const meta: Meta<typeof MockPlaceCardsSheet> = {
  title: "App/Places/PlaceCardsSheet",
  component: MockPlaceCardsSheet,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "拠点カードシート（モック版）。カルーセル形式で拠点カードを表示。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockPlaceCardsSheet>;

export const Default: Story = {
  args: {
    places: mockPlaces,
    selectedPlaceId: null,
    onPlaceSelect: (id: string) => console.log("Selected place:", id),
  },
};

export const WithSelection: Story = {
  args: {
    places: mockPlaces,
    selectedPlaceId: "place2",
    onPlaceSelect: (id: string) => console.log("Selected place:", id),
  },
};

export const SinglePlace: Story = {
  args: {
    places: [mockPlaces[0]],
    selectedPlaceId: "place1",
    onPlaceSelect: (id: string) => console.log("Selected place:", id),
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedId, setSelectedId] = React.useState<string | null>("place1");
    return (
      <MockPlaceCardsSheet 
        places={mockPlaces}
        selectedPlaceId={selectedId}
        onPlaceSelect={setSelectedId}
      />
    );
  },
};
