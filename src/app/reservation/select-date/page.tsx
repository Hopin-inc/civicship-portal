"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { Button } from "@/app/components/ui/button";
import { User, Calendar, ChevronRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useOpportunity } from "@/hooks/useOpportunity";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/app/components/ui/sheet";
import { useLoading } from '@/hooks/useLoading';

interface TimeSlot {
  time: string;
  participants: number;
  maxParticipants: number;
  price: number;
  id: string;
  startsAt: string;
  endsAt: string;
  remainingCapacityView?: {
    remainingCapacity: number;
  };
}

interface DateSection {
  date: string;
  day: string;
  timeSlots: TimeSlot[];
}

export default function SelectDatePage({
  searchParams,
}: {
  searchParams: { id: string; community_id: string };
}) {
  const router = useRouter();
  const { updateConfig } = useHeader();
  const { opportunity, loading, error } = useOpportunity(
    searchParams.id
  );
  const { setIsLoading } = useLoading();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<number>(1);
  const [activeForm, setActiveForm] = useState<"date" | "guests" | null>(null);

  useEffect(() => {
    updateConfig({
      title: "日付をえらぶ",
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  if (error) return <div>Error: {error.message}</div>;
  if (!opportunity) return <div>No opportunity found</div>;

  const dateSections: DateSection[] =
    opportunity.slots?.edges
      ?.reduce((acc: DateSection[], edge) => {
        if (!edge?.node) return acc;

        const startDate = new Date(edge.node.startsAt);
        const endDate = new Date(edge.node.endsAt);
        const dateStr = format(startDate, "M月d日", { locale: ja });
        const dayStr = format(startDate, "E", { locale: ja });
        const timeStr = `${format(startDate, "HH:mm")}~${format(endDate, "HH:mm")}`;
        const participants = edge.node.participations?.edges?.length || 0;
        const maxParticipants = edge.node.capacity || 10;
        const price = opportunity.feeRequired || 0;
        const remainingCapacityView = edge.node.remainingCapacityView;

        const existingSection = acc.find((section) => section.date === dateStr);
        if (existingSection) {
          existingSection.timeSlots.push({
            time: timeStr,
            participants,
            maxParticipants,
            price,
            id: edge.node.id,
            startsAt: String(edge.node.startsAt),
            endsAt: String(edge.node.endsAt),
            remainingCapacityView,
          });
        } else {
          acc.push({
            date: dateStr,
            day: dayStr,
            timeSlots: [
              {
                time: timeStr,
                participants,
                maxParticipants,
                price,
                id: edge.node.id,
                startsAt: String(edge.node.startsAt),
                endsAt: String(edge.node.endsAt),
                remainingCapacityView,
              },
            ],
          });
        }
        return acc;
      }, [])
      .sort((a, b) => {
        const dateA = new Date(a.timeSlots[0].startsAt);
        const dateB = new Date(b.timeSlots[0].startsAt);
        return dateA.getTime() - dateB.getTime();
      }) || [];

  const handleReservation = (slot: TimeSlot) => {
    if (!selectedDate) return;

    const params = new URLSearchParams({
      id: searchParams.id,
      community_id: searchParams.community_id,
      slot_id: slot.id,
      starts_at: slot.startsAt,
      ends_at: slot.endsAt,
      guests: selectedGuests.toString(),
    });

    router.push(`/reservation/confirm?${params.toString()}`);
  };

  const renderSheetContent = () => {
    if (!activeForm) return null;

    const renderFooterButtons = () => (
      <div className="max-w-md mx-auto fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              if (activeForm === "date") {
                setSelectedDate(null);
              } else {
                setSelectedGuests(1);
              }
            }}
            className="text-gray-500 text-sm"
          >
            選択を解除
          </button>
          <button
            onClick={() => setActiveForm(null)}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl"
          >
            決定
          </button>
        </div>
      </div>
    );

    if (activeForm === "date") {
      return (
        <div className="h-full flex flex-col">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>
              <div className="flex items-center">
                <span className="text-lg font-bold">日付を選択</span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto pb-24">
            <div className="space-y-2">
              {dateSections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(`${section.date} (${section.day})`)}
                  className={`w-full text-left p-4 rounded-lg border ${
                    selectedDate === `${section.date} (${section.day})`
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-gray-200 text-gray-900"
                  }`}
                >
                  {section.date} ({section.day})
                </button>
              ))}
            </div>
          </div>
          {renderFooterButtons()}
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <SheetHeader className="text-left pb-6">
          <SheetTitle>
            <div className="flex items-center">
              <span className="text-lg font-bold">人数を選択</span>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex items-center justify-center space-x-8 py-4">
          <button
            onClick={() => setSelectedGuests(Math.max(1, selectedGuests - 1))}
            className="rounded-full border border-gray-200 p-2 hover:bg-gray-50"
          >
            <Minus className="h-6 w-6 text-gray-400" />
          </button>
          <span className="text-2xl font-medium w-8 text-center">{selectedGuests}</span>
          <button
            onClick={() => setSelectedGuests(selectedGuests + 1)}
            className="rounded-full border border-gray-200 p-2 hover:bg-gray-50"
          >
            <Plus className="h-6 w-6 text-gray-400" />
          </button>
        </div>
        {renderFooterButtons()}
      </div>
    );
  };

  const filteredDateSections = dateSections.filter((section) => {
    if (!selectedDate) return true;
    return `${section.date} (${section.day})` === selectedDate;
  });

  const isSlotAvailable = (slot: TimeSlot) => {
    const remainingCapacity = slot.remainingCapacityView?.remainingCapacity || 0;
    return remainingCapacity >= selectedGuests;
  };

  return (
    <main className="pt-16 px-4 pb-24">
      <div className="space-y-4 mb-8">
        <button
          onClick={() => setActiveForm("date")}
          className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Calendar className="h-6 w-6 text-gray-400" />
            <span
              className={`text-base ${selectedDate ? "text-gray-900 font-medium" : "text-gray-400"}`}
            >
              日付
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-base">{selectedDate || "日付を選択"}</span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </button>

        <button
          onClick={() => setActiveForm("guests")}
          className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6 text-gray-400" />
            <span
              className={`text-base ${selectedGuests > 1 ? "text-gray-900 font-medium" : "text-gray-400"}`}
            >
              人数
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-base">{selectedGuests}人</span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </button>
      </div>

      <div className="space-y-8">
        {filteredDateSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-lg font-bold mb-4">
              {section.date} ({section.day})
            </h3>
            <div className="space-y-2">
              {section.timeSlots.map((slot, slotIndex) => {
                const remainingCapacity = slot.remainingCapacityView?.remainingCapacity || 0;
                const isFull = remainingCapacity === 0;
                const isAvailable = isSlotAvailable(slot);

                return (
                  <div
                    key={slotIndex}
                    className={`rounded-xl border p-4 ${isFull ? "bg-gray-50" : "bg-white"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-lg font-bold ${isFull ? "text-gray-300" : ""}`}>
                          {slot.time}
                        </p>
                        <p className={`text-md font-bold ${isFull ? "text-gray-300" : ""}`}>
                          {slot.price.toLocaleString()}円/人
                        </p>
                      </div>
                      {isFull ? (
                        <div className="text-gray-300 bg-gray-50 px-8 py-3 rounded-full">満員</div>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          {remainingCapacity <= 3 && remainingCapacity > 0 && (
                            <span className="text-xs text-blue-600">
                              定員まで残り{remainingCapacity}名
                            </span>
                          )}
                          <Button
                            variant="primary"
                            className="rounded-full px-8 py-3"
                            onClick={() => handleReservation(slot)}
                            disabled={!isAvailable}
                          >
                            選択
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={activeForm !== null} onOpenChange={(open) => !open && setActiveForm(null)}>
        <SheetContent
          side="bottom"
          className="h-[300px] rounded-t-3xl overflow-hidden max-w-md mx-auto"
          onPointerDownOutside={() => setActiveForm(null)}
        >
          {renderSheetContent()}
        </SheetContent>
      </Sheet>
    </main>
  );
}
