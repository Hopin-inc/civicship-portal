import { useEffect, useState } from "react";
import { useHeader } from "@/components/providers/HeaderProvider";
import { SearchParams } from "@/app/search/data/presenter";

const useSearchResultHeader = (searchParams: SearchParams) => {
  const { updateConfig } = useHeader();

  const [previousSearchParams, setPreviousSearchParams] = useState<SearchParams | null>(null);

  useEffect(() => {
    if (
      previousSearchParams === null ||
      previousSearchParams.location !== searchParams.location ||
      previousSearchParams.from !== searchParams.from ||
      previousSearchParams.to !== searchParams.to ||
      previousSearchParams.guests !== searchParams.guests
    ) {
      updateConfig({
        showSearchForm: true,
        searchParams: {
          location: searchParams.location,
          from: searchParams.from,
          to: searchParams.to,
          guests: searchParams.guests && !isNaN(parseInt(searchParams.guests, 10)) ? parseInt(searchParams.guests, 10) : undefined,
        },
        showLogo: false,
        showBackButton: true,
      });

      setPreviousSearchParams(searchParams);
    }
  }, [searchParams, updateConfig, previousSearchParams]);
};

export default useSearchResultHeader;
