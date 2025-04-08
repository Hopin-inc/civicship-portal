"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParticipation } from "@/hooks/useParticipation";
import { useParticipationImageUpload } from "@/hooks/useParticipationImageUpload";
import { ParticipationStatus, ParticipationStatusReason } from "@/gql/graphql";
import { AsymmetricImageGrid } from "@/app/components/ui/asymmetric-image-grid";
import { Button } from "@/app/components/ui/button";
import { AlertCircle, Check, Calendar, MapPin, Users, Banknote } from "lucide-react";
import Link from "next/link";
import { AddParticipationPhotosModal } from "@/app/components/features/participations/AddParticipationPhotosModal";

interface ParticipationProps {
  params: {
    id: string;
  };
}

interface ReservationStatus {
  status: "pending" | "confirmed" | "cancelled";
  statusText: string;
  statusSubText: string;
  statusClass: string;
}

const getStatusInfo = (
  status: ParticipationStatus,
  reason: ParticipationStatusReason,
): ReservationStatus | null => {
  switch (status) {
    case ParticipationStatus.Pending:
      return {
        status: "pending",
        statusText: "案内人による承認待ちです。",
        statusSubText: "承認されると、予約が確定します。",
        statusClass: "bg-yellow-50 border-yellow-200",
      };
    case ParticipationStatus.Participating:
      return {
        status: "confirmed",
        statusText: "予約が確定しました。",
        statusSubText: "",
        statusClass: "bg-green-50 border-green-200",
      };
    case ParticipationStatus.NotParticipating:
      const isCanceled = reason === ParticipationStatusReason.OpportunityCanceled;
      return {
        status: "cancelled",
        statusText: isCanceled ? "開催が中止されました。" : "予約がキャンセルされました。",
        statusSubText: isCanceled
          ? "案内人の都合により中止となりました。"
          : "予約のキャンセルが完了しました。",
        statusClass: "bg-red-50 border-red-200",
      };
    case ParticipationStatus.Participated:
      return null;
    default:
      return {
        status: "pending",
        statusText: "案内人による承認待ちです。",
        statusSubText: "承認されると、予約が確定します。",
        statusClass: "bg-yellow-50 border-yellow-200",
      };
  }
};

export default function ParticipationPage({ params }: ParticipationProps) {
  const { participation, opportunity, loading, error, refetch } = useParticipation(params.id);
  const [currentStatus, setCurrentStatus] = useState<ReservationStatus | null>(
    participation?.node.status
      ? getStatusInfo(
          participation.node.status as ParticipationStatus,
          participation.node.reason as ParticipationStatusReason,
        )
      : null,
  );
  const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { uploadImages, isUploading } = useParticipationImageUpload({
    participationId: params.id,
    onSuccess: () => {
      setUploadSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
      // Refetch participation data to show the new images
      refetch();
    },
    onError: (error) => {
      setUploadError(error.message);
      // Reset error message after 3 seconds
      setTimeout(() => setUploadError(null), 3000);
    },
  });

  useEffect(() => {
    if (participation?.node.status) {
      setCurrentStatus(
        getStatusInfo(
          participation.node.status as ParticipationStatus,
          participation.node.reason as ParticipationStatusReason,
        ),
      );
    }
  }, [participation?.node.status, participation?.node.reason]);

  console.log("participation data", participation);
  console.log("opportunity data", opportunity);

  if (loading) {
    return <div className="max-w-2xl mx-auto p-4">Loading...</div>;
  }

  if (error || !opportunity || !participation) {
    return <div className="max-w-2xl mx-auto p-4">Error loading participation details.</div>;
  }

  const participationSlot = participation.node.reservation?.opportunitySlot;
  const startTime = participationSlot?.startsAt ? new Date(participationSlot.startsAt) : new Date();
  const endTime = participationSlot?.endsAt ? new Date(participationSlot.endsAt) : new Date();
  const duration = `${format(startTime, "HH:mm")}〜${format(endTime, "HH:mm")}`;
  const participantCount = participation.node.reservation?.participations?.length || 0;

  // キャンセル可否の状態管理
  const cancellationDeadline = new Date(startTime.getTime() - 24 * 60 * 60 * 1000);
  // const isCancellable = 
  //   currentStatus?.status !== "cancelled" &&
  //   participation.node.status !== ParticipationStatus.Participated &&
  //   participation.node.status !== ParticipationStatus.NotParticipating &&
  //   new Date() <= cancellationDeadline;
  const isCancellable = false;

  const handleAddPhotos = async (images: File[], comment: string) => {
    try {
      await uploadImages(images, comment);
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-[120px]">
      {/* Success message */}
      {uploadSuccess && (
        <div className="p-3 rounded-xl border-[1px] bg-green-50 border-green-200 mb-6">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-[3px] text-green-600" />
            <div className="flex-1">
              <p className="font-bold leading-6">写真が正常にアップロードされました</p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="p-3 rounded-xl border-[1px] bg-red-50 border-red-200 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-[3px] text-red-600" />
            <div className="flex-1">
              <p className="font-bold leading-6">写真のアップロードに失敗しました</p>
              <p className="text-sm text-gray-600 mt-1">{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* ステータス通知 */}
      {currentStatus && (
        <div className={`p-3 rounded-xl border-[1px] ${currentStatus.statusClass} mb-6`}>
          <div className="flex items-start gap-2">
            {currentStatus.status === "confirmed" ? (
              <Check className="w-5 h-5 mt-[3px] text-green-600" />
            ) : (
              <AlertCircle
                className={`w-5 h-5 mt-[3px] ${
                  currentStatus.status === "cancelled" ? "text-red-600" : "text-yellow-600"
                }`}
              />
            )}
            <div className="flex-1">
              <p className="font-bold leading-6">{currentStatus.statusText}</p>
              <p className="text-sm text-gray-600 mt-1">{currentStatus.statusSubText}</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-6 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">{opportunity.title}</h1>
          <div className="flex items-center gap-3">
            {opportunity.createdByUser?.image ? (
              <Image
                src={opportunity.createdByUser.image}
                alt={opportunity.createdByUser.name || ""}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <Image
                src="/images/default-avatar.png"
                alt="Default Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <span className="text-lg">{opportunity.createdByUser?.name ?? "未設定"}</span>
          </div>
        </div>

        {opportunity.image && (
          <div className="w-[108px] h-[108px] flex-shrink-0">
            <div className="relative w-full h-full">
              <Image
                src={opportunity.image}
                alt={opportunity.title}
                fill
                className="object-cover rounded-lg"
                sizes="108px"
              />
            </div>
          </div>
        )}
      </div>
      <div className="p-2 my-6">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p>{format(startTime, "yyyy年M月d日(E)", { locale: ja })}</p>
              <p>{duration}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p>{opportunity.place?.name}</p>
              <p className="text-sm text-gray-600">{opportunity.place?.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p>{participantCount}人</p>
          </div>

          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p>{opportunity.feeRequired?.toLocaleString() || 0}円</p>
              <p className="text-sm text-gray-600">
                ({(opportunity.feeRequired || 0).toLocaleString()}円/人)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 参加画像セクション */}
      {participation?.node?.images && participation.node.images.length > 0 && (
        <div className="mb-6">
          <div className="max-w-3xl">
            {(() => {
              const allImages = participation.node.images.map((img: any) => ({
                url: (img as any).url || img,
                alt: "参加者の写真",
              }));

              const displayImages = allImages.slice(0, 3);
              const remainingCount = Math.max(0, allImages.length - 3);

              return (
                <div className="space-y-4">
                  <AsymmetricImageGrid images={displayImages} />
                  {remainingCount > 0 && (
                    <Button
                      variant="outline"
                      className="w-full border-2 border-[#4361EE] text-[#4361EE] hover:bg-[#4361EE] hover:text-white"
                      onClick={() => {
                        console.log(`残りの画像枚数: ${remainingCount}枚`);
                      }}
                    >
                      {remainingCount + 3}枚の写真をすべて見る
                    </Button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <div className="flex flex-col gap-2">
        <Link 
          href={`/activities/${opportunity.id}`} 
          className="w-full py-4 px-8 rounded-full text-center border-2 border-[#4361EE] text-[#4361EE] transition-colors"
        >
          体験の詳細を見る
        </Link>
      </div>

      {/* キャンセルボタン (固定位置) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {participation?.node.status === ParticipationStatus.Participated ? (
              <AddParticipationPhotosModal
                trigger={
                  <button 
                    className="w-full py-4 px-8 rounded-full text-center bg-[#4361EE] text-white hover:bg-[#3651DE] disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={isUploading}
                  >
                    {isUploading ? "アップロード中..." : "写真を追加"}
                  </button>
                }
                onSubmit={handleAddPhotos}
              />
            ) : (
              <>
                <div className="flex flex-col text-gray-600 min-w-fit">
                  <span className="text-sm">キャンセル期限:</span>
                  <span className="text-sm font-bold">
                    {format(cancellationDeadline, "M/d(E)", { locale: ja })}
                  </span>
                </div>
                {isCancellable ? (
                  <button className="shrink-0 py-4 px-8 rounded-full text-center whitespace-nowrap bg-[#E94A47] text-white hover:bg-[#D43F3C]">
                    予約をキャンセル
                  </button>
                ) : (
                  <button
                    className="shrink-0 py-4 px-8 rounded-full text-center whitespace-nowrap bg-gray-100 text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    キャンセル不可
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
