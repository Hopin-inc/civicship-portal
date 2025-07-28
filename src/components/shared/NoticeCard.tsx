import { Card } from "@/components/ui/card";
import IconWrapper from "./IconWrapper";
import { AlertCircle } from "lucide-react";

interface NoticeCardProps {
  title: string;
  description: string;
}

export const NoticeCard = ({ title, description }: NoticeCardProps) => {
  return (
    <Card>
      <div className="flex items-start p-4 bg-yellow-50 border border-warning rounded-lg">
        <IconWrapper color="warning">
          <AlertCircle size={20} strokeWidth={2.5} />
        </IconWrapper>
        <div className="ml-2">
          <p className="text-sm font-bold mt-[2px]">{title}</p>
          <p className="text-sm pt-2 text-caption">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};
