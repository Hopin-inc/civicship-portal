import { describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  useCursorPagination,
  type ConnectionLike,
} from "../useCursorPagination";

type Item = { id: string };

function makeConnection(
  items: Item[],
  opts: {
    hasNextPage?: boolean;
    endCursor?: string | null;
    totalCount?: number;
  } = {},
): ConnectionLike<Item> {
  return {
    edges: items.map((node, i) => ({ cursor: `c${i}`, node })),
    pageInfo: {
      hasNextPage: opts.hasNextPage ?? false,
      endCursor: opts.endCursor === undefined ? null : opts.endCursor,
    },
    totalCount: opts.totalCount ?? items.length,
  };
}

describe("useCursorPagination", () => {
  it("expands initial edges into items", () => {
    const initial = makeConnection([{ id: "1" }, { id: "2" }]);
    const fetchMore = vi.fn();
    const { result } = renderHook(() =>
      useCursorPagination({ initial, fetchMore, resetKey: "k1" }),
    );

    expect(result.current.items.map((i) => i.id)).toEqual(["1", "2"]);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("appends fetched items and updates pagination state on loadMore", async () => {
    const initial = makeConnection([{ id: "1" }], {
      hasNextPage: true,
      endCursor: "c0",
      totalCount: 5,
    });
    const fetchMore = vi.fn().mockResolvedValue(
      makeConnection([{ id: "2" }, { id: "3" }], {
        hasNextPage: false,
        endCursor: "c2",
        totalCount: 5,
      }),
    );

    const { result } = renderHook(() =>
      useCursorPagination({
        initial,
        fetchMore,
        pageSize: 10,
        resetKey: "k1",
      }),
    );

    await act(async () => {
      await result.current.loadMore();
    });

    expect(fetchMore).toHaveBeenCalledWith("c0", 10);
    expect(result.current.items.map((i) => i.id)).toEqual(["1", "2", "3"]);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.totalCount).toBe(5);
  });

  it("is a no-op when hasNextPage is false", async () => {
    const initial = makeConnection([{ id: "1" }], {
      hasNextPage: false,
      endCursor: "c0",
    });
    const fetchMore = vi.fn();
    const { result } = renderHook(() =>
      useCursorPagination({ initial, fetchMore, resetKey: "k1" }),
    );

    await act(async () => {
      await result.current.loadMore();
    });

    expect(fetchMore).not.toHaveBeenCalled();
  });

  it("is a no-op when endCursor is null", async () => {
    const initial = makeConnection([{ id: "1" }], {
      hasNextPage: true,
      endCursor: null,
    });
    const fetchMore = vi.fn();
    const { result } = renderHook(() =>
      useCursorPagination({ initial, fetchMore, resetKey: "k1" }),
    );

    await act(async () => {
      await result.current.loadMore();
    });

    expect(fetchMore).not.toHaveBeenCalled();
  });

  it("treats empty-string endCursor as a valid cursor (regression)", async () => {
    // `!cursor` だと "" が偽になる罠を回避できているか
    const initial = makeConnection([{ id: "1" }], {
      hasNextPage: true,
      endCursor: "",
    });
    const fetchMore = vi.fn().mockResolvedValue(
      makeConnection([{ id: "2" }], { hasNextPage: false, endCursor: null }),
    );
    const { result } = renderHook(() =>
      useCursorPagination({ initial, fetchMore, resetKey: "k1" }),
    );

    await act(async () => {
      await result.current.loadMore();
    });

    expect(fetchMore).toHaveBeenCalledWith("", 20);
    expect(result.current.items.map((i) => i.id)).toEqual(["1", "2"]);
  });

  it("dedupes rapid loadMore calls while one is in-flight", async () => {
    const initial = makeConnection([{ id: "1" }], {
      hasNextPage: true,
      endCursor: "c0",
    });
    let resolveFn: ((v: ConnectionLike<Item>) => void) | undefined;
    const fetchMore = vi.fn().mockImplementation(
      () =>
        new Promise<ConnectionLike<Item>>((resolve) => {
          resolveFn = resolve;
        }),
    );

    const { result } = renderHook(() =>
      useCursorPagination({ initial, fetchMore, resetKey: "k1" }),
    );

    // 連打: 1 回目だけ fetchMore に到達することを期待
    void act(() => {
      void result.current.loadMore();
      void result.current.loadMore();
      void result.current.loadMore();
    });

    expect(fetchMore).toHaveBeenCalledTimes(1);

    // 解決させて hook の state を最終化
    await act(async () => {
      resolveFn!(
        makeConnection([{ id: "2" }], { hasNextPage: false, endCursor: null }),
      );
    });

    expect(result.current.items.map((i) => i.id)).toEqual(["1", "2"]);
  });

  it("wipes items and clears loading on resetKey change", async () => {
    const fetchMore = vi.fn();
    const initialA = makeConnection([{ id: "a1" }, { id: "a2" }], {
      hasNextPage: true,
      endCursor: "ca",
    });
    const initialB = makeConnection([{ id: "b1" }], {
      hasNextPage: false,
      endCursor: null,
      totalCount: 1,
    });

    const { result, rerender } = renderHook(
      ({ initial, key }: { initial: ConnectionLike<Item>; key: string }) =>
        useCursorPagination({ initial, fetchMore, resetKey: key }),
      { initialProps: { initial: initialA, key: "a" } },
    );

    expect(result.current.items.map((i) => i.id)).toEqual(["a1", "a2"]);

    rerender({ initial: initialB, key: "b" });

    expect(result.current.items.map((i) => i.id)).toEqual(["b1"]);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("discards stale fetch results when resetKey changes mid-flight", async () => {
    let resolveFn: ((v: ConnectionLike<Item>) => void) | undefined;
    const fetchMore = vi.fn().mockImplementation(
      () =>
        new Promise<ConnectionLike<Item>>((resolve) => {
          resolveFn = resolve;
        }),
    );

    const initialA = makeConnection([{ id: "a1" }], {
      hasNextPage: true,
      endCursor: "ca",
    });
    const initialB = makeConnection([{ id: "b1" }], {
      hasNextPage: false,
      endCursor: null,
    });

    const { result, rerender } = renderHook(
      ({ initial, key }: { initial: ConnectionLike<Item>; key: string }) =>
        useCursorPagination({ initial, fetchMore, resetKey: key }),
      { initialProps: { initial: initialA, key: "a" } },
    );

    // in-flight fetch を仕掛ける
    void act(() => {
      void result.current.loadMore();
    });
    expect(fetchMore).toHaveBeenCalledTimes(1);

    // resetKey 切替 (= 別データセットに乗り換え)
    rerender({ initial: initialB, key: "b" });
    expect(result.current.items.map((i) => i.id)).toEqual(["b1"]);

    // 古い generation の fetch が後から resolve されても items に append されない
    await act(async () => {
      resolveFn!(
        makeConnection([{ id: "STALE" }], {
          hasNextPage: false,
          endCursor: null,
        }),
      );
    });

    expect(result.current.items.map((i) => i.id)).toEqual(["b1"]);
  });

  it("captures error on fetchMore failure and clears it on next success", async () => {
    const initial = makeConnection([{ id: "1" }], {
      hasNextPage: true,
      endCursor: "c0",
    });
    const fetchMore = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(
        makeConnection([{ id: "2" }], {
          hasNextPage: false,
          endCursor: null,
        }),
      );
    const { result } = renderHook(() =>
      useCursorPagination({ initial, fetchMore, resetKey: "k1" }),
    );

    await act(async () => {
      await result.current.loadMore();
    });
    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));

    await act(async () => {
      await result.current.loadMore();
    });
    expect(result.current.error).toBeNull();
    expect(result.current.items.map((i) => i.id)).toEqual(["1", "2"]);
  });
});
