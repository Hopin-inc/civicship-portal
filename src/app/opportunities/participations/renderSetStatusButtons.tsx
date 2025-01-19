import React from "react";
import { Button } from "@/app/components/ui/button";
import {
  handleAction,
  useParticipationSetStatusActions,
} from "@/app/opportunities/participations/ParticipationSetStatusButton";

type Participation = {
  id: string;
  status: string;
};

export const renderButtons = (
  participation: Participation,
  actions: ReturnType<typeof useParticipationSetStatusActions>
): JSX.Element => {
  switch (participation.status) {
    case "APPLIED":
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => handleAction(actions.approveApplication, participation.id)}
            variant="default"
          >
            承認
          </Button>
          <Button
            onClick={() => handleAction(actions.denyApplication, participation.id)}
            variant="destructive"
          >
            非承認
          </Button>
        </div>
      );

    case "INVITED":
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => handleAction(actions.cancelInvitation, participation.id)}
            variant="outline"
          >
            キャンセル
          </Button>
        </div>
      );

    case "PARTICIPATING":
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => handleAction(actions.approvePerformance, participation.id)}
            variant="default"
          >
            承認
          </Button>
          <Button
            onClick={() => handleAction(actions.denyPerformance, participation.id)}
            variant="destructive"
          >
            非承認
          </Button>
        </div>
      );

    // case "NOT_PARTICIPATING":
    //   return (
    //     <div className="flex gap-2">
    //       <Button
    //         onClick={() => handleAction(actions.inviteParticipation, participation.id)}
    //         variant="ghost"
    //       >
    //         再招待
    //       </Button>
    //     </div>
    //   );

    default:
      return <p>-</p>;
  }
};