import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GqlUser } from "@/types/graphql";
import React from "react";
import { truncateText } from "@/utils/stringUtils";
import { useTranslations } from "next-intl";
import { getWalletActionKey, useLocaleDateTimeFormat } from "@/utils/i18n";

interface Props {
  otherUser: GqlUser | undefined | null;
  label?: string | { text: string; smallText: string };
  otherName?: string;
  actionType?: "donation" | "grant";
  isReceive?: boolean;
  point?: bigint;
  sign?: string;
  pointColor?: string;
  didValue?: string;
  isDidPending?: boolean;
  createdAt?: Date | null | undefined;
  showLabel?: boolean;
  showPoint?: boolean;
  showDid?: boolean;
  showDate?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  comment?: string;
}

const UserInfoCard = ({
  otherUser,
  label,
  otherName,
  actionType,
  isReceive,
  point,
  sign,
  pointColor,
  didValue,
  isDidPending,
  createdAt,
  showLabel = true,
  showPoint = true,
  showDid = true,
  showDate = true,
  onClick,
  children,
  comment,
}: Props) => {
  const t = useTranslations();
  const formatDateTime = useLocaleDateTimeFormat();
  const showDidLine = showDid && (!!didValue || isDidPending);
  
  const displayDid = isDidPending
    ? t("wallets.shared.transfer.didPending")
    : didValue
    ? truncateText(didValue, 20, "middle")
    : "";
  
  const useTranslatedLabel = actionType && otherName !== undefined && isReceive !== undefined;
  
  const direction = isReceive ? "from" : "to";
  const displayName = useTranslatedLabel 
    ? t(`transactions.parts.action.${actionType}.${direction}.name`, { name: otherName })
    : null;
  const displayAction = useTranslatedLabel
    ? t(`transactions.parts.action.${actionType}.${direction}.action`)
    : null;
  
  const formattedDate = createdAt
    ? formatDateTime(
        typeof createdAt === "string" ? createdAt : createdAt.toISOString()
      )
    : "";
  
  return (
    <Card className="px-4 py-4 bg-white" onClick={onClick}>
    <div className={`flex ${showDidLine ? "items-start" : "items-center"} gap-3`}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={otherUser?.image || ""} alt="user" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-left min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <span className="flex items-center truncate whitespace-nowrap overflow-hidden">
          {showLabel
            ? useTranslatedLabel
              ? (
                  <>
                    <span className="text-label-sm font-bold">{displayName}</span>
                    <span className="text-label-xs font-bold">{displayAction}</span>
                  </>
                )
              : typeof label === "string"
                ? label
                : label && (
                    <span className="flex items-center min-w-0">
                      <span className="truncate text-label-sm font-bold">{label.text.replace(label.smallText, "")}</span>
                      <span className="text-xs flex-shrink-0 text-label-xs font-bold">{label.smallText}</span>
                    </span>
                  )
            : otherUser?.name ?? ""}
          </span>
          {/* 右: 金額 */}
          {showPoint && point !== undefined && (
            <span className={`font-bold text-xs ${pointColor ?? ""}`}>
              {sign}
              {point.toLocaleString()}pt
            </span>
          )}
        </div>
        {showDidLine && <span className="text-label-xs text-caption py-2">{displayDid}</span>}
        {comment && (
          <span className="text-label-xs text-caption bg-background-hover leading-relaxed block p-2 rounded-sm">
            {comment}
          </span>
        )}
        {showDate && formattedDate && (
        <span className="text-label-xs text-muted-foreground mt-2 block">
          {formattedDate}
        </span>
        )}
        {children}
      </div>
    </div>
  </Card>
  );
};

export default UserInfoCard;
