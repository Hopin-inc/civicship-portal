// 繰り返し種別
export type RecurrenceType = 'daily' | 'weekly';

// 繰り返し設定（UI状態のみ）
export type RecurrenceSettings = {
  type: RecurrenceType;
  endDate: string | null; // YYYY-MM-DD or null
  selectedDays?: number[]; // 0=日, 1=月, ..., 6=土（毎週の場合のみ）
};

// 生成入力（baseを含む完全な入力）
export type RecurrenceInput = {
  baseStartAt: string;    // ISO datetime
  baseEndAt: string;      // ISO datetime
  settings: RecurrenceSettings;
};

// 繰り返しバリデーションエラー
export type RecurrenceError = {
  days?: string;
  endDate?: string;
};
