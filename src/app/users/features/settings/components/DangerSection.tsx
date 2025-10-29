"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthProvider";
import { LogOut, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DangerSection() {
  const t = useTranslations();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-0">
            <button
              type="button"
              className="flex items-center justify-between py-4 px-4 border-b w-full text-left"
              onClick={() => setOpen(true)}
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                <span className="font-bold text-sm flex items-center gap-2">
                  {t("users.danger.signOut")}
                </span>
              </span>
            </button>
          {/* TODO : 表示可能になるまでコメントアウト */}
          {/* <div className="flex items-center gap-3 py-4 px-4 border-b">
            <XCircle className="w-5 h-5" />
            <span className="font-bold text-sm text-gray-400">このアカウントを削除する</span>
          </div> */}
        </CardContent>
      </Card>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="mb-4">{t("users.danger.signOutConfirm")}</p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setOpen(false)}
              >
                {t("users.danger.cancel")}
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                {t("users.danger.signOut")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
