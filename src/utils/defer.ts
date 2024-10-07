export type Deferred = ReturnType<typeof deferred>;

export const deferred = () => {
  let resolve: () => void;
  let resolved = false;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  promise.then(() => {
    resolved = true;
  });
  return {
    promise,
    resolve: resolve!,
    get resolved() {
      return resolved;
    },
    use() {
      if (resolved) return;
      throw promise;
    },
  };
};
