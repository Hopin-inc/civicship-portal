"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import IconWrapper from "@/components/shared/IconWrapper";
import { useAuthStore } from "@/stores/auth-store";

const NotesSection = () => {
  const { authenticationState } = useAuthStore();
  const isAuthenticated = authenticationState === "user_registered";
  return (
    <div className="rounded-lg p-6 mb-6">
      <h3 className="text-display-sm mb-6">注意事項</h3>
      <div className="space-y-4">
        {!isAuthenticated && (
          <div className="flex items-start gap-3">
            <IconWrapper color="warning">
              <AlertCircle size={18} strokeWidth={1.5} />
            </IconWrapper>
            <p className="text-body-md flex-1 font-bold">
              この先はログインが必要です。ボタンを押し、ログインしてから再度お申し込みください。
            </p>
          </div>
        )}
        <div className="flex items-start gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={18} strokeWidth={1.5} />
          </IconWrapper>
          <p className="text-body-md flex-1 font-bold">ホストによる確認後に、予約が確定します。</p>
        </div>
        <div className="flex items-start gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={18} strokeWidth={1.5} />
          </IconWrapper>
          <p className="text-body-md flex-1">
            実施確定または中止のどちらの場合でも、公式LINEからご連絡します。
          </p>
        </div>
        <div className="flex items-start gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={18} strokeWidth={1.5} />
          </IconWrapper>
          <p className="text-body-md flex-1">当日は現金をご用意下さい。</p>
        </div>
        <div className="flex items-start gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={18} strokeWidth={1.5} />
          </IconWrapper>
          <p className="text-body-md flex-1">キャンセルは開催日の前日まで可能です。</p>
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
