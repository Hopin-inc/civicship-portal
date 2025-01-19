"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { PARTICIPATION_INVITE } from "@/graphql/mutations/participation";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";

type Props = {
  opportunityId: string;
};

const ParticipationInviteModal: React.FC<Props> = ({ opportunityId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [invitedUserId, setInvitedUserId] = useState("");

  const [inviteParticipation, { loading }] = useMutation(PARTICIPATION_INVITE);

  const handleSubmit = async () => {
    try {
      await inviteParticipation({
        variables: {
          input: {
            invitedUserId,
            opportunityId,
          },
        },
      });
      toast.success("招待を送信しました！");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("招待の送信に失敗しました。");
    }
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} variant="default">
        ユーザーを招待
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ユーザーを招待</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="invitedUserId" className="block text-sm font-medium">
                招待するユーザーID
              </label>
              <Input
                id="invitedUserId"
                placeholder="ユーザーIDを入力してください"
                value={invitedUserId}
                onChange={(e) => setInvitedUserId(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" variant="default" disabled={loading}>
                {loading ? "送信中..." : "招待を送信"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">キャンセル</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticipationInviteModal;
