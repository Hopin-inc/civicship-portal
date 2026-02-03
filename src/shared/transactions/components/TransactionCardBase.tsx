"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AppLink } from "@/lib/navigation";
import { TransactionMessageCard } from "./timeline/TransactionMessageCard";

interface TransactionCardBaseProps {
  image?: string;
  displayName: string | null;
  displayAction: string | null;
  amount: string;
  amountClassName: string;
  statusLabel?: React.ReactNode;
  hasDestination: boolean;
  destinationName?: string;
  didValue?: string | null;
  comment?: string;
  formattedDateTime: string;
  transactionHref?: string | null;
}

export const TransactionCardBase = ({
  image,
  displayName,
  displayAction,
  amount,
  amountClassName,
  statusLabel,
  hasDestination,
  destinationName,
  didValue,
  comment,
  formattedDateTime,
  transactionHref,
}: TransactionCardBaseProps) => {
  const cardContent = (
    <div className="flex items-start gap-3 py-6">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={image} alt="user" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex flex-col text-left min-w-0 flex-1",
          hasDestination ? "gap-1.5" : "gap-0.5",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center min-w-0 flex-1 overflow-hidden">
            {displayName && <span className="text-label-sm font-bold truncate">{displayName}</span>}
            {displayAction && (
              <span className={cn("text-label-xs font-bold shrink-0", displayName ? "ml-1" : "")}>
                {displayAction}
              </span>
            )}
          </span>

          <div className={amountClassName}>{amount}</div>
        </div>

        {hasDestination && destinationName && (
          <p className="flex items-center gap-1">
            {statusLabel}
            <span className="text-label-xs font-medium text-caption truncate">{destinationName}</span>
          </p>
        )}

        {didValue && (
          <span className="text-label-xs text-caption">
            {didValue}
          </span>
        )}

        {comment && (
          <div className="text-label-xs text-caption bg-background-hover leading-relaxed p-2 rounded-sm">
            <TransactionMessageCard comment={comment} />
          </div>
        )}

        <span className="text-label-xs text-muted-foreground mt-1 block">
          {formattedDateTime}
        </span>
      </div>
    </div>
  );

  if (transactionHref) {
    return (
      <AppLink
        href={transactionHref}
        prefetch={false}
        className="block cursor-pointer hover:bg-zinc-50 rounded-lg transition-colors"
      >
        {cardContent}
      </AppLink>
    );
  }

  return cardContent;
};
