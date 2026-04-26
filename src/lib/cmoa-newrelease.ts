import * as cheerio from 'cheerio';
import type { FeaturedItem } from '../types';
import { buildReleaseDate, getJstCalendar, type JstCalendar } from './jst';
import { readJsonCache, writeJsonCache } from './json-cache';

const PAGE_URL = 'https://www.cmoa.jp/newrelease/';
const CACHE_FILE = './.cache/cmoa-newrelease.json';
/**
 * オンデマンド取得がネットに飛ぶかどうかの目安。バックグラウンド更新が動いていれば
 * 常に新しい _fetchedAt が入るため、実質的には読み出し専用になる。
 * 定時更新が止まったとき用のフェイルセーフとして余裕を持たせる。
 */
const READ_CACHE_MAX_AGE_MS = 12 * 60 * 60 * 1000;
const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

/** "4/26(日)発売作品 (88)" → { month: 4, day: 26 } */
function parseSubTitle(text: string): { month: number; day: number } | null {
    const match = text.match(/(\d{1,2})\/(\d{1,2})/);
    if (!match) return null;
    return { month: Number(match[1]), day: Number(match[2]) };
}

function toAbsoluteImageUrl(src: string): string {
    if (!src) return src;
    if (src.startsWith('//')) return `https:${src}`;
    return src;
}

async function fetchPage(): Promise<string> {
    const res = await fetch(PAGE_URL, {
        headers: { 'User-Agent': USER_AGENT },
    });
    if (!res.ok) throw new Error(`cmoa newrelease ${res.status}`);
    return res.text();
}

function parseHtml(html: string, today: JstCalendar): FeaturedItem[] {
    const $ = cheerio.load(html);
    const items: FeaturedItem[] = [];

    $('.sub_title').each((_, el) => {
        const section = $(el);
        const parsed = parseSubTitle(section.text());
        if (!parsed) return;
        if (parsed.month !== today.month) return;

        const releaseDate = buildReleaseDate(parsed.month, parsed.day, today);
        const releaseLabel = `${parsed.month}/${parsed.day}`;
        const list = section.next('ul.title_list');

        list.find('li.title_wrap').each((_i, li) => {
            const $li = $(li);
            const genre = $li.find('.genre_name').first().text().trim();
            const titleName = $li.find('.title_name').first().text().trim();
            const volumeLabel = $li
                .find('.vol_num')
                .first()
                .text()
                .replace(/\s+/g, '')
                .trim();
            const author = $li.find('.author_name').first().text().trim();
            const thumbHref = $li.find('.thum_box a').first().attr('href') ?? '';
            const thumbSrc = $li.find('.thum_box img').first().attr('src') ?? '';

            if (!titleName || !thumbHref) return;

            items.push({
                releaseLabel,
                releaseDate,
                genre,
                title: titleName,
                volumeLabel: volumeLabel || undefined,
                author,
                imageUrl: toAbsoluteImageUrl(thumbSrc),
                productUrl: new URL(thumbHref, 'https://www.cmoa.jp').toString(),
            });
        });
    });

    return items;
}

export interface RefreshResult {
    ok: boolean;
    itemCount: number;
    items?: FeaturedItem[];
    error?: string;
}

/**
 * 常に HTML を再取得しキャッシュを上書きする。スケジューラと CLI 用。
 * 失敗しても直前の cache ファイルは消さない。
 */
export async function refreshCmoaNewReleaseCache(): Promise<RefreshResult> {
    try {
        const html = await fetchPage();
        const items = parseHtml(html, getJstCalendar());
        await writeJsonCache(CACHE_FILE, items, { withTimestamp: true });
        const ts = new Date().toISOString();
        console.log(
            `[cmoa-newrelease] ${ts} 更新: ${items.length} 件 → ${CACHE_FILE}`,
        );
        return { ok: true, itemCount: items.length, items };
    } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        console.error('[cmoa-newrelease] 更新失敗:', err);
        return { ok: false, itemCount: 0, error };
    }
}

/**
 * コミックシーモアの「新刊一覧」から今月ぶんを抽出する。
 * 失敗しても可能な限り最後のキャッシュを使う。なければ空配列。
 */
export async function fetchThisMonthFeaturedItems(): Promise<FeaturedItem[]> {
    const fresh = await readJsonCache<FeaturedItem[]>(
        CACHE_FILE,
        READ_CACHE_MAX_AGE_MS,
    );
    if (fresh) return fresh;

    const res = await refreshCmoaNewReleaseCache();
    if (res.ok && res.items) return res.items;

    const stale = await readJsonCache<FeaturedItem[]>(CACHE_FILE);
    return stale ?? [];
}
