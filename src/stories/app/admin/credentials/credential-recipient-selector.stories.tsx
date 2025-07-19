import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/shared/SearchForm";

const MockCredentialRecipientSelector = ({ setStep }: { setStep: (step: number) => void }) => {
  const [input, setInput] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const mockMembers = [
    {
      id: "user1",
      name: "田中太郎",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      didInfo: { didValue: "did:example:123" },
      participated: true,
    },
    {
      id: "user2", 
      name: "佐藤花子",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      didInfo: null,
      participated: false,
    },
    {
      id: "user3",
      name: "山田次郎", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      didInfo: { didValue: "did:example:456" },
      participated: false,
    },
  ];

  const filteredMembers = searchQuery 
    ? mockMembers.filter(member => member.name.includes(searchQuery))
    : mockMembers;

  const handleCheck = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Issuing credentials for users:", selectedUserIds);
      setIsSubmitting(false);
      alert("証明書発行を開始しました！");
    }, 2000);
  };

  return (
    <>
      <div className="flex items-end gap-2 mt-2">
        <h1 className="text-2xl font-bold">発行先を選ぶ</h1>
        <span className="ml-1 flex mb-1 items-baseline">
          <span className="text-gray-400 text-base">(</span>
          <span className="text-xl font-bold ml-1" style={{ color: "#71717A" }}>3</span>
          <span className="text-gray-400 text-base">/</span>
          <span className="text-gray-400 text-base mr-1">3</span>
          <span className="text-gray-400 text-base">)</span>
        </span>
      </div>
      
      <div className="px-4 mb-4 pt-4">
        <SearchForm
          value={input}
          onInputChange={setInput}
          onSearch={setSearchQuery}
          placeholder="名前・DIDで検索"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedUserIds.includes(member.id)}
                onChange={() => handleCheck(member.id)}
                className="w-4 h-4"
              />
              <img
                src={member.image}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-gray-500">
                  {member.didInfo ? "DID登録済み" : "DID未登録"}
                  {member.participated && " • 参加済み"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white z-10">
          <div className="w-full max-w-sm mx-auto flex justify-between px-4 py-4 border-t">
            <Button
              variant="text"
              className="text-gray-500"
              onClick={() => setStep(1)}
            >
              キャンセル
            </Button>
            <Button
              className={`rounded-full px-8 py-2 font-bold text-white ${
                selectedUserIds.length > 0 && !isSubmitting
                  ? "bg-primary"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              size="lg"
              disabled={selectedUserIds.length === 0 || isSubmitting}
              onClick={handleConfirm}
            >
              {isSubmitting ? "発行中..." : `発行 (${selectedUserIds.length})`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const meta: Meta<typeof MockCredentialRecipientSelector> = {
  title: "App/Admin/Credentials/CredentialRecipientSelector", 
  component: MockCredentialRecipientSelector,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "証明書発行先選択コンポーネント。GraphQL依存関係をモック化してStorybook用に簡略化。",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto min-h-screen bg-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MockCredentialRecipientSelector>;

export const Default: Story = {
  args: {
    setStep: (step: number) => console.log("Step changed to:", step),
  },
};

export const WithSearch: Story = {
  args: {
    setStep: (step: number) => console.log("Step changed to:", step),
  },
  play: async ({ canvasElement }) => {
    const searchInput = canvasElement.querySelector('input[placeholder="名前・DIDで検索"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "田中";
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};
