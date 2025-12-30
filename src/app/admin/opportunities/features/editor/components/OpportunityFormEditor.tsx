"use client";

import { FormEvent, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { GqlPublishStatus } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useOpportunityEditor } from "../hooks/useOpportunityEditor";
import { useFormSheets } from "../hooks/useFormSheets";
import { OpportunityFormData, FormEditMode } from "../types/form";
import { EditSlotsPage } from "../../slots/components/EditSlotsPage";
import { OpportunityForm } from "./OpportunityForm";
import { OpportunityFormSheets } from "./OpportunityFormSheets";
import { useSlotsBulkSave } from "../../slots/hooks/useSlotsBulkSave";

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

  // 開催枠専用保存フック（更新モードのみ）
  const slotsBulkSave = mode === "update" && opportunityId
    ? useSlotsBulkSave({
        opportunityId,
        capacity: editor.capacity,
      })
    : null;

  // ヘッダー設定（formモード時のみ）
  const headerConfig = useMemo(
    () => editMode === 'form' ? ({
      title: mode === "create" ? "募集作成" : "募集編集",
      showLogo: false,
      showBackButton: true,
      hideFooter: true,
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
    [editor]
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

  // スロット保存ハンドラー
  const handleSlotsSave = useCallback(async () => {
    // 更新モード：開催枠のみサーバーに保存
    if (mode === "update" && slotsBulkSave) {
      const success = await slotsBulkSave.handleSave(editor.slots);
      if (success) {
        editor.resetSlotChanges();
        exitSlotsMode();
      }
      return;
    }

    // 作成モード：ローカル状態のみ更新（サーバー保存なし）
    if (mode === "create") {
      editor.resetSlotChanges();
      exitSlotsMode();
      toast.success("開催枠を設定しました");
      return;
    }
  }, [mode, editor, exitSlotsMode, slotsBulkSave]);

  // 開催枠編集モードの場合は EditSlotsPage のみ表示
  if (editMode === 'slots') {
    const isSaving = mode === "update" && slotsBulkSave
      ? slotsBulkSave.saving
      : false;

    return (
      <EditSlotsPage
        mode={mode}
        slots={editor.slots}
        onAddSlotsBatch={editor.addSlotsBatch}
        onUpdateSlot={editor.updateSlot}
        onRemoveSlot={editor.removeSlot}
        onCancelSlot={editor.cancelSlot}
        onSave={handleSlotsSave}
        isDirty={editor.hasSlotChanges}
        isSubmitting={isSaving}
        onClose={exitSlotsMode}
      />
    );
  }

  return (
    <>
      <OpportunityForm
        mode={mode}
        editor={editor}
        onSubmit={handleSubmit}
        onDescriptionClick={() => sheets.descriptionSheet.setOpen(true)}
        onSlotsClick={enterSlotsMode}
        onHostClick={() => sheets.hostSheet.setOpen(true)}
        onPlaceClick={() => sheets.placeSheet.setOpen(true)}
        selectedHostName={selectedHostName}
        selectedPlaceName={selectedPlaceName}
        onPublishStatusChange={handlePublishStatusChange}
      />

      <OpportunityFormSheets
        descriptionSheetOpen={sheets.descriptionSheet.open}
        onDescriptionSheetChange={sheets.descriptionSheet.setOpen}
        description={editor.description}
        onDescriptionChange={editor.setDescription}
        hostSheetOpen={sheets.hostSheet.open}
        onHostSheetChange={sheets.hostSheet.setOpen}
        selectedHostId={editor.hostUserId}
        onSelectHost={handleHostSelect}
        placeSheetOpen={sheets.placeSheet.open}
        onPlaceSheetChange={sheets.placeSheet.setOpen}
        selectedPlaceId={editor.placeId}
        onSelectPlace={handlePlaceSelect}
      />
    </>
  );
};
