"use client";

import { Button } from "@/app/components/ui/button";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { DELETE_ACTIVITY } from "@/graphql/mutations/activity";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";

type Props = {
  id: string;
};

const ActivityDeleteModal: React.FC<Props> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [deleteActivity] = useMutation(DELETE_ACTIVITY, {
    fetchPolicy: "no-cache",
  });

  const onSubmit = async () => {
    await deleteActivity({
      variables: { id },
    });
    toast.success("削除完了!");
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
          <DialogTitle>活動削除</DialogTitle>
        </DialogHeader>
        <p>活動「{id}」を削除しますか？</p>
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

export default ActivityDeleteModal;
