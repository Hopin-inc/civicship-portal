"use client";

import { Button } from "@/app/components/ui/button";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { COMMUNITY_DELETE } from "@/graphql/mutations/community";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";

type Props = {
  id: string;
};

const CommunityDeleteModal: React.FC<Props> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [deleteCommunity] = useMutation(COMMUNITY_DELETE, {
    fetchPolicy: "no-cache",
  });

  const onSubmit = async () => {
    try {
      await deleteCommunity({
        variables: { id },
      });
      toast.success("コミュニティを削除しました。");
      setIsOpen(false);
    } catch (error) {
      toast.error("削除中にエラーが発生しました。");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          削除
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>コミュニティ削除</DialogTitle>
        </DialogHeader>
        <p>コミュニティ「{id}」を削除しますか？</p>
        <DialogFooter className="flex gap-2">
          <Button onClick={onSubmit} variant="destructive">削除</Button>
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityDeleteModal;
