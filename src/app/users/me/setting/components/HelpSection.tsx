import { Card, CardContent } from "@/components/ui/card";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { Flag, HelpCircleIcon, LifeBuoy, TrashIcon } from "lucide-react";

export default function HelpSection() {

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        <div className="flex items-center justify-between py-4 px-4 border-b">
        <div className="flex items-center gap-2">
            <HelpCircleIcon className="w-5 h-5" />
            <span className="font-bold text-sm flex items-center gap-2">
                {currentCommunityConfig.title}の使い方
            </span>
            </div>
        </div>
        <div className="flex items-center justify-between py-4 px-4 border-b">
            <div className="flex items-center gap-2">
                <TrashIcon className="w-5 h-5" />
                <span className="font-bold text-sm">キャッシュを削除</span>
            </div>
        </div>
        <div className="flex items-center justify-between py-4 px-4 border-b">
            <div className="flex items-center gap-2">
                <Flag className="w-5 h-5" />
                <span className="font-bold text-sm">バグを報告</span>
            </div>
        </div>
        <div className="flex items-center justify-between py-4 px-4 border-b">
            <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5" />
                <span className="font-bold text-sm">チャットをサポート</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
