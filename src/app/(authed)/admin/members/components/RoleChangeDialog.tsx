"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GqlRole } from "@/types/graphql";
import { roleLabels } from "./MemberRow";

interface RoleChangeDialogProps {
  isOpen: boolean;
  userName: string;
  newRole: GqlRole;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RoleChangeDialog({
  isOpen,
  userName,
  newRole,
  isLoading,
  onConfirm,
  onCancel,
}: RoleChangeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-[90vw] max-w-[400px] rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-left text-body-sm font-bold pb-2">
            権限の変更を確定しますか？
          </DialogTitle>
          <DialogDescription className="text-left">
            <strong className="px-1">{userName}</strong>
            の権限を
            <strong className="px-1">{roleLabels[newRole]}</strong>
            に変更します。よろしいですか？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button variant="tertiary" className="w-full py-4">
              やめる
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-4"
          >
            {isLoading ? "変更中..." : "権限を変更"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
