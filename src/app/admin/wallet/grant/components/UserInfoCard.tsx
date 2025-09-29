import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GqlUser } from "@/types/graphql";
import { formatDateTime } from "@/utils/date";
import React from "react";
import { truncateText } from "@/utils/stringUtils";

interface Props {
  otherUser: GqlUser | undefined | null;
  label?: string | { text: string; smallText: string };
  point?: bigint;
  sign?: string;
  pointColor?: string;
  didValue?: string;
  createdAt?: Date | null | undefined;
  showLabel?: boolean;
  showPoint?: boolean;
  showDid?: boolean;
  showDate?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  comment?: string;
  tabType?: 'member' | 'other';
}

const UserInfoCard = ({
  otherUser,
  label,
  point,
  sign,
  pointColor,
  didValue,
  createdAt,
  showLabel = true,
  showPoint = true,
  showDid = true,
  showDate = true,
  onClick,
  children,
  comment,
  tabType = 'other',
}: Props) => (
    <Card className="px-4 py-4 bg-white" onClick={onClick}>
    <div className="flex items-start gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={otherUser?.image || ""} alt="user" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-left min-w-0 flex-1">
        <div className={`flex ${didValue || comment ? 'items-start' : (tabType === 'member' ? 'items-center' : 'items-start')} justify-between`}>
          <span className={`flex items-center truncate whitespace-nowrap overflow-hidden ${!didValue && !comment && tabType === 'member' ? 'h-10' : ''}`}>
          {showLabel
            ? typeof label === "string"
              ? label
              : label && (
                  <span className="flex items-center min-w-0">
                    <span className="truncate text-label-sm font-bold">{label.text.replace(label.smallText, "")}</span>
                    <span className="text-xs flex-shrink-0 text-label-xs font-bold">{label.smallText}</span>
                  </span>
                )
            : otherUser?.name
              ? `{{ ${otherUser.name} }}`
              : ""}
          </span>
          {/* 右: 金額 */}
          {showPoint && point !== undefined && (
            <span className={`font-bold text-xs ${pointColor ?? ""}`}>
              {sign}
              {point.toLocaleString()}pt
            </span>
          )}
        </div>
        {didValue && <span className="text-label-xs text-caption py-2">{truncateText(didValue, 20, "middle")}</span>}
        {!didValue && <div className="py-1"></div>}
        {comment && (
          <span className="text-label-xs text-caption bg-background-hover leading-relaxed block p-2 rounded-sm">
            {comment}
          </span>
        )}
        {showDate && (
        <span className="text-label-xs text-muted-foreground mt-2 block">
          {formatDateTime(createdAt ?? null, "yyyy年MM月dd日 HH時mm分")}
        </span>
        )}
        {children}
      </div>
    </div>
  </Card>
);

export default UserInfoCard;
