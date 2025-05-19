/**
 * グローバルな状態としてLIFF環境かどうかを保持します
 * LiffContextで設定され、他のモジュールから参照されます
 */
let isInLiffBrowser = false;

export const setIsInLiffBrowser = (value: boolean) => {
  isInLiffBrowser = value;
};

export const isRunningInLiff = (): boolean => {
  return isInLiffBrowser;
};
