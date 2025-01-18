"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { signInWithLine } from "@/lib/firebase";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    await signInWithLine();
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ログイン</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center mt-4">
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "ログイン中..." : "LINEでログイン"}
          </Button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
