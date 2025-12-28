import { Card } from "@/components/ui/card";
import IconWrapper from "./IconWrapper";
import { AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type NoticeVariant = "warning" | "info";

interface NoticeCardProps {
  title: string;
  description: string;
  variant?: NoticeVariant;
}

export const NoticeCard = ({ title, description, variant = "warning" }: NoticeCardProps) => {
  const isWarning = variant === "warning";

  return (
    <Card>
      <div
        className={cn(
          "flex items-start p-4 rounded-lg border",
          isWarning ? "bg-yellow-50 border-warning" : "bg-muted border-border",
        )}
      >
        <IconWrapper color={isWarning ? "warning" : "default"}>
          {isWarning ? (
            <AlertCircle size={20} strokeWidth={2.5} />
          ) : (
            <Info size={20} strokeWidth={2.5} />
          )}
        </IconWrapper>

        <div className="ml-2">
          <p className="text-sm font-bold mt-[2px]">{title}</p>
          <p className="text-sm pt-2 text-caption">{description}</p>
        </div>
      </div>
    </Card>
  );
};
