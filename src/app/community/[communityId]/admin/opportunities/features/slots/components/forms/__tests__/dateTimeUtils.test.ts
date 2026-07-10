import { describe, expect, it } from "vitest";
import dayjs from "dayjs";
import { clampToFuture, resolveMinTime } from "../dateTimeUtils";

const NOW = dayjs("2026-07-10T14:30:00");
const fmt = (d: ReturnType<typeof dayjs>) => d.format("YYYY-MM-DDTHH:mm");

describe("clampToFuture", () => {
  it("当日の過去（現在の分より前）は now(分精度)に補正する", () => {
    const past = dayjs("2026-07-10T09:00:00");
    expect(fmt(clampToFuture(past, NOW))).toBe("2026-07-10T14:30");
  });

  it("現在と同じ分はそのまま許可する", () => {
    const same = dayjs("2026-07-10T14:30:40");
    expect(fmt(clampToFuture(same, NOW))).toBe("2026-07-10T14:30");
  });

  it("同日の未来時刻は補正しない", () => {
    const future = dayjs("2026-07-10T18:00:00");
    expect(fmt(clampToFuture(future, NOW))).toBe("2026-07-10T18:00");
  });

  it("翌日の早朝でも補正しない（日付優先で未来）", () => {
    const nextDayEarly = dayjs("2026-07-11T00:01:00");
    expect(fmt(clampToFuture(nextDayEarly, NOW))).toBe("2026-07-11T00:01");
  });
});

describe("resolveMinTime", () => {
  it("当日は現在時刻(HH:mm)を返す", () => {
    expect(resolveMinTime(dayjs("2026-07-10T00:00:00").toDate(), NOW)).toBe("14:30");
  });

  it("未来日は undefined を返す（時刻制約なし）", () => {
    expect(resolveMinTime(dayjs("2026-07-11T00:00:00").toDate(), NOW)).toBeUndefined();
  });

  it("日付未選択は undefined を返す", () => {
    expect(resolveMinTime(undefined, NOW)).toBeUndefined();
  });
});
