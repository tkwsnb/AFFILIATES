/**
 * サイト内 URL の唯一の組み立て場所。
 * テンプレートに生リテラルを書かず、ここを介することで URL 変更時の影響を局所化する。
 */

export function bookDetailPath(isbn: string): string {
    return `/book/${encodeURIComponent(isbn)}`;
}

export function newReleaseMonthPath(year: number, month: number): string {
    return `/newrelease/${year}/${String(month).padStart(2, '0')}`;
}

export const SUGGEST_ENDPOINT = '/api/suggest';
