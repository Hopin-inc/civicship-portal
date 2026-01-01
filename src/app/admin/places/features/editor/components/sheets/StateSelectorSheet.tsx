"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { Check } from "lucide-react";
import { GET_STATES } from "../../queries";

interface StateSelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStateCode: string | null;
  onSelectState: (code: string, name: string) => void;
}

interface State {
  code: string;
  name: string;
}

export function StateSelectorSheet({
  open,
  onOpenChange,
  selectedStateCode,
  onSelectState,
}: StateSelectorSheetProps) {
  // 都道府県マスタを取得
  const { data, loading } = useQuery(GET_STATES, {
    variables: { first: 50 }, // 日本の都道府県は47なので50で十分
    skip: !open,
    fetchPolicy: "cache-first", // 都道府県は変わらないのでキャッシュ優先
  });

  // statesリストを作成
  const states = useMemo<State[]>(() => {
    return (data?.states?.edges || [])
      .map((edge: any) => {
        const state = edge?.node;
        if (state && state.code && state.name) {
          return {
            code: state.code,
            name: state.name,
          };
        }
        return null;
      })
      .filter((state: State | null): state is State => state !== null);
  }, [data]);

  const handleSelect = (state: State) => {
    onSelectState(state.code, state.name);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-8 overflow-y-auto max-h-[70vh]"
      >
        <SheetHeader className="text-left pb-4 text-title-sm">
          <SheetTitle className="text-title-sm">都道府県を選択</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {loading && <LoadingIndicator />}

          {!loading && states.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              都道府県が見つかりませんでした
            </div>
          )}

          {!loading && states.length > 0 && (
            <div className="space-y-2">
              {states.map((state) => {
                const isSelected = selectedStateCode === state.code;

                return (
                  <Item
                    key={state.code}
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(state)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSelect(state);
                      } else if (e.key === "Escape") {
                        onOpenChange(false);
                      }
                    }}
                    className="cursor-pointer relative"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <ItemContent>
                        <ItemTitle className="text-body-md">{state.name}</ItemTitle>
                      </ItemContent>
                      {isSelected && (
                        <div className="ml-auto">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </div>
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
