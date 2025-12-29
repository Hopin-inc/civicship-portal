"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GqlRole } from "@/types/graphql";
import { PresentedMember } from "../presenters/types";

const ROLE_OPTIONS: { value: GqlRole; label: string }[] = [
  { value: GqlRole.Owner, label: "管理者" },
  { value: GqlRole.Manager, label: "運用担当者" },
  { value: GqlRole.Member, label: "参加者" },
];

interface RoleChangeDialogProps {
  member: PresentedMember | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (newRole: GqlRole) => void;
}

export function RoleChangeDialog({ member, open, onClose, onConfirm }: RoleChangeDialogProps) {
  const [selectedRole, setSelectedRole] = useState<GqlRole | null>(null);

  // member が変わったら初期選択をリセット
  React.useEffect(() => {
    setSelectedRole(member?.roleValue ?? null);
  }, [member]);

  if (!member) return null;

  const handleConfirm = () => {
    if (selectedRole) {
      onConfirm(selectedRole);
    }
  };

  const hasChanged = selectedRole !== member.roleValue;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[90vw] max-w-[400px] rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-left text-body-sm font-bold pb-2">
            権限を変更
          </DialogTitle>
          <DialogDescription className="text-left">
            <strong className="px-1">{member.name}</strong>
            の権限を変更します
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="text-label-sm font-bold mb-2 block">新しい権限</label>
          <Select
            value={selectedRole ?? undefined}
            onValueChange={(value) => setSelectedRole(value as GqlRole)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="権限を選択" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button variant="tertiary" className="w-full py-4">
              キャンセル
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!hasChanged}
            className="w-full py-4"
          >
            変更する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
