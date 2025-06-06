"use client";

import { useMemo, useState } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardWrapper } from "@/components/ui/card-wrapper";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  GqlSortDirection,
  useCreateUtilityMutation,
  useGetUtilitiesQuery,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { useAuth } from "@/contexts/AuthProvider";

export default function UtilitiesPage() {
  const headerConfig = useMemo(
    () => ({
      title: "チケットの種類管理",
      showBackButton: true,
      showLogo: false,
      backTo: "/admin/tickets",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { user } = useAuth();

  const [showUtilityForm, setShowUtilityForm] = useState(false);
  const [utilityName, setUtilityName] = useState("");
  const [utilityDescription, setUtilityDescription] = useState("");
  const [pointsRequired, setPointsRequired] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createUtility] = useCreateUtilityMutation();

  const { data: utilityData, refetch: refetchUtilities } = useGetUtilitiesQuery({
    variables: {
      filter: { communityIds: [COMMUNITY_ID], ownerIds: [user?.id ?? ""] },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
  });

  const utilityList = utilityData?.utilities?.edges?.map((e) => e?.node) ?? [];

  const handleCreateUtility = async () => {
    setIsSubmitting(true);
    try {
      const res = await createUtility({
        variables: {
          input: {
            name: utilityName,
            description: utilityDescription || undefined,
            pointsRequired,
            images: [],
          },
          permission: { communityId: COMMUNITY_ID },
        },
      });
      const id = res.data?.utilityCreate?.utility?.id;
      if (id) {
        toast.success("ユーティリティを作成しました");
        setShowUtilityForm(false);
        setUtilityName("");
        setUtilityDescription("");
        setPointsRequired(1);
        await refetchUtilities();
      } else {
        toast.error("ユーティリティ作成に失敗しました");
      }
    } catch {
      toast.error("ユーティリティ作成エラー");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">チケットの種類一覧</h2>
          <Sheet open={showUtilityForm} onOpenChange={setShowUtilityForm}>
            <SheetTrigger asChild>
              <Button>新規追加</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
              <SheetHeader className="text-left pb-6">
                <SheetTitle>新しいチケットの種類を追加</SheetTitle>
                <SheetDescription>
                  チケットの種類の詳細を入力してください。
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4">
                <div>
                  <Label>チケット名</Label>
                  <Input value={utilityName} onChange={(e) => setUtilityName(e.target.value)} />
                </div>
                <div>
                  <Label>説明</Label>
                  <Input
                    value={utilityDescription}
                    onChange={(e) => setUtilityDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label>交換ポイント</Label>
                  <Input
                    type="number"
                    min={0}
                    value={pointsRequired}
                    onChange={(e) => setPointsRequired(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-3">
                  <Button onClick={handleCreateUtility} disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "作成中..." : "チケットの種類を作成"}
                  </Button>
                  <Button
                    variant="tertiary"
                    onClick={() => setShowUtilityForm(false)}
                    className="w-full"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="space-y-2">
          {utilityList.length === 0 ? (
            <p className="text-muted-foreground">チケットの種類がありません</p>
          ) : (
            utilityList.map((utility) => (
              <CardWrapper key={utility?.id} className="p-4">
                <div className="text-sm">
                  <div className="font-semibold">{utility?.name}</div>
                  <div className="text-muted-foreground">{utility?.description}</div>
                  <div>交換ポイント: {utility?.pointsRequired}</div>
                </div>
              </CardWrapper>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
