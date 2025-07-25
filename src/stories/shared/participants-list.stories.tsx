import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

type Participant = {
  id: string;
  image: string | null;
  name: string;
};

const MockParticipantsList = ({ 
  participants, 
  size = "sm" 
}: { 
  participants: Participant[]; 
  size?: "sm" | "md";
}) => {
  const MAX_DISPLAY_PARTICIPANTS = 4;
  const uniqueParticipants = Array.from(new Map(participants.map((p) => [p.id, p])).values());
  const remainingCount = uniqueParticipants.length - MAX_DISPLAY_PARTICIPANTS + 1;
  const displayParticipants = uniqueParticipants.slice(0, MAX_DISPLAY_PARTICIPANTS);

  const avatarSize = size === "sm" ? "w-6 h-6" : "w-8 h-8";

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayParticipants.map((participant, index) => {
          if (index === MAX_DISPLAY_PARTICIPANTS - 1 && remainingCount > 0) {
            return null;
          }

          return (
            <div
              key={`${participant.id}-${index}`}
              className={`${avatarSize} border-2 border-background rounded-full bg-gray-200 flex items-center justify-center overflow-hidden`}
            >
              {participant.image ? (
                <img 
                  src={participant.image} 
                  alt={participant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-gray-600">
                  {participant.name?.[0] ?? "U"}
                </span>
              )}
            </div>
          );
        })}

        {remainingCount > 0 && (
          <div
            className={`${avatarSize} relative flex items-center justify-center rounded-full bg-gray-400 border-2 border-background text-white`}
          >
            <span className="text-xs font-medium">+{remainingCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "田中太郎",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2", 
    name: "佐藤花子",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "鈴木一郎",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "高橋美咲",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "山田健太",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "中村由美",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
];

const meta: Meta<typeof MockParticipantsList> = {
  title: "Shared/Components/ParticipantsList",
  component: MockParticipantsList,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
      description: "Size of the participant avatars",
    },
    participants: {
      control: "object",
      description: "Array of participant objects",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MockParticipantsList>;

export const SmallSize: Story = {
  args: {
    participants: mockParticipants.slice(0, 3),
    size: "sm",
  },
};

export const MediumSize: Story = {
  args: {
    participants: mockParticipants.slice(0, 3),
    size: "md",
  },
};

export const WithOverflow: Story = {
  args: {
    participants: mockParticipants,
    size: "sm",
  },
};

export const WithOverflowMedium: Story = {
  args: {
    participants: mockParticipants,
    size: "md",
  },
};

export const SingleParticipant: Story = {
  args: {
    participants: [mockParticipants[0]],
    size: "sm",
  },
};

export const TwoParticipants: Story = {
  args: {
    participants: mockParticipants.slice(0, 2),
    size: "md",
  },
};

export const EmptyList: Story = {
  args: {
    participants: [],
    size: "sm",
  },
};

export const WithoutImages: Story = {
  args: {
    participants: [
      { id: "1", name: "田中太郎", image: null },
      { id: "2", name: "佐藤花子", image: null },
      { id: "3", name: "鈴木一郎", image: null },
    ],
    size: "md",
  },
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">ワークショップ参加者</h3>
        <div className="flex items-center gap-2">
          <MockParticipantsList participants={mockParticipants.slice(0, 4)} size="sm" />
          <span className="text-sm text-muted-foreground">4名参加</span>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">イベント参加者</h3>
        <div className="flex items-center gap-2">
          <MockParticipantsList participants={mockParticipants} size="md" />
          <span className="text-sm text-muted-foreground">{mockParticipants.length}名参加</span>
        </div>
      </div>
    </div>
  ),
};
