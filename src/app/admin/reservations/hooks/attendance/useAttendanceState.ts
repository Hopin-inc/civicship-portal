import { useEffect, useRef, useState } from "react";
import { GqlEvaluationStatus, GqlParticipation } from "@/types/graphql";

export const useAttendanceState = (participations: GqlParticipation[]) => {
  const [attendanceData, setAttendanceData] = useState<Record<string, GqlEvaluationStatus>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [allEvaluated, setAllEvaluated] = useState(false);
  const processedParticipationIds = useRef<Set<string>>(new Set());

  // トグル操作ごとに “全員選択完了” を再判定
  useEffect(() => {
    const vals = Object.values(attendanceData);
    setAllEvaluated(vals.length > 0 && vals.every((s) => s !== GqlEvaluationStatus.Pending));
  }, [attendanceData]);

  // 初回マウント or new id 登場時の初期化
  useEffect(() => {
    if (participations.length === 0) return;
    const { initialAttendance, hasNew, hasAnyEval, allEval } = createInitialAttendanceState(
      participations,
      processedParticipationIds.current,
    );
    if (hasNew) {
      setAttendanceData((prev) => ({ ...prev, ...initialAttendance }));
      if (hasAnyEval && allEval) setIsSaved(true);
      setAllEvaluated(allEval);
    }
  }, [participations]);

  const handleAttendanceChange = (id: string, value: GqlEvaluationStatus) => {
    if (isSaved) return;
    setAttendanceData((prev) => ({ ...prev, [id]: value }));
  };

  return {
    attendanceData,
    isSaved,
    allEvaluated,
    handleAttendanceChange,
    setIsSaved,
    setAllEvaluated,
  };
};

type InitialAttendanceResult = {
  initialAttendance: Record<string, GqlEvaluationStatus>;
  hasNew: boolean;
  hasAnyEval: boolean;
  allEval: boolean;
};

const createInitialAttendanceState = (
  participations: GqlParticipation[],
  processedIds: Set<string>,
): InitialAttendanceResult => {
  const initialAttendance: Record<string, GqlEvaluationStatus> = {};
  let hasNew = false;
  let allEval = true;
  let hasAnyEval = false;

  participations.forEach((p) => {
    if (!processedIds.has(p.id)) {
      processedIds.add(p.id);
      hasNew = true;
      if (p.evaluation?.status) {
        initialAttendance[p.id] = p.evaluation.status;
        hasAnyEval = true;
        if (p.evaluation.status === GqlEvaluationStatus.Pending) allEval = false;
      } else {
        initialAttendance[p.id] = GqlEvaluationStatus.Pending;
        allEval = false;
      }
    }
  });

  return { initialAttendance, hasNew, hasAnyEval, allEval };
};
