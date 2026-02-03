import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useAppRouter } from "@/lib/navigation";
import { GqlReservation } from "@/types/graphql";

export type SearchFormValues = {
  searchQuery: string;
};

export const useReservationSearch = (reservations: GqlReservation[]) => {
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const form = useForm<SearchFormValues>({
    defaultValues: {
      searchQuery: initialQuery,
    },
  });

  const searchQuery = form.watch("searchQuery");

  const filteredReservations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return reservations;

    return reservations.filter((r) => {
      const name = r.createdByUser?.name?.toLowerCase() || "";
      const title = r.opportunitySlot?.opportunity?.title?.toLowerCase() || "";
      return name.includes(query) || title.includes(query);
    });
  }, [reservations, searchQuery]);

  const onSubmit = useCallback(
    (data: SearchFormValues) => {
      const params = new URLSearchParams(searchParams.toString());
      if (data.searchQuery) {
        params.set("q", data.searchQuery);
      } else {
        params.delete("q");
      }
      router.push(`/admin/reservations?${params.toString()}`);
    },
    [router, searchParams],
  );

  return {
    form,
    filteredReservations,
    onSubmit,
  };
};
