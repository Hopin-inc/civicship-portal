import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { MapPin } from "lucide-react";

const GqlOpportunityCategory = {
  Activity: "ACTIVITY",
  Event: "EVENT",
  Quest: "QUEST",
} as const;

type GqlOpportunityCategory = (typeof GqlOpportunityCategory)[keyof typeof GqlOpportunityCategory];

interface ActivityCard {
  id: string;
  communityId: string;
  category: GqlOpportunityCategory;
  title: string;
  images: string[];
  location: string;
  feeRequired: number | null;
  hasReservableTicket: boolean;
}

const mockFeaturedActivities: ActivityCard[] = [
  {
    id: "featured-1",
    communityId: "neo88",
    category: GqlOpportunityCategory.Activity,
    title: "四国遍路体験ツアー",
    images: ["https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop"],
    location: "香川県善通寺市",
    feeRequired: 8000,
    hasReservableTicket: true,
  },
  {
    id: "featured-2",
    communityId: "neo88",
    category: GqlOpportunityCategory.Event,
    title: "瀬戸内海アート巡り",
    images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop"],
    location: "香川県直島町",
    feeRequired: 5500,
    hasReservableTicket: true,
  },
  {
    id: "featured-3",
    communityId: "neo88",
    category: GqlOpportunityCategory.Activity,
    title: "讃岐うどん作り体験",
    images: ["https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&h=600&fit=crop"],
    location: "香川県高松市",
    feeRequired: 3500,
    hasReservableTicket: true,
  },
];

const MockFeaturedCard = ({ opportunity, size = "large" }: { opportunity: ActivityCard; size?: "large" | "medium" }) => {
  const { id, title, feeRequired, location, images, hasReservableTicket } = opportunity;
  
  const cardHeight = size === "large" ? "h-[300px]" : "h-[200px]";
  const titleSize = size === "large" ? "text-xl" : "text-lg";

  return (
    <div className="relative w-full group cursor-pointer">
      <div className={`w-full ${cardHeight} overflow-hidden relative bg-gray-200 rounded-lg`}>
        {hasReservableTicket && (
          <div className="absolute top-4 left-4 bg-white text-blue-600 px-3 py-1.5 rounded-xl text-sm font-bold z-10 shadow-md">
            チケット利用可
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
        <img
          src={images?.[0] || "https://via.placeholder.com/800x600?text=Featured+Activity"}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-4 left-4 right-4 text-white z-20">
          <h3 className={`${titleSize} font-bold mb-2 line-clamp-2`}>{title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="text-sm font-medium">
              {feeRequired != null ? `${feeRequired.toLocaleString()}円〜` : "無料"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MockFeaturedSection = ({
  featuredActivities = mockFeaturedActivities,
  isLoading = false,
  isInitialLoading = false,
  layout = "hero",
}: {
  featuredActivities?: ActivityCard[];
  isLoading?: boolean;
  isInitialLoading?: boolean;
  layout?: "hero" | "grid" | "carousel";
}) => {
  if (isInitialLoading) {
    return (
      <section className="py-6">
        <div className="px-4">
          <div className="h-8 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
          {layout === "hero" ? (
            <div className="h-[300px] bg-gray-200 rounded-lg animate-pulse"></div>
          ) : layout === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] h-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (featuredActivities.length === 0) {
    return null;
  }

  const renderContent = () => {
    if (layout === "hero") {
      return (
        <MockFeaturedCard 
          opportunity={featuredActivities[0]} 
          size="large" 
        />
      );
    }

    if (layout === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredActivities.slice(0, 4).map((activity) => (
            <MockFeaturedCard
              key={activity.id}
              opportunity={activity}
              size="medium"
            />
          ))}
        </div>
      );
    }

    if (layout === "carousel") {
      return (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {featuredActivities.map((activity) => (
            <div key={activity.id} className="flex-shrink-0 w-[280px]">
              <MockFeaturedCard
                opportunity={activity}
                size="medium"
              />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <section className="py-6">
      <div className="px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">注目のアクティビティ</h2>
        {renderContent()}
        {isLoading && (
          <div className="mt-4">
            <div className="h-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        )}
      </div>
    </section>
  );
};

const meta: Meta<typeof MockFeaturedSection> = {
  title: "App/Activities/FeaturedSection",
  component: MockFeaturedSection,
  tags: ["autodocs"],
  argTypes: {
    featuredActivities: {
      control: "object",
      description: "Array of featured activity cards to display",
    },
    isLoading: {
      control: "boolean",
      description: "Whether additional content is loading",
    },
    isInitialLoading: {
      control: "boolean",
      description: "Whether initial content is loading",
    },
    layout: {
      control: "select",
      options: ["hero", "grid", "carousel"],
      description: "Layout style for featured activities",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MockFeaturedSection>;

export const HeroLayout: Story = {
  args: {
    featuredActivities: mockFeaturedActivities,
    isLoading: false,
    isInitialLoading: false,
    layout: "hero",
  },
};

export const GridLayout: Story = {
  args: {
    featuredActivities: mockFeaturedActivities,
    isLoading: false,
    isInitialLoading: false,
    layout: "grid",
  },
};

export const CarouselLayout: Story = {
  args: {
    featuredActivities: mockFeaturedActivities,
    isLoading: false,
    isInitialLoading: false,
    layout: "carousel",
  },
};

export const Loading: Story = {
  args: {
    featuredActivities: [mockFeaturedActivities[0]],
    isLoading: true,
    isInitialLoading: false,
    layout: "hero",
  },
};

export const InitialLoading: Story = {
  args: {
    featuredActivities: [],
    isLoading: false,
    isInitialLoading: true,
    layout: "hero",
  },
};

export const SingleFeatured: Story = {
  args: {
    featuredActivities: [mockFeaturedActivities[0]],
    isLoading: false,
    isInitialLoading: false,
    layout: "hero",
  },
};

export const EmptyState: Story = {
  args: {
    featuredActivities: [],
    isLoading: false,
    isInitialLoading: false,
    layout: "hero",
  },
};

export const GridWithTwoItems: Story = {
  args: {
    featuredActivities: mockFeaturedActivities.slice(0, 2),
    isLoading: false,
    isInitialLoading: false,
    layout: "grid",
  },
};

export const CarouselWithManyItems: Story = {
  args: {
    featuredActivities: [
      ...mockFeaturedActivities,
      ...mockFeaturedActivities.map(activity => ({
        ...activity,
        id: activity.id + "_extra",
        title: activity.title + " (追加)",
      })),
    ],
    isLoading: false,
    isInitialLoading: false,
    layout: "carousel",
  },
};

export const AllLayouts: Story = {
  render: () => (
    <div className="space-y-8">
      <MockFeaturedSection
        featuredActivities={[mockFeaturedActivities[0]]}
        layout="hero"
      />
      <MockFeaturedSection
        featuredActivities={mockFeaturedActivities.slice(0, 2)}
        layout="grid"
      />
      <MockFeaturedSection
        featuredActivities={mockFeaturedActivities}
        layout="carousel"
      />
    </div>
  ),
};
