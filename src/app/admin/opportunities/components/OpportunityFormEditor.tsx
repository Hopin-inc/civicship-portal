"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { GqlPublishStatus } from "@/types/graphql";
import { useOpportunityEditor } from "../hooks/useOpportunityEditor";
import { useFormSheets } from "../hooks/useFormSheets";
import { OpportunityFormData, PlaceOption } from "../types";
import { EditDescriptionSheet } from "./EditDescriptionSheet";
import { EditSlotsSheet } from "./EditSlotsSheet";
import { HostSelectorSheet } from "./HostSelectorSheet";
import { CategorySettingsSection } from "./CategorySettingsSection";
import { ContentSection } from "./ContentSection";
import { SettingsSection } from "./SettingsSection";
import { OperationSection } from "./OperationSection";

interface OpportunityFormEditorProps {
  mode: "create" | "update";
  opportunityId?: string;
  initialData?: Partial<OpportunityFormData>;
  places: PlaceOption[];
  onSuccess?: (id?: string) => void;
}

export const OpportunityFormEditor = ({
  mode,
  opportunityId,
  initialData,
  places,
  onSuccess,
}: OpportunityFormEditorProps) => {
  const editor = useOpportunityEditor({ mode, opportunityId, initialData });
  const sheets = useFormSheets();
  const [selectedHostName, setSelectedHostName] = useState<string | null>(
    initialData?.hostName || null
  );

  const handleHostSelect = (hostId: string, hostName: string) => {
    editor.setHostUserId(hostId);
    setSelectedHostName(hostName);
  };

  const handleSubmit = async (e: FormEvent) => {
    const resultId = await editor.handleSave(e);
    onSuccess?.(resultId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* === セクション1: コンテンツ（タイトル〜開催枠） === */}
      <ContentSection
        title={editor.title}
        onTitleChange={editor.setTitle}
        summary={editor.summary}
        onSummaryChange={editor.setSummary}
        description={editor.description}
        onDescriptionClick={() => sheets.descriptionSheet.setOpen(true)}
        images={editor.images}
        onImageSelect={editor.handleImageSelect}
        onRemoveImage={editor.removeImage}
        slots={editor.slots}
        onSlotsClick={() => sheets.slotsSheet.setOpen(true)}
      />

      {/* === セクション2: 設定 === */}
      <SettingsSection
        selectedHostName={selectedHostName}
        onHostClick={() => sheets.hostSheet.setOpen(true)}
        placeId={editor.placeId}
        onPlaceIdChange={editor.setPlaceId}
        places={places}
        capacity={editor.capacity}
        onCapacityChange={editor.setCapacity}
      />

      {/* === セクション3: カテゴリ・料金設定 === */}
      <CategorySettingsSection
        mode={mode}
        category={editor.category}
        onCategoryChange={editor.setCategory}
        feeRequired={editor.feeRequired}
        onFeeRequiredChange={editor.setFeeRequired}
        pointsRequired={editor.pointsRequired}
        onPointsRequiredChange={editor.setPointsRequired}
        pointsToEarn={editor.pointsToEarn}
        onPointsToEarnChange={editor.setPointsToEarn}
      />

      {/* === セクション4: 運用・公開設定 === */}
      <OperationSection
        requireHostApproval={editor.requireHostApproval}
        onRequireHostApprovalChange={editor.setRequireHostApproval}
        publishStatus={editor.publishStatus}
        onPublishStatusChange={(v) => editor.setPublishStatus(v as GqlPublishStatus)}
      />

      {/* 送信ボタン */}
      <div className="w-full max-w-[345px] mx-auto">
        <Button
          type="submit"
          variant="primary"
          className="w-full h-[56px]"
          disabled={editor.saving}
        >
          {editor.saving ? "保存中..." : mode === "create" ? "作成" : "更新"}
        </Button>
      </div>

      {/* Sheets */}
      <EditDescriptionSheet
        open={sheets.descriptionSheet.open}
        onOpenChange={sheets.descriptionSheet.setOpen}
        value={editor.description}
        onChange={editor.setDescription}
      />

      <EditSlotsSheet
        open={sheets.slotsSheet.open}
        onOpenChange={sheets.slotsSheet.setOpen}
        slots={editor.slots}
        onAddSlotsBatch={editor.addSlotsBatch}
        onUpdateSlot={editor.updateSlot}
        onRemoveSlot={editor.removeSlot}
      />

      <HostSelectorSheet
        open={sheets.hostSheet.open}
        onOpenChange={sheets.hostSheet.setOpen}
        selectedHostId={editor.hostUserId}
        onSelectHost={handleHostSelect}
      />
    </form>
  );
};
