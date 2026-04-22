import type { GqlSysAdminCohortRetentionPoint } from "@/types/graphql";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartCard } from "@/app/sysAdmin/_shared/components/ChartCard";
import { formatJstMonth } from "@/app/sysAdmin/_shared/format/date";
import { toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  points: GqlSysAdminCohortRetentionPoint[];
};

function CohortCell({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) {
    return (
      <span aria-label={sysAdminDashboardJa.detail.cohort.empty}>-</span>
    );
  }
  return <span>{toPct(value)}</span>;
}

export function CohortRetentionTable({ points }: Props) {
  const cols = sysAdminDashboardJa.detail.cohort.columns;
  return (
    <ChartCard title={sysAdminDashboardJa.detail.cohort.title}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{cols.cohortMonth}</TableHead>
            <TableHead>{cols.cohortSize}</TableHead>
            <TableHead>{cols.m1}</TableHead>
            <TableHead>{cols.m3}</TableHead>
            <TableHead>{cols.m6}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {points.map((p) => {
            const key = typeof p.cohortMonth === "string" ? p.cohortMonth : p.cohortMonth.toISOString();
            return (
              <TableRow key={key}>
                <TableCell>{formatJstMonth(p.cohortMonth as unknown as string | Date)}</TableCell>
                <TableCell className="tabular-nums">{toIntJa(p.cohortSize)}</TableCell>
                <TableCell className="tabular-nums">
                  <CohortCell value={p.retentionM1} />
                </TableCell>
                <TableCell className="tabular-nums">
                  <CohortCell value={p.retentionM3} />
                </TableCell>
                <TableCell className="tabular-nums">
                  <CohortCell value={p.retentionM6} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ChartCard>
  );
}
