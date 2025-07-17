import IconWrapper from "@/components/shared/IconWrapper";
import { AlertCircle } from "lucide-react";

export const NoticeSection: React.FC = () => {
    return (
      <section className="pt-6 pb-8 mt-0 bg-background-hover -mx-4 px-4">
        <h2 className="text-display-md text-foreground mb-4">注意事項</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <IconWrapper color="warning">
              <AlertCircle size={20} strokeWidth={2.5} />
            </IconWrapper>
            <p className="text-body-md flex-1 font-bold">ホストによる確認後に、予約が確定します。</p>
          </div>
          <div className="flex items-center gap-3">
            <IconWrapper color="warning">
              <AlertCircle size={20} strokeWidth={2.5} />
            </IconWrapper>
            <p className="text-body-md flex-1">
              実施確定または中止のどちらの場合でも、公式LINEからご連絡します。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <IconWrapper color="warning">
              <AlertCircle size={20} strokeWidth={2.5} />
            </IconWrapper>
            <p className="text-body-md flex-1">当日は現金をご用意下さい。</p>
          </div>
          <div className="flex items-center gap-3">
            <IconWrapper color="warning">
              <AlertCircle size={20} strokeWidth={2.5} />
            </IconWrapper>
            <p className="text-body-md flex-1">キャンセルは開催日の前日まで可能です。</p>
          </div>
        </div>
      </section>
    );
  };