import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MockOpportunityList = ({ 
  onOpportunitySelect,
  selectedOpportunityId 
}: { 
  onOpportunitySelect?: (id: string) => void;
  selectedOpportunityId?: string;
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selected, setSelected] = React.useState(selectedOpportunityId || "");

  const mockOpportunities = [
    {
      id: "opp1",
      title: "地域清掃ボランティア",
      description: "地域の公園や道路の清掃活動を行います",
      date: "2024年1月20日",
      location: "中央公園",
      participantCount: 24,
      status: "募集中",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop",
    },
    {
      id: "opp2", 
      title: "環境保護セミナー",
      description: "持続可能な環境保護について学ぶセミナー",
      date: "2024年1月25日",
      location: "市民会館",
      participantCount: 18,
      status: "開催済み",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop",
    },
    {
      id: "opp3",
      title: "高齢者支援活動",
      description: "地域の高齢者の生活支援を行います",
      date: "2024年2月1日", 
      location: "福祉センター",
      participantCount: 12,
      status: "募集中",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
    },
  ];

  const filteredOpportunities = mockOpportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id: string) => {
    setSelected(id);
    onOpportunitySelect?.(id);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-end gap-2 mb-6">
        <h1 className="text-2xl font-bold">募集を選ぶ</h1>
        <span className="ml-1 flex mb-1 items-baseline">
          <span className="text-gray-400 text-base">(</span>
          <span className="text-xl font-bold ml-1">1</span>
          <span className="text-gray-400 text-base">/</span>
          <span className="text-gray-400 text-base mr-1">3</span>
          <span className="text-gray-400 text-base">)</span>
        </span>
      </div>

      <div className="mb-6">
        <Input
          placeholder="募集を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4 mb-6">
        {filteredOpportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selected === opportunity.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelect(opportunity.id)}
          >
            <div className="flex gap-4">
              <img
                src={opportunity.image}
                alt={opportunity.title}
                className="w-24 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg">{opportunity.title}</h3>
                  <Badge variant={opportunity.status === '募集中' ? 'default' : 'secondary'}>
                    {opportunity.status}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-2">{opportunity.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>📅 {opportunity.date}</span>
                  <span>📍 {opportunity.location}</span>
                  <span>👥 {opportunity.participantCount}名参加</span>
                </div>
              </div>
              {selected === opportunity.id && (
                <div className="flex items-center">
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

      <div className="flex justify-end">
        <Button 
          onClick={() => console.log("Next step with opportunity:", selected)}
          disabled={!selected}
        >
          次へ
        </Button>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockOpportunityList> = {
  title: "App/Admin/Credentials/OpportunityList",
  component: MockOpportunityList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "募集選択コンポーネント。検索機能付きで証明書発行対象の募集を選択。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockOpportunityList>;

export const Default: Story = {
  args: {
    onOpportunitySelect: (id: string) => console.log("Selected opportunity:", id),
  },
};

export const WithPreselection: Story = {
  args: {
    selectedOpportunityId: "opp1",
    onOpportunitySelect: (id: string) => console.log("Selected opportunity:", id),
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedId, setSelectedId] = React.useState<string>("");
    return (
      <MockOpportunityList 
        selectedOpportunityId={selectedId}
        onOpportunitySelect={setSelectedId}
      />
    );
  },
};
