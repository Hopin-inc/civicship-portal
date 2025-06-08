"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  useCreateUtilityMutation,
  useGetOpportunitiesQuery,
  GqlSortDirection,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { useAuth } from "@/contexts/AuthProvider";

interface CreateUtilitySheetProps {
  onUtilityCreated: () => Promise<void>;
}

export default function CreateUtilitySheet({ onUtilityCreated }: CreateUtilitySheetProps) {
  const [showUtilityForm, setShowUtilityForm] = useState(false);
  const [step, setStep] = useState<"opportunities" | "details">("opportunities");
  const [utilityName, setUtilityName] = useState("");
  const [utilityDescription, setUtilityDescription] = useState("");
  const [pointsRequired, setPointsRequired] = useState(1);
  const [selectedOpportunityIds, setSelectedOpportunityIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const [createUtility] = useCreateUtilityMutation();

  const { data: opportunityData, loading: opportunitiesLoading } = useGetOpportunitiesQuery({
    variables: {
      filter: {
        communityIds: [COMMUNITY_ID],
        createdByUserIds: [user?.id ?? ""],
      },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
    skip: !user?.id,
  });

  const opportunityList = opportunityData?.opportunities?.edges?.map((e) => e?.node) ?? [];

  useEffect(() => {
    if (opportunityList.length > 0 && selectedOpportunityIds.length === 0) {
      const allOpportunityIds = opportunityList.map(opp => opp?.id).filter(Boolean) as string[];
      setSelectedOpportunityIds(allOpportunityIds);
    }
  }, [opportunityList, selectedOpportunityIds.length]);

  const allOpportunityIds = opportunityList.map(opp => opp?.id).filter(Boolean) as string[];
  const isAllSelected = allOpportunityIds.length > 0 && allOpportunityIds.every(id => selectedOpportunityIds.includes(id));
  const isNoneSelected = selectedOpportunityIds.length === 0;
  const isPartiallySelected = !isAllSelected && !isNoneSelected;

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
            requiredForOpportunityIds: selectedOpportunityIds.length > 0 ? selectedOpportunityIds : undefined,
            communityId: COMMUNITY_ID,
          },
          permission: { communityId: COMMUNITY_ID },
        },
      });
      const id = res.data?.utilityCreate?.utility?.id;
      if (id) {
        toast.success("ユーティリティを作成しました");
        handleReset();
        await onUtilityCreated();
      } else {
        toast.error("ユーティリティ作成に失敗しました");
      }
    } catch {
      toast.error("ユーティリティ作成エラー");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setShowUtilityForm(false);
    setStep("opportunities");
    setUtilityName("");
    setUtilityDescription("");
    setPointsRequired(1);
    setSelectedOpportunityIds([]);
  };

  const handleNextStep = () => {
    setStep("details");
  };

  const handleBackStep = () => {
    setStep("opportunities");
  };

  const handleOpportunityToggle = (opportunityId: string, checked: boolean) => {
    if (checked) {
      setSelectedOpportunityIds(prev => [...prev, opportunityId]);
    } else {
      setSelectedOpportunityIds(prev => prev.filter(id => id !== opportunityId));
    }
  };

  const handleSelectAllToggle = (checked: boolean) => {
    if (checked) {
      setSelectedOpportunityIds(allOpportunityIds);
    } else {
      setSelectedOpportunityIds([]);
    }
  };

  return (
    <Sheet open={ showUtilityForm } onOpenChange={ setShowUtilityForm }>
      <SheetTrigger asChild>
        <Button>新規追加</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
        <SheetHeader className="text-left pb-6">
          <SheetTitle>
            { step === "opportunities" && "機会を選択" }
            { step === "details" && "チケットの詳細を入力" }
          </SheetTitle>
          <SheetDescription>
            { step === "opportunities" && "このチケットに関連する機会を選択してください。" }
            { step === "details" && "チケットの種類の詳細を入力してください。" }
          </SheetDescription>
        </SheetHeader>

        { step === "opportunities" && (
          <div className="space-y-4">
            <div>
              <Label>関連する機会（オプション）</Label>
              { opportunitiesLoading ? (
                <p className="text-sm text-muted-foreground">機会を読み込み中...</p>
              ) : opportunityList.length === 0 ? (
                <p className="text-sm text-muted-foreground">作成した機会がありません</p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Checkbox
                      id="select-all-opportunities"
                      checked={ isAllSelected }
                      ref={ (el) => {
                        if (el && "indeterminate" in el) {
                          (el as any).indeterminate = isPartiallySelected;
                        }
                      } }
                      onCheckedChange={ (checked) => handleSelectAllToggle(checked as boolean) }
                    />
                    <Label
                      htmlFor="select-all-opportunities"
                      className="text-sm font-medium cursor-pointer"
                    >
                      すべて選択
                    </Label>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    { opportunityList.map((opportunity) => (
                      <div key={ opportunity?.id } className="flex items-start space-x-2">
                        <Checkbox
                          id={ `opportunity-${ opportunity?.id }` }
                          checked={ selectedOpportunityIds.includes(opportunity?.id ?? "") }
                          onCheckedChange={ (checked) =>
                            handleOpportunityToggle(opportunity?.id ?? "", checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={ `opportunity-${ opportunity?.id }` }
                          className="text-sm font-medium cursor-pointer"
                        >
                          { opportunity?.title }
                        </Label>
                      </div>
                    )) }
                  </div>
                </div>
              ) }
            </div>
            <div className="space-y-3">
              <Button onClick={ handleNextStep } className="w-full">
                次へ
              </Button>
              <Button
                variant="tertiary"
                onClick={ handleReset }
                className="w-full"
              >
                キャンセル
              </Button>
            </div>
          </div>
        ) }

        { step === "details" && (
          <div className="space-y-4">
            <div>
              <Label>チケット名</Label>
              <Input value={ utilityName } onChange={ (e) => setUtilityName(e.target.value) } />
            </div>
            <div>
              <Label>説明</Label>
              <Input
                value={ utilityDescription }
                onChange={ (e) => setUtilityDescription(e.target.value) }
              />
            </div>
            <div>
              <Label>交換ポイント</Label>
              <Input
                type="number"
                min={ 0 }
                value={ pointsRequired }
                onChange={ (e) => setPointsRequired(Number(e.target.value)) }
              />
            </div>
            <div className="space-y-3">
              <Button
                onClick={ handleCreateUtility }
                disabled={ isSubmitting || !utilityName.trim() }
                className="w-full"
              >
                { isSubmitting ? "作成中..." : "チケットの種類を作成" }
              </Button>
              <Button
                variant="tertiary"
                onClick={ handleBackStep }
                className="w-full"
              >
                戻る
              </Button>
            </div>
          </div>
        ) }
      </SheetContent>
    </Sheet>
  );
}
