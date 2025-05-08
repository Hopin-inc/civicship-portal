import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar, Phone, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import OpportunityCard from "./OpportunityCard";
import type { Opportunity } from "@/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  isJoined: boolean;
  isEvent?: boolean;
  onShare: () => void;
  onAddToCalendar?: () => void;
};

export const OpportunityCompletedModal = ({
  isOpen,
  onClose,
  opportunity,
  isJoined,
  isEvent = false,
  onShare,
  onAddToCalendar,
}: Props) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-w-lg mx-auto rounded-t-lg">
        <div className="container max-w-lg mx-auto px-4">
          <SheetHeader className="text-center mb-6">
            <SheetTitle>
              {isEvent ? "参加予定です！" : "応募を受け付けました！"}
            </SheetTitle>
            <SheetDescription>
              {isEvent
                ? "以下のイベントへの参加を受け付けました"
                : "LINEで確定次第通知します。以下のボタンからLINE友達に追加してください。"}
            </SheetDescription>
          </SheetHeader>
          <div>
            <div className="text-xs text-muted-foreground mb-2">
              {format(new Date(opportunity.startsAt), "M月d日(E)", {
                locale: ja,
              })}
            </div>
            <div className="bg-muted/20 rounded-xl">
              <OpportunityCard opportunity={opportunity} isJoined={isJoined} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-12 space-y-4">
            {isEvent ? (
              <>
                <Button size="lg" className="w-full" onClick={onAddToCalendar}>
                  <Calendar className="mr-2 h-4 w-4" />
                  カレンダーに追加
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  onClick={onShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  共有する
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() =>
                    window.open(
                      "https://line.me/R/ti/p/@your-line-id",
                      "_blank"
                    )
                  }
                >
                  <Phone className="mr-2 h-4 w-4" />
                  <span>LINE友達に追加</span>
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  onClick={onShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  共有する
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
