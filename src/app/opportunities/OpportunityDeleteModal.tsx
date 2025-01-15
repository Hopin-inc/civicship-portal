"use client";

import { Button } from "@/app/components/ui/button";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { DELETE_OPPORTUNITY } from "@/graphql/mutations/opportunity";
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

const OpportunityDeleteModal: React.FC<Props> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [deleteOpportunity] = useMutation(DELETE_OPPORTUNITY, {
    fetchPolicy: "no-cache",
  });

  const onSubmit = async () => {
    await deleteOpportunity({
      variables: { id },
    });
    toast.success("削除しました");
    setIsOpen(false);
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
          <DialogTitle>募集削除</DialogTitle>
        </DialogHeader>
        <p>募集「{id}」を削除しますか？</p>
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

export default OpportunityDeleteModal;
