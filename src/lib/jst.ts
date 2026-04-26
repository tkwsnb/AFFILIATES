/**
 * JST（Asia/Tokyo）基準の日付ユーティリティ。
 * Node/Bun の `Date` は UTC 基準で動くので、毎回 +9h して UTC 関数で読む。
 */

export interface JstCalendar {
    year: number;
    month: number;
    day: number;
}

function jstDate(): Date {
    return new Date(Date.now() + 9 * 60 * 60 * 1000);
}

export function getJstCalendar(): JstCalendar {
    const d = jstDate();
    return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
    };
}

export function isCurrentJstMonth(year: number, month: number): boolean {
    const t = getJstCalendar();
    return t.year === year && t.month === month;
}

/** 例: (2026, 4) → "2026年4月" */
export function formatJstMonthLabel(year: number, month: number): string {
    return `${year}年${month}月`;
}

/**
 * cmoa の「3/30(月)発売作品」のような月日のみ表記から YYYY-MM-DD を組み立てる。
 * 現在月より大きい月が混ざっていた場合は前年扱いに寄せる。
 */
export function buildReleaseDate(
    month: number,
    day: number,
    today: JstCalendar = getJstCalendar(),
): string {
    const year = month > today.month ? today.year - 1 : today.year;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
