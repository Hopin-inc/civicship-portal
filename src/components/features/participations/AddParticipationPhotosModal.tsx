import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AddParticipationPhotosModalProps {
  trigger: React.ReactNode;
  onSubmit: (images: File[], comment: string) => void;
}

export function AddParticipationPhotosModal({
  trigger,
  onSubmit,
}: AddParticipationPhotosModalProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [comment, setComment] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);

    // Create preview URLs for the selected images
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit(selectedImages, comment);
    setOpen(false);
    // Reset form
    setSelectedImages([]);
    setPreviewUrls([]);
    setComment("");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] w-full rounded-t-[10px] sm:max-w-none"
      >
        <div className="flex justify-center mb-2">
          <div className="w-12 h-1.5 rounded-full bg-gray-300" />
        </div>
        <SheetHeader>
          <SheetTitle className="text-center">写真を追加</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 max-w-lg mx-auto px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-base">写真</span>
              <span className="text-[#4361EE] text-xs bg-[#EEF1FF] px-2 py-0.5 rounded">必須</span>
            </div>
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={url}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => document.getElementById('image-input')?.click()}
              className="w-full h-[52px] flex items-center justify-center bg-white border border-gray-200 rounded-[16px] text-[#111111]"
              disabled={previewUrls.length >= 6}
            >
              画像を選択
            </button>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <div>
            <div className="mb-2">
              <span className="text-base">感想</span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="参加した感想を自由に入力してください"
              className="w-full min-h-[120px] p-4 border border-gray-200 rounded-[16px] text-base resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-full bg-[#4361EE] text-white text-base font-bold hover:bg-[#3651DE] disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={selectedImages.length === 0}
          >
            追加
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
