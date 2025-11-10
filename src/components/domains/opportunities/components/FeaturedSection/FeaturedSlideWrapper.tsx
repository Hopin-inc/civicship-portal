"use client";

import dynamic from "next/dynamic";
import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";

const FeaturedSlider = dynamic(() => import("./FeaturedSlider"), {
  ssr: false,
});

type Props = {
  opportunities: (ActivityCard | QuestCard)[];
};

export default function FeaturedSlideWrapper({ opportunities }: Props) {
  return <FeaturedSlider opportunities={opportunities} />;
}
