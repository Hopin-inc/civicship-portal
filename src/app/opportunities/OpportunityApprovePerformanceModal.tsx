"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { PARTICIPATION_APPROVE_PERFORMANCE } from "@/graphql/mutations/participation";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Check } from "lucide-react";
import React, { useState } from "react";

const FormSchema = z.object({
  participationId: z.string({
    required_error: "参加IDを入力してください。",
  }),
});

const ParticipationApprovePerformanceModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [approvePerformance] = useMutation(PARTICIPATION_APPROVE_PERFORMANCE, {
    fetchPolicy: "no-cache",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      participationId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await approvePerformance({
        variables: {
          id: data.participationId,
        },
      });
      toast.success("パフォーマンスの承認が完了しました！");
      setIsOpen(false);
    } catch (error) {
      toast.error("承認中にエラーが発生しました。");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Check />
          新規承認
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>パフォーマンスを承認</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="participationId"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel required>参加ID</FormLabel>
                    <FormControl>
                      <Input placeholder="参加IDを入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">承認</Button>
              <DialogClose asChild>
                <Button variant="outline">キャンセル</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipationApprovePerformanceModal;
