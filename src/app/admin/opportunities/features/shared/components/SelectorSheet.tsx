"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Item } from "@/components/ui/item";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

interface SelectorSheetProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  emptyMessage: string;
  items: T[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (item: T) => void;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  getItemKey: (item: T) => string;
}

export function SelectorSheet<T>({
  open,
  onOpenChange,
  title,
  emptyMessage,
  items,
  loading,
  selectedId,
  onSelect,
  renderItem,
  getItemKey,
}: SelectorSheetProps<T>) {
  const handleSelect = (item: T) => {
    onSelect(item);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-8 overflow-y-auto max-h-[70vh]"
      >
        <SheetHeader className="text-left pb-6 text-title-sm">
          <SheetTitle className="text-title-sm">{title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {loading && <LoadingIndicator />}

          {!loading && items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {emptyMessage}
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="space-y-2">
              {items.map((item) => {
                const itemKey = getItemKey(item);
                const isSelected = selectedId === itemKey;

                return (
                  <Item
                    key={itemKey}
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSelect(item);
                      } else if (e.key === "Escape") {
                        onOpenChange(false);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {renderItem(item, isSelected)}
                  </Item>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
