import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PendingCard = ({ 
  title,
  description,
  recipientCount,
  onRetry 
}: {
  title: string;
  description?: string;
  recipientCount: number;
  onRetry?: () => void;
}) => {
  return (
    <div className="border rounded-lg p-6 bg-yellow-50 border-yellow-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {description && <p className="text-gray-600 text-sm">{description}</p>}
          </div>
        </div>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          発行準備中
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">発行対象: {recipientCount}名</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRetry}>
          再試行
        </Button>
        <Button variant="ghost" size="sm">
          詳細を見る
        </Button>
      </div>
    </div>
  );
};

const ErrorCard = ({ 
  title,
  description,
  errorMessage,
  recipientCount,
  onRetry 
}: {
  title: string;
  description?: string;
  errorMessage: string;
  recipientCount: number;
  onRetry?: () => void;
}) => {
  return (
    <div className="border rounded-lg p-6 bg-red-50 border-red-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {description && <p className="text-gray-600 text-sm">{description}</p>}
          </div>
        </div>
        <Badge variant="destructive">
          発行失敗
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">発行対象: {recipientCount}名</div>
        <div className="bg-red-100 border border-red-200 rounded p-3">
          <div className="text-sm font-medium text-red-800 mb-1">エラー詳細:</div>
          <div className="text-sm text-red-700">{errorMessage}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRetry}>
          再試行
        </Button>
        <Button variant="ghost" size="sm">
          ログを確認
        </Button>
      </div>
    </div>
  );
};

const SuccessCard = ({ 
  title,
  description,
  recipientCount,
  issuedAt 
}: {
  title: string;
  description?: string;
  recipientCount: number;
  issuedAt: string;
}) => {
  return (
    <div className="border rounded-lg p-6 bg-green-50 border-green-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {description && <p className="text-gray-600 text-sm">{description}</p>}
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800">
          発行完了
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">発行済み: {recipientCount}名</div>
        <div className="text-sm text-gray-500">発行日時: {issuedAt}</div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          詳細を見る
        </Button>
        <Button variant="ghost" size="sm">
          証明書を確認
        </Button>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "App/Admin/Credentials/StatusCards",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "証明書発行ステータス表示カード。発行準備中、発行失敗、発行完了の状態を表示。",
      },
    },
  },
};

export default meta;

export const Pending: Meta<typeof PendingCard> = {
  render: (args) => <PendingCard {...args} />,
  args: {
    title: "地域清掃ボランティア証明書",
    description: "2024年1月20日 14:00-16:00",
    recipientCount: 12,
    onRetry: () => console.log("Retry issuance"),
  },
};

export const Error: Meta<typeof ErrorCard> = {
  render: (args) => <ErrorCard {...args} />,
  args: {
    title: "環境保護セミナー証明書",
    description: "2024年1月25日 10:00-12:00",
    errorMessage: "DID解決に失敗しました。ネットワーク接続を確認してください。",
    recipientCount: 8,
    onRetry: () => console.log("Retry issuance"),
  },
};

export const Success: Meta<typeof SuccessCard> = {
  render: (args) => <SuccessCard {...args} />,
  args: {
    title: "高齢者支援活動証明書",
    description: "2024年2月1日 13:00-17:00",
    recipientCount: 15,
    issuedAt: "2024年2月2日 10:30",
  },
};

export const AllStates: Meta = {
  render: () => (
    <div className="space-y-4 max-w-2xl mx-auto p-4">
      <PendingCard
        title="地域清掃ボランティア証明書"
        description="2024年1月20日 14:00-16:00"
        recipientCount={12}
        onRetry={() => console.log("Retry pending")}
      />
      <ErrorCard
        title="環境保護セミナー証明書"
        description="2024年1月25日 10:00-12:00"
        errorMessage="DID解決に失敗しました。ネットワーク接続を確認してください。"
        recipientCount={8}
        onRetry={() => console.log("Retry error")}
      />
      <SuccessCard
        title="高齢者支援活動証明書"
        description="2024年2月1日 13:00-17:00"
        recipientCount={15}
        issuedAt="2024年2月2日 10:30"
      />
    </div>
  ),
};
