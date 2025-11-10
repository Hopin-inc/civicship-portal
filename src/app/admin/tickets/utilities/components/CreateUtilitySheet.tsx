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
import { toast } from "react-toastify";
import {
  useCreateUtilityMutation,
  useGetOpportunitiesQuery,
  GqlSortDirection,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useAuth } from "@/contexts/AuthProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckedState } from "@radix-ui/react-checkbox";

interface CreateUtilitySheetProps {
  buttonLabel: string;
  onUtilityCreated: () => Promise<void>;
}

const POINTS_REQUIRED = 100;

export default function CreateUtilitySheet({ buttonLabel, onUtilityCreated }: CreateUtilitySheetProps) {
  const [showUtilityForm, setShowUtilityForm] = useState(false);
  const [step, setStep] = useState<"opportunities" | "details">("opportunities");
  const [utilityName, setUtilityName] = useState("");
  const [utilityDescription, setUtilityDescription] = useState("");
  const [pointsRequired, setPointsRequired] = useState(POINTS_REQUIRED);
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
      first: 200,
    },
    skip: !user?.id,
  });

  const opportunityList = opportunityData?.opportunities?.edges?.map((e) => e?.node) ?? [];

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
    } catch (error) {
      toast.error("ユーティリティ作成に失敗しました");
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

  const handleOpportunityToggle = (opportunityId: string, checked: CheckedState) => {
    if (checked) {
      setSelectedOpportunityIds(prev => [...prev, opportunityId]);
    } else {
      setSelectedOpportunityIds(prev => prev.filter(id => id !== opportunityId));
    }
  };

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      setSelectedOpportunityIds([]);
    } else {
      setSelectedOpportunityIds(allOpportunityIds);
    }
  };

  return (
    <Sheet open={ showUtilityForm } onOpenChange={ setShowUtilityForm }>
      <SheetTrigger asChild>
        <Button>{ buttonLabel }</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
        <SheetHeader className="text-left pb-6">
          <SheetTitle>
            { step === "opportunities" && "体験を選択" }
            { step === "details" && "チケットの詳細を入力" }
          </SheetTitle>
          <SheetDescription>
            { step === "opportunities" && "このチケットで利用できるようにしたい体験を選択してください。" }
            { step === "details" && "チケットの種類の詳細を入力してください。" }
          </SheetDescription>
        </SheetHeader>

        { step === "opportunities" && (
          <div className="space-y-4">
            <div>
              <Label>体験を選択</Label>
              { opportunitiesLoading ? (
                <p className="text-sm text-muted-foreground">体験を読み込み中...</p>
              ) : opportunityList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  紐付けられる体験がありません。<br />
                  まずは主催する体験を追加してください。
                </p>
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
                      onCheckedChange={ handleSelectAllToggle }
                    />
                    <Label
                      htmlFor="select-all-opportunities"
                      className="text-sm font-medium cursor-pointer"
                    >
                      すべて選択
                    </Label>
                  </div>
                  <ScrollArea className="max-h-80">
                    <div className="space-y-2">
                      { opportunityList.map((opportunity) => {
                        const isSelected = selectedOpportunityIds.includes(opportunity?.id ?? "");
                        return (
                          <div
                            key={ opportunity?.id }
                            className={ `flex items-start space-x-2 p-3 rounded-lg border-2 transition-colors ${
                              isSelected
                                ? "border-primary bg-primary-foreground"
                                : "border-border hover:border-primary/50"
                            }` }
                          >
                            <Checkbox
                              id={ `opportunity-${ opportunity?.id }` }
                              checked={ isSelected }
                              onCheckedChange={ (checked) =>
                                handleOpportunityToggle(opportunity?.id ?? "", checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={ `opportunity-${ opportunity?.id }` }
                              className="text-sm font-medium cursor-pointer flex-1"
                            >
                              { opportunity?.title }
                            </Label>
                          </div>
                        );
                      }) }
                    </div>
                  </ScrollArea>
                </div>
              ) }
            </div>
            <div className="space-y-3">
              <Button
                onClick={ handleNextStep }
                disabled={ opportunityList.length === 0 }
                className="w-full"
              >
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
              <Label>チケット名 (管理用)</Label>
              <Input value={ utilityName } onChange={ (e) => setUtilityName(e.target.value) } />
              <p className="text-body-sm text-muted-foreground mt-1">
                チケットを贈る相手には表示されません。
              </p>
            </div>
            <div>
              <Label>コメント</Label>
              <Input
                value={ utilityDescription }
                onChange={ (e) => setUtilityDescription(e.target.value) }
              />
              <p className="text-body-sm text-muted-foreground mt-1">
                チケットを贈る相手に表示されるメッセージを設定できます。
              </p>
            </div>
            {/*<div>*/ }
            {/*  <Label>交換ポイント</Label>*/ }
            {/*  <Input*/ }
            {/*    type="number"*/ }
            {/*    min={ 0 }*/ }
            {/*    value={ pointsRequired }*/ }
            {/*    onChange={ (e) => setPointsRequired(Number(e.target.value)) }*/ }
            {/*  />*/ }
            {/*  <p className="text-body-sm text-muted-foreground mt-1">*/ }
            {/*    チケットの交換に必要なポイント数です。*/ }
            {/*  </p>*/ }
            {/*</div>*/ }
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
