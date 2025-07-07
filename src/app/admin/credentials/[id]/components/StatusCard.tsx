import { AlertCircle } from "lucide-react";

export const PendingCard = ({ description }: { description: string }) => (
    <div className="border border-warning bg-yellow-50 rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-start">
        <div>
          <AlertCircle className="text-warning w-5 h-5 mr-2 mt-[0.7px]" />
        </div>
        <div>
          <span className="text-base font-bold">証明書発行準備中</span>
          <div className="text-gray-400 text-sm font-normal leading-relaxed mt-2">
            {description}
          </div>
        </div>
      </div>
    </div>
  );

export const ErrorCard = ({ description }: { description: string }) => (
  <div className="border border-danger bg-red-50 rounded-2xl p-4">
    <div className="flex items-start">
      <div>
        <AlertCircle className="text-danger w-5 h-5 mr-2 mt-[0.7px]" />
      </div>
      <div>
        <span className="text-base font-bold">証明書発行失敗</span>
        <div className="text-gray-400 text-sm font-normal leading-relaxed mt-2">
          {description}
        </div>
      </div>
    </div>
  </div>
);