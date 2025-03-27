import { format } from "date-fns";
import { ja } from "date-fns/locale";
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
  onConfirm: () => void;
  opportunity: Opportunity;
  isJoined: boolean;
  isEvent?: boolean;
};

export const OpportunityConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  opportunity,
  isJoined,
  isEvent = false,
}: Props) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-w-lg mx-auto rounded-t-lg">
        <div className="container max-w-lg mx-auto px-4">
          <SheetHeader className="text-center mb-6">
            <SheetTitle>{isEvent ? "参加の確認" : "応募の確認"}</SheetTitle>
            <SheetDescription>
              以下の{isEvent ? "イベント" : "クエスト"}でお間違いありませんか?
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
            <Button size="lg" className="w-full" onClick={onConfirm}>
              確定する
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
