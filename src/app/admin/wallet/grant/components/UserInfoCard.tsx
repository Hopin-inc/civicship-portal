import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GqlUser } from "@/types/graphql";
import { formatDateTime } from "@/utils/date";
import React from "react";

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
}: Props) => (
  <Card className="rounded-2xl border border-gray-200 flex items-start px-4 py-3" onClick={onClick}>
    <Avatar className="mt-1">
      <AvatarImage src={otherUser?.image || ""} />
      <AvatarFallback>{otherUser?.name?.[0] || "U"}</AvatarFallback>
    </Avatar>
    <div className="flex-1 ml-4 min-w-0">
      <div className="flex justify-between items-center min-w-0">
        <span className="font-bold text-sm truncate max-w-[140px]">
          {showLabel
            ? typeof label === "string"
              ? label
              : label && (
                  <span className="transaction-label flex items-center min-w-0">
                    <span className="truncate">{label.text.replace(label.smallText, "")}</span>
                    <span className="text-xs flex-shrink-0">{label.smallText}</span>
                  </span>
                )
            : otherUser?.name
              ? `{{ ${otherUser.name} }}`
              : ""}
        </span>
        {showPoint && point !== undefined && (
          <span className={`font-bold text-xs ${pointColor ?? ""}`}>
            {sign}
            {point.toLocaleString()}pt
          </span>
        )}
      </div>
      {showDid && <div className="text-gray-400 text-sm truncate mt-1">{didValue}</div>}
      {showDate && (
        <div className="text-gray-400 text-sm">
          {formatDateTime(createdAt ?? null, "yyyy年MM月dd日 HH時mm分")}
        </div>
      )}
      {children}
    </div>
  </Card>
);

export default UserInfoCard;
