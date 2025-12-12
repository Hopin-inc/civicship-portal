// ImagesField.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { FieldProps } from "./types";

export const ImagesField = ({ form }: FieldProps) => {
  const images = form.watch("images");

  const handleSelectFiles = async () => {
    // ここで input[type=file] をトリガーして ImageKit アップロード → form.setValue("images", ...) する想定
    // プロジェクトの既存 ImageKitUploader を流用してね
  };

  return (
    <FormField
      control={form.control}
      name="images"
      render={() => (
        <FormItem>
          <FormLabel>画像 *</FormLabel>
          <FormDescription>
            参加者にイメージを伝えるため、最低2枚の画像登録が必要です。最大5枚まで登録できます。
          </FormDescription>
          <FormControl>
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full py-4"
                onClick={handleSelectFiles}
              >
                ファイルを選択（またはドラッグ＆ドロップ）
              </Button>
              {/* サムネイル一覧表示など */}
              <div className="grid grid-cols-2 gap-2">
                {images?.map((img: any, i: number) => (
                  <div key={i} className="rounded-lg border p-2 text-xs">
                    {/* 実際は <Image> でプレビューする */}
                    画像{i + 1}
                  </div>
                ))}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
