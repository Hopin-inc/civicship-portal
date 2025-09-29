import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GqlUser } from "@/types/graphql";
import { formatDateTime } from "@/utils/date";
import React from "react";
import { truncateText } from "@/utils/stringUtils";

// ヘルパー関数: メインコンテナのクラス名を生成
const getMainContainerClassName = (didValue?: string, comment?: string, tabType?: 'member' | 'history') => {
  const classes = ['flex', 'justify-between'];
  if (didValue || comment) {
    classes.push('items-start');
  } else {
    classes.push(tabType === 'member' ? 'items-center' : 'items-start');
  }
  return classes.join(' ');
};

// ヘルパー関数: 名前表示用spanのクラス名を生成
const getNameSpanClassName = (didValue?: string, comment?: string, tabType?: 'member' | 'history') => {
  const classes = ['flex', 'items-center', 'truncate', 'whitespace-nowrap', 'overflow-hidden'];
  if (!didValue && !comment && tabType === 'member') {
    classes.push('h-10');
  }
  return classes.join(' ');
};

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
  showDate?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  comment?: string;
  tabType?: 'member' | 'history';
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
  showDate = true,
  onClick,
  children,
  comment,
  tabType = 'history',
}: Props) => (
    <Card className="px-4 py-4 bg-white" onClick={onClick}>
    <div className="flex items-start gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={otherUser?.image || ""} alt="user" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-left min-w-0 flex-1">
        <div className={getMainContainerClassName(didValue, comment, tabType)}>
          <span className={getNameSpanClassName(didValue, comment, tabType)}>
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
