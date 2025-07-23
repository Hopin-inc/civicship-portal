import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MockTimeSlotSelector = ({ 
  onTimeSlotSelect,
  selectedTimeSlotId 
}: { 
  onTimeSlotSelect?: (id: string) => void;
  selectedTimeSlotId?: string;
}) => {
  const [selected, setSelected] = React.useState(selectedTimeSlotId || "");

  const mockTimeSlots = [
    {
      id: "slot1",
      date: "2024年1月20日",
      startTime: "14:00",
      endTime: "16:00",
      participantCount: 12,
      maxParticipants: 20,
      location: "中央公園 東エリア",
      status: "開催済み",
    },
    {
      id: "slot2",
      date: "2024年1月20日", 
      startTime: "16:30",
      endTime: "18:30",
      participantCount: 8,
      maxParticipants: 15,
      location: "中央公園 西エリア",
      status: "開催済み",
    },
    {
      id: "slot3",
      date: "2024年1月21日",
      startTime: "10:00", 
      endTime: "12:00",
      participantCount: 15,
      maxParticipants: 20,
      location: "中央公園 全エリア",
      status: "開催予定",
    },
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
    onTimeSlotSelect?.(id);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-end gap-2 mb-6">
        <h1 className="text-2xl font-bold">開催日を選ぶ</h1>
        <span className="ml-1 flex mb-1 items-baseline">
          <span className="text-gray-400 text-base">(</span>
          <span className="text-xl font-bold ml-1">2</span>
          <span className="text-gray-400 text-base">/</span>
          <span className="text-gray-400 text-base mr-1">3</span>
          <span className="text-gray-400 text-base">)</span>
        </span>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-bold text-lg mb-2">地域清掃ボランティア</h2>
        <p className="text-gray-600">選択した募集の開催日時を選んでください</p>
      </div>

      <div className="space-y-4 mb-6">
        {mockTimeSlots.map((slot) => (
          <div
            key={slot.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selected === slot.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelect(slot.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">
                    {slot.date} {slot.startTime}-{slot.endTime}
                  </h3>
                  <Badge variant={slot.status === '開催済み' ? 'secondary' : 'default'}>
                    {slot.status}
                  </Badge>
                </div>
                <div className="text-gray-600 mb-2">📍 {slot.location}</div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>👥 参加者: {slot.participantCount}名</span>
                  <span>📊 定員: {slot.maxParticipants}名</span>
                  <span>📈 参加率: {Math.round((slot.participantCount / slot.maxParticipants) * 100)}%</span>
                </div>
              </div>
              {selected === slot.id && (
                <div className="flex items-center ml-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline"
          onClick={() => console.log("Go back to step 1")}
          className="flex-1"
        >
          戻る
        </Button>
        <Button 
          onClick={() => console.log("Next step with time slot:", selected)}
          disabled={!selected}
          className="flex-1"
        >
          次へ
        </Button>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockTimeSlotSelector> = {
  title: "App/Admin/Credentials/TimeSlotSelector",
  component: MockTimeSlotSelector,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "開催日選択コンポーネント。選択した募集の開催日時から証明書発行対象を選択。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockTimeSlotSelector>;

export const Default: Story = {
  args: {
    onTimeSlotSelect: (id: string) => console.log("Selected time slot:", id),
  },
};

export const WithPreselection: Story = {
  args: {
    selectedTimeSlotId: "slot1",
    onTimeSlotSelect: (id: string) => console.log("Selected time slot:", id),
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedId, setSelectedId] = React.useState<string>("");
    return (
      <MockTimeSlotSelector 
        selectedTimeSlotId={selectedId}
        onTimeSlotSelect={setSelectedId}
      />
    );
  },
};
