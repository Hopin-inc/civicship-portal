import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const MockCredentialList = ({ 
  onCreateNew,
  onViewDetails 
}: { 
  onCreateNew?: () => void;
  onViewDetails?: (id: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const mockCredentials = [
    {
      id: "cred1",
      title: "地域清掃ボランティア証明書",
      opportunityTitle: "地域清掃ボランティア",
      date: "2024年1月20日",
      recipientCount: 12,
      status: "発行完了",
      issuedAt: "2024年1月21日 10:30",
      type: "参加証明書",
    },
    {
      id: "cred2",
      title: "環境保護セミナー証明書", 
      opportunityTitle: "環境保護セミナー",
      date: "2024年1月25日",
      recipientCount: 8,
      status: "発行失敗",
      issuedAt: "2024年1月26日 09:15",
      type: "修了証明書",
    },
    {
      id: "cred3",
      title: "高齢者支援活動証明書",
      opportunityTitle: "高齢者支援活動",
      date: "2024年2月1日",
      recipientCount: 15,
      status: "発行準備中",
      issuedAt: null,
      type: "参加証明書",
    },
    {
      id: "cred4",
      title: "子育て支援ワークショップ証明書",
      opportunityTitle: "子育て支援ワークショップ",
      date: "2024年2月5日",
      recipientCount: 20,
      status: "発行完了",
      issuedAt: "2024年2月6日 14:45",
      type: "修了証明書",
    },
  ];

  const filteredCredentials = mockCredentials.filter(cred =>
    cred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.opportunityTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '発行完了':
        return <Badge className="bg-green-100 text-green-800">発行完了</Badge>;
      case '発行失敗':
        return <Badge variant="destructive">発行失敗</Badge>;
      case '発行準備中':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">発行準備中</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusStats = () => {
    const stats = mockCredentials.reduce((acc, cred) => {
      acc[cred.status] = (acc[cred.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">証明書管理</h1>
          <p className="text-gray-600">発行済み証明書の管理と新規発行</p>
        </div>
        <Button onClick={onCreateNew}>
          新規発行
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{stats['発行完了'] || 0}</div>
          <div className="text-sm text-green-700">発行完了</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats['発行準備中'] || 0}</div>
          <div className="text-sm text-yellow-700">発行準備中</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{stats['発行失敗'] || 0}</div>
          <div className="text-sm text-red-700">発行失敗</div>
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="証明書を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="space-y-4">
        {filteredCredentials.map((credential) => (
          <div
            key={credential.id}
            className="border rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{credential.title}</h3>
                <p className="text-gray-600 text-sm">{credential.opportunityTitle}</p>
              </div>
              {getStatusBadge(credential.status)}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">開催日:</span> {credential.date}
              </div>
              <div>
                <span className="font-medium">発行対象:</span> {credential.recipientCount}名
              </div>
              <div>
                <span className="font-medium">種類:</span> {credential.type}
              </div>
              {credential.issuedAt && (
                <div>
                  <span className="font-medium">発行日:</span> {credential.issuedAt}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails?.(credential.id)}
              >
                詳細を見る
              </Button>
              {credential.status === '発行失敗' && (
                <Button variant="outline" size="sm">
                  再発行
                </Button>
              )}
              {credential.status === '発行完了' && (
                <Button variant="ghost" size="sm">
                  証明書を確認
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCredentials.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">証明書が見つかりません</div>
          <p className="text-gray-500 text-sm">
            {searchTerm ? '検索条件を変更してください' : '証明書を発行してください'}
          </p>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof MockCredentialList> = {
  title: "App/Admin/Credentials/CredentialList",
  component: MockCredentialList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "証明書一覧管理コンポーネント。発行済み証明書の表示、検索、統計機能。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockCredentialList>;

export const Default: Story = {
  args: {
    onCreateNew: () => console.log("Create new credential"),
    onViewDetails: (id: string) => console.log("View details for:", id),
  },
};

export const WithSearch: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = React.useState("環境");
    return (
      <div>
        <MockCredentialList 
          onCreateNew={() => console.log("Create new")}
          onViewDetails={(id) => console.log("View:", id)}
        />
      </div>
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const EmptyCredentialList = () => {
      return (
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">証明書管理</h1>
              <p className="text-gray-600">発行済み証明書の管理と新規発行</p>
            </div>
            <Button>新規発行</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-green-700">発行完了</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-yellow-700">発行準備中</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-red-700">発行失敗</div>
            </div>
          </div>

          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">証明書がありません</div>
            <p className="text-gray-500 text-sm">最初の証明書を発行してください</p>
          </div>
        </div>
      );
    };
    
    return <EmptyCredentialList />;
  },
};
