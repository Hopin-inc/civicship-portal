import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone, MessageSquare, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { GqlReservation } from "@/types/graphql";

interface UserInfoBlockProps {
  reservation: GqlReservation;
  statusLabel: string;
  statusVariant: "primary" | "secondary" | "success" | "outline" | "destructive" | "warning";
}

export function UserInfoBlock({ reservation, statusLabel, statusVariant }: UserInfoBlockProps) {
  const user = reservation.createdByUser;
  const hasPhoneNumber = !!user?.phoneNumber;

  // バリアントに応じた色クラス
  const statusColorClass = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    outline: "bg-muted-foreground",
  }[statusVariant] || "bg-muted-foreground";

  return (
    <div className="space-y-3 rounded-xl border p-4 bg-card">
      {/* ステータスと連絡ボタン */}
      <div className="flex items-start justify-between gap-3">
        {/* ステータス */}
        <div className="flex items-center gap-1.5 text-label-sm">
          <span
            className={cn("size-2.5 rounded-full", statusColorClass)}
            aria-label={statusLabel}
          />
          <span>{statusLabel}</span>
        </div>

        {/* 連絡するボタン */}
        {hasPhoneNumber && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="tertiary" size="sm">
                連絡する
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={`tel:${user?.phoneNumber}`} className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  電話する
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`sms:${user?.phoneNumber}`} className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  メッセージを送る
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* ユーザー情報 */}
      <div className="flex items-start gap-2.5">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="font-semibold text-body-md">{user?.name || "未設定"}</div>
          {user?.bio?.trim() && (
            <div className="text-body-sm text-muted-foreground line-clamp-3">{user.bio}</div>
          )}
        </div>
      </div>
    </div>
  );
}
