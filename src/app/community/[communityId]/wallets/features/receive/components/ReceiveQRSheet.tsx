"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useReceiveUrl } from "../hooks/useReceiveUrl";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

interface ReceiveQRSheetProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

export function ReceiveQRSheet({ userId, open, onClose }: ReceiveQRSheetProps) {
  const t = useTranslations();
  const { url } = useReceiveUrl(userId);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("wallets.receive.copySuccess"));
    } catch {
      toast.error(t("wallets.receive.copyFailed"));
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent side="bottom" className="pb-10">
        <SheetHeader className="mb-6">
          <SheetTitle>{t("wallets.receive.title")}</SheetTitle>
          <SheetDescription className="text-xs">{t("wallets.receive.description")}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col items-center gap-6">
          {url && (
            <div className="p-4 bg-white rounded-lg border">
              <QRCode value={url} size={200} />
            </div>
          )}

          <Button variant="outline" className="w-full max-w-xs" onClick={handleCopy} disabled={!url}>
            <Copy className="w-4 h-4 mr-2" />
            {t("wallets.receive.copyLink")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
