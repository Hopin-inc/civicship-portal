"use client";

import dynamic from "next/dynamic";
import { ActivityCard, QuestCard } from "@/app/activities/data/type";

const ActivitiesFeaturedSlider = dynamic(() => import("./FeaturedSlider"), {
  ssr: false,
});

type Props = {
  opportunities: (ActivityCard | QuestCard)[];
};

export default function ActivitiesFeaturedSliderWrapper({ opportunities }: Props) {
  return <ActivitiesFeaturedSlider opportunities={opportunities} />;
}
