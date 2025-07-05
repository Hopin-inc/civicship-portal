import { AlertCircle } from "lucide-react";

export const PendingCard = ({ description }: { description: string }) => (
    <div className="border border-[#EAB308] bg-[#FEFCE8] rounded-2xl p-6 flex flex-col gap-2">
      <div className="flex items-center mb-2">
        <AlertCircle className="text-[#EAB308] w-5 h-5 mr-2" />
        <span className="text-lg font-bold">証明書発行準備中</span>
      </div>
      <div className="text-gray-400 text-base font-normal">
      {description}
      </div>
    </div>
  );

export const ErrorCard = ({ description }: { description: string }) => (
  <div className="border border-[#F87171] bg-[#FEF2F2] rounded-2xl p-6 flex flex-col gap-2">
    <div className="flex items-center mb-2">
      <AlertCircle className="text-[#F87171] w-5 h-5 mr-2" />
      <span className="text-lg font-bold">証明書発行失敗</span>
    </div>
    <div className="text-gray-400 text-base font-normal">
      {description}
    </div>
  </div>
);