import { AlertCircle } from "lucide-react";

export const PendingCard = () => (
    <div className="border border-[#EAB308] bg-[#FEFCE8] rounded-2xl p-6 flex flex-col gap-2">
      <div className="flex items-center mb-2">
        <AlertCircle className="text-[#EAB308] w-5 h-5 mr-2" />
        <span className="text-lg font-bold">証明書発行準備中</span>
      </div>
      <div className="text-gray-400 text-base font-normal">
      ただいま、証明書を発行中です。準備が整うまで、少しお時間をあけてからもう一度アクセスしてみてください。
      </div>
    </div>
  );

export const ErrorCard = () => (
  <div className="border border-[#F87171] bg-[#FEF2F2] rounded-2xl p-6 flex flex-col gap-2">
    <div className="flex items-center mb-2">
      <AlertCircle className="text-[#F87171] w-5 h-5 mr-2" />
      <span className="text-lg font-bold">証明書発行失敗</span>
    </div>
    <div className="text-gray-400 text-base font-normal">
      指定されたユーザーに証明書を発行できませんでした。お手数ですが再度ユーザーを確認・選択のうえ、発行をお試しください。
    </div>
  </div>
);