import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MessageSquare, Phone } from "lucide-react";
import { GqlReservation } from "@/types/graphql";
import { cn } from "@/lib/utils";

interface UserInfoBlockProps {
  reservation: GqlReservation;
  statusLabel: string;
  statusVariant: "primary" | "secondary" | "success" | "outline" | "destructive" | "warning";
}

export function UserInfoBlock({ reservation, statusLabel, statusVariant }: UserInfoBlockProps) {
  const user = reservation.createdByUser;
  const hasPhoneNumber = !!user?.phoneNumber;

  // バリアントに応じた色クラス
  const statusColorClass =
    {
      primary: "bg-primary",
      secondary: "bg-secondary",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
      outline: "bg-muted-foreground",
    }[statusVariant] || "bg-muted-foreground";

  return (
    <div className="space-y-3 p-4">
      {/* アバター・名前・ステータスと連絡ボタン */}
      <div className="flex items-center justify-between gap-3">
        {/* 左側：アバター・名前・ステータス */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 min-w-0">
            {/* ステータス */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span
                className={cn("size-2 rounded-full flex-shrink-0", statusColorClass)}
                aria-label={statusLabel}
              />
              <span className="truncate">{statusLabel}</span>
            </div>

            {/* 名前 */}
            <span className="font-semibold text-body-sm truncate">{user?.name || "未設定"}</span>
          </div>
        </div>

        {/* 右側：連絡するボタン */}
        {hasPhoneNumber && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="tertiary" size="sm" className="flex-shrink-0">
                連絡
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={`tel:${user?.phoneNumber}`} className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  電話
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`sms:${user?.phoneNumber}`} className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  メッセージ(SMS)
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* 自己紹介 */}
      {user?.bio?.trim() && (
        <div className="text-body-sm text-muted-foreground line-clamp-3">{user.bio}</div>
      )}
    </div>
  );
}
