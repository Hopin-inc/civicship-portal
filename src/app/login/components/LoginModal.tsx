"use client";

import { useCallback, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { RawURIComponent } from "@/utils/path";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  nextPath?: RawURIComponent;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, nextPath }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithLiff, authLoading } = useAuth();

  const handleLogin = async () => {
    if (!agreedTerms || !agreedPrivacy) {
      setError("すべての同意が必要です");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loginWithLiff(nextPath);
      setIsLoading(false);
      onClose();
    } catch (err) {
      setError("ログインに失敗しました");
      setIsLoading(false);
    }
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose();
    },
    [onClose],
  );

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="min-h-[240px] max-h-[90dvh] rounded-t-2xl p-12 max-w-mobile-l mx-auto w-full overflow-y-auto"
      >
        <SheetTitle className={"text-body-md mb-4"}>
          <div className="text-body-md mb-6">
            <strong className="font-bold">{currentCommunityConfig.title}</strong>
            を利用するにはLINEでログインして下さい
          </div>
        </SheetTitle>
        <div className="flex flex-col items-start space-y-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <Checkbox
                id="agree-terms"
                checked={agreedTerms}
                className="w-5 h-5"
                disabled={isLoading || authLoading}
                onCheckedChange={(checked) => setAgreedTerms(!!checked)}
              />
              <Label htmlFor="agree-terms" className="text-label-md text-muted-foreground">
                <Link href="/terms" className="underline">
                  利用規約
                </Link>
                <span className="text-label-sm">に同意する</span>
              </Label>
            </div>

            <div className="flex items-center space-x-4">
              <Checkbox
                id="agree-privacy"
                checked={agreedPrivacy}
                className="w-5 h-5"
                disabled={isLoading || authLoading}
                onCheckedChange={(checked) => setAgreedPrivacy(!!checked)}
              />
              <Label htmlFor="agree-privacy" className="text-label-md text-muted-foreground">
                <Link href="/privacy" className="underline">
                  プライバシーポリシー
                </Link>
                <span className="text-label-sm">に同意する</span>
              </Label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

          <Button
            onClick={handleLogin}
            disabled={isLoading || authLoading}
            className="w-full bg-[#06C755] hover:bg-[#05B74B] text-white rounded-full h-14 flex items-center justify-center gap-2"
          >
            <Image src="/images/line-icon.png" alt="LINE" width={24} height={24} priority />
            {isLoading || authLoading ? "ログイン中..." : "LINEでログイン"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LoginModal;
