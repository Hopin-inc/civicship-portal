import { GqlParticipation } from "@/types/graphql";
import { useAttendanceState } from "../../reservations/hooks/attendance/useAttendanceState";

export const useGetAttendanceData = () => {
  const test = (participations: GqlParticipation[]) => {
    const { attendanceData } = useAttendanceState(participations);
    return attendanceData;
  };
  return { test };
};
