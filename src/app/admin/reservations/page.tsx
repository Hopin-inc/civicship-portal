"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import useReservations from "@/app/admin/reservations/hooks/useReservations";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GqlReservation } from "@/types/graphql";
import { useReservationSearch } from "@/app/admin/reservations/hooks/useReservationSearch";
import { Form } from "@/components/ui/form";
import SearchForm from "@/app/search/components/SearchForm";
import { ReservationList } from "./components/ReservationList";
import { TABS, isTabType, getReservationFilterFromTab } from "./constants/filters";

export default function ReservationsPage() {
  const router = useRouter();
  const headerConfig = useMemo(
    () => ({
      title: "予約管理",
      showLogo: false,
      showBackButton: true,
      backTo: "/admin",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = TABS.includes(tabParam as any) ? (tabParam as any) : "all";

  const handleTabChange = (value: string) => {
    if (!isTabType(value)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`/admin/reservations?${params.toString()}`);
  };

  const statusFilter = useMemo(() => getReservationFilterFromTab(activeTab), [activeTab]);
  const { reservations, loading, error, loadMoreRef } = useReservations(statusFilter);

  const reservationItems: GqlReservation[] = reservations.edges
    .map((edge) => edge.node)
    .filter((n): n is GqlReservation => !!n);

  const { form, filteredReservations, onSubmit } = useReservationSearch(reservationItems);

  return (
    <div className="px-4 pt-4">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-2 grid w-full grid-cols-3">
          <TabsTrigger value="all" className="w-full">
            すべて
          </TabsTrigger>
          <TabsTrigger value="pending" className="w-full">
            未対応
          </TabsTrigger>
          <TabsTrigger value="resolved" className="w-full">
            完了
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-10 mt-4">
          <SearchForm name="searchQuery" />
        </form>
      </Form>

      <ReservationList
        reservations={filteredReservations}
        loading={loading}
        error={error}
        loadMoreRef={loadMoreRef}
      />
    </div>
  );
}
