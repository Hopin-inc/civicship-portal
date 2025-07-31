"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import useReservations from "@/app/admin/reservations/hooks/useReservations";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { displayRelativeTime } from "@/utils";
import { displayDuration } from "@/utils/date";
import { Bookmark, CalendarIcon } from "lucide-react";
import {
  GqlOpportunitySlotHostingStatus,
  GqlParticipationStatus,
  GqlReservation,
  GqlReservationFilterInput,
  GqlReservationStatus,
} from "@/types/graphql";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import getReservationStatusMeta from "@/app/admin/reservations/hooks/useGetReservationStatusMeta";
import { useReservationSearch } from "@/app/admin/reservations/hooks/useReservationSearch";
import { Form } from "@/components/ui/form";
import SearchForm from "@/app/search/components/SearchForm";
import { Button } from "@/components/ui/button";

const TABS = ["pending", "resolved"] as const;
type TabType = (typeof TABS)[number];

const isTabType = (value: string): value is TabType => {
  return TABS.includes(value as TabType);
};

const getReservationFilterFromTab = (tab: TabType): GqlReservationFilterInput => {
  if (tab === "pending") {
    return {
      or: [
        {
          and: [
            { reservationStatus: [GqlReservationStatus.Applied] }, // 未承認の申込
            { hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled] },
          ],
        },
        {
          and: [
            { reservationStatus: [GqlReservationStatus.Accepted] }, // 承認済み
            { participationStatus: [GqlParticipationStatus.Participating] }, // 出欠未対応
            { hostingStatus: [GqlOpportunitySlotHostingStatus.Completed] }, // 開催済み
          ],
        },
      ],
    };
  }
  return {
    or: [
      // ● 承認済み・出欠対応済み・開催済み
      {
        and: [
          { reservationStatus: [GqlReservationStatus.Accepted] },
          { participationStatus: [GqlParticipationStatus.Participated] },
          { hostingStatus: [GqlOpportunitySlotHostingStatus.Completed] },
        ],
      },
      // ● 却下済み または キャンセル済み
      {
        reservationStatus: [GqlReservationStatus.Rejected, GqlReservationStatus.Canceled],
      },
      {
        and: [
          { reservationStatus: [GqlReservationStatus.Accepted] }, // 未承認の申込
          { hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled] },
          { participationStatus: [GqlParticipationStatus.Participating] },
        ],
      },
    ],
  };
};

export default function ReservationsPage() {
  const router = useRouter();
  const headerConfig = useMemo(
    () => ({
      title: "予約管理",
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = TABS.includes(tabParam as TabType) ? (tabParam as TabType) : "pending";

  const handleTabChange = (value: string) => {
    if (!isTabType(value)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`/admin/reservations?${params.toString()}`);
  };

  const statusFilter = useMemo(() => getReservationFilterFromTab(activeTab), [activeTab]);
  const { reservations, loading, error, loadMoreRef, refetch } = useReservations(statusFilter);

  const reservationItems: GqlReservation[] = reservations.edges
    .map((edge) => edge.node)
    .filter((n): n is GqlReservation => !!n);

  const { form, filteredReservations, onSubmit } = useReservationSearch(reservationItems);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState title="予約の取得に失敗しました" />
      </div>
    );
  }

  return (
    <>
      <div className={"px-4"}>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="sticky p-4 pb-0 mt-4">
          <TabsList className="mb-2">
            <TabsTrigger value="pending">未対応</TabsTrigger>
            <TabsTrigger value="resolved">完了</TabsTrigger>
          </TabsList>
        </Tabs>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-10 mt-4">
            <SearchForm name="searchQuery" />
          </form>
        </Form>

        <div className="flex flex-col gap-4">
          {filteredReservations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">予約がありません</p>
          ) : (
            <>
              {filteredReservations.map((reservation: GqlReservation) => {
                const { step, label, variant } = getReservationStatusMeta(reservation);
                const handleClick = () => {
                  router.push(`/admin/reservations/${reservation.id}/?mode=${step}`);
                };

                return (
                  <Card
                    key={reservation.id}
                    onClick={handleClick}
                    className="cursor-pointer hover:bg-muted-hover transition-colors"
                  >
                    <CardHeader className="flex flex-row items-center justify-between p-4 gap-3">
                      <div className="flex items-center gap-3 flex-grow min-w-0">
                        <Avatar>
                          <AvatarImage src={reservation.createdByUser?.image || ""} />
                          <AvatarFallback>
                            {reservation.createdByUser?.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-base truncate">
                          {reservation.createdByUser?.name || "未設定"}
                        </CardTitle>
                      </div>

                      <div className="flex-shrink-0">
                        <Badge variant={variant}>{label}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 truncate">
                        <Bookmark size={16} />
                        <span className="truncate">
                          {reservation.opportunitySlot?.opportunity?.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <CalendarIcon size={16} />
                        <span className="truncate">
                          {reservation.opportunitySlot?.startsAt &&
                            displayDuration(
                              reservation.opportunitySlot.startsAt,
                              reservation.opportunitySlot.endsAt,
                            )}
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="text-xs text-muted-foreground pt-0 flex justify-between items-center">
                      <span>{displayRelativeTime(reservation.createdAt ?? "")}</span>
                      {activeTab === "pending" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="px-10"
                          onClick={(e) => {
                            e.stopPropagation(); // 親のクリック遷移を防ぐ
                            handleClick(); // 明示的に遷移
                          }}
                        >
                          対応する
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}

              <div ref={loadMoreRef} className="h-0" aria-hidden="true" />
              {loading && (
                <div className="h-10 flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-b-2 border-foreground rounded-full"></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
