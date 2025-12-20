import dayjs from 'dayjs';
import { RecurrenceInput, SlotData } from '../types';

const MAX_MONTHS = 3; // 3ヶ月上限

/**
 * 繰り返し設定から開催枠を生成する純関数
 *
 * 重要な設計原則：
 * - duration（開始〜終了の時間差）をミリ秒単位で保持
 * - 文字列合成は使わず、dayjs操作のみで日時を構築
 * - 翌日跨ぎを正確に再現
 *
 * @param input - 繰り返し生成の入力（起点日時 + 繰り返し設定）
 * @returns 生成された開催枠の配列
 *
 * @example
 * // Test case 1: 同日内（10:00-12:00）
 * const input = {
 *   baseStartAt: '2025-01-01T10:00',
 *   baseEndAt: '2025-01-01T12:00',
 *   settings: { type: 'daily', endDate: '2025-01-03' }
 * };
 * // Expected: 3件（01/01, 01/02, 01/03 各10:00-12:00）
 *
 * @example
 * // Test case 2: 翌日跨ぎ（22:00-01:00）
 * const input = {
 *   baseStartAt: '2025-01-01T22:00',
 *   baseEndAt: '2025-01-02T01:00',
 *   settings: { type: 'daily', endDate: '2025-01-02' }
 * };
 * // Expected: 2件（01/01 22:00-01/02 01:00, 01/02 22:00-01/03 01:00）
 *
 * @example
 * // Test case 3: 毎週・月水金
 * const input = {
 *   baseStartAt: '2025-01-06T10:00', // 月曜日
 *   baseEndAt: '2025-01-06T12:00',
 *   settings: { type: 'weekly', selectedDays: [1, 3, 5], endDate: '2025-01-12' }
 * };
 * // Expected: 01/06月, 01/08水, 01/10金（次週の01/13月は範囲外）
 */
export function generateRecurrenceSlots(input: RecurrenceInput): SlotData[] {
  const { baseStartAt, baseEndAt, settings } = input;
  const { type, endDate, selectedDays } = settings;

  // 1. 起点日時と duration を計算
  const baseStart = dayjs(baseStartAt);
  const baseEnd = dayjs(baseEndAt);
  const durationMs = baseEnd.diff(baseStart); // ミリ秒単位の時間差

  // 2. 生成期間を決定（起点日〜終了日 or 3ヶ月）
  const startDate = baseStart.startOf('day');
  const maxEndDate = startDate.add(MAX_MONTHS, 'month');
  const actualEndDate = endDate
    ? dayjs(endDate).isAfter(maxEndDate)
      ? maxEndDate
      : dayjs(endDate)
    : maxEndDate;

  const slots: SlotData[] = [];
  let currentDate = startDate;

  // 3. 日付を進めながら生成
  while (!currentDate.isAfter(actualEndDate, 'day')) {
    let shouldAdd = false;

    if (type === 'daily') {
      shouldAdd = true;
    } else if (type === 'weekly') {
      const dayOfWeek = currentDate.day(); // 0=日, 1=月, ..., 6=土
      shouldAdd = selectedDays?.includes(dayOfWeek) || false;
    }

    if (shouldAdd) {
      // 4. 時刻を起点から移植（dayjs操作のみ）
      const slotStart = currentDate
        .hour(baseStart.hour())
        .minute(baseStart.minute())
        .second(baseStart.second())
        .millisecond(baseStart.millisecond());

      // 5. end は start + duration で算出（翌日跨ぎを正確に再現）
      const slotEnd = slotStart.add(durationMs, 'millisecond');

      slots.push({
        startAt: slotStart.format('YYYY-MM-DDTHH:mm'),
        endAt: slotEnd.format('YYYY-MM-DDTHH:mm'),
      });
    }

    currentDate = currentDate.add(1, 'day');
  }

  return slots;
}
