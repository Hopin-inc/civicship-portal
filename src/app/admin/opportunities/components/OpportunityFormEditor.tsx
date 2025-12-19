"use client";

import { FormEvent, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { GqlPublishStatus } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useOpportunityEditor } from "../hooks/useOpportunityEditor";
import { useFormSheets } from "../hooks/useFormSheets";
import { OpportunityFormData, FormEditMode } from "../types";
import { EditDescriptionSheet } from "./EditDescriptionSheet";
import { EditSlotsPage } from "./EditSlotsPage";
import { HostSelectorSheet } from "./HostSelectorSheet";
import { PlaceSelectorSheet } from "./PlaceSelectorSheet";
import { CategorySettingsSection } from "./CategorySettingsSection";
import { ContentSection } from "./ContentSection";
import { SettingsSection } from "./SettingsSection";
import { OperationSection } from "./OperationSection";

interface OpportunityFormEditorProps {
  mode: "create" | "update";
  opportunityId?: string;
  initialData?: Partial<OpportunityFormData>;
  onSuccess?: (id?: string) => void;
}

export const OpportunityFormEditor = ({
  mode,
  opportunityId,
  initialData,
  onSuccess,
}: OpportunityFormEditorProps) => {
  const [editMode, setEditMode] = useState<FormEditMode>('form');
  const editor = useOpportunityEditor({ mode, opportunityId, initialData });
  const sheets = useFormSheets();
  const [selectedHostName, setSelectedHostName] = useState<string | null>(
    initialData?.hostName || null
  );
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(
    initialData?.placeName || null
  );

  // ヘッダー設定（formモード時のみ）
  const headerConfig = useMemo(
    () => editMode === 'form' ? ({
      title: mode === "create" ? "募集作成" : "募集編集",
      showLogo: false,
      showBackButton: true,
    }) : undefined,
    [mode, editMode],
  );
  useHeaderConfig(headerConfig);

  const handleHostSelect = (hostId: string, hostName: string) => {
    editor.setHostUserId(hostId);
    setSelectedHostName(hostName);
  };

  const handlePlaceSelect = (placeId: string, placeName: string) => {
    editor.setPlaceId(placeId);
    setSelectedPlaceName(placeName);
  };

  const handlePublishStatusChange = useCallback(
    (value: string) => {
      editor.setPublishStatus(value as GqlPublishStatus);
    },
    [editor.setPublishStatus]
  );

  const handleSubmit = async (e: FormEvent) => {
    const resultId = await editor.handleSave(e);
    if (resultId) {
      onSuccess?.(resultId);
    }
  };

  // モード切り替えハンドラー
  const enterSlotsMode = useCallback(() => setEditMode('slots'), []);
  const exitSlotsMode = useCallback(() => setEditMode('form'), []);

  // 開催枠編集モードの場合は EditSlotsPage のみ表示
  if (editMode === 'slots') {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <EditSlotsPage
          slots={editor.slots}
          onAddSlotsBatch={editor.addSlotsBatch}
          onUpdateSlot={editor.updateSlot}
          onRemoveSlot={editor.removeSlot}
          onClose={exitSlotsMode}
        />
      </div>
    );
  }

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
        onSlotsClick={enterSlotsMode}
        errors={editor.errors}
      />

      {/* === セクション2: 設定 === */}
      <SettingsSection
        selectedHostName={selectedHostName}
        onHostClick={() => sheets.hostSheet.setOpen(true)}
        selectedPlaceName={selectedPlaceName}
        onPlaceClick={() => sheets.placeSheet.setOpen(true)}
        capacity={editor.capacity}
        onCapacityChange={editor.setCapacity}
        errors={editor.errors}
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
        onPublishStatusChange={handlePublishStatusChange}
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

      <HostSelectorSheet
        open={sheets.hostSheet.open}
        onOpenChange={sheets.hostSheet.setOpen}
        selectedHostId={editor.hostUserId}
        onSelectHost={handleHostSelect}
      />

      <PlaceSelectorSheet
        open={sheets.placeSheet.open}
        onOpenChange={sheets.placeSheet.setOpen}
        selectedPlaceId={editor.placeId}
        onSelectPlace={handlePlaceSelect}
      />
    </form>
  );
};
