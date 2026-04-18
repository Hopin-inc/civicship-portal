"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChoiceCardGroup } from "@/components/ui/choice-card";
import { useVoteCast } from "../hooks/useVoteCast";

interface VoteCastFormProps {
  topicId: string;
  options: { id: string; label: string }[];
  currentPower: number | null;
  myBallotOptionId: string | null;
}

export function VoteCastForm({
  topicId,
  options,
  currentPower,
  myBallotOptionId,
}: VoteCastFormProps) {
  const t = useTranslations();
  const { cast, casting } = useVoteCast();
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    myBallotOptionId ?? "",
  );

  const isChange = myBallotOptionId != null;

  const handleSubmit = async () => {
    if (!selectedOptionId) return;
    await cast(topicId, selectedOptionId);
  };

  const choiceOptions = options.map((o) => ({
    value: o.id,
    label: o.label,
  }));

  return (
    <div className="space-y-6">
      <ChoiceCardGroup
        options={choiceOptions}
        value={selectedOptionId}
        onValueChange={setSelectedOptionId}
      />

      {currentPower != null && currentPower > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          {t("votes.cast.power", { power: currentPower })}
        </p>
      )}

      <Button
        variant="primary"
        className="w-full h-[56px]"
        disabled={!selectedOptionId || casting}
        onClick={handleSubmit}
      >
        {casting
          ? t("votes.cast.submitting")
          : isChange
            ? t("votes.cast.changeButton")
            : t("votes.cast.submitButton")}
      </Button>
    </div>
  );
}
