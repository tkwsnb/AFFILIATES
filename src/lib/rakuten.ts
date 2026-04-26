import { RAKUTEN_ACCESS_KEY, RAKUTEN_AFFILIATE_ID, RAKUTEN_APP_ID } from './secrets';
import { readJsonCache, writeJsonCache } from './json-cache';

export interface RakutenBookInfo {
    title: string;
    author: string;
    affiliateUrl: string;
    largeImageUrl: string;
    isbn: string;
}

const CACHE_DIR = './.cache';
const ENDPOINT =
    'https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404';

/** 楽天 API は本番では Referer / Origin 必須。 */
const API_HEADERS: HeadersInit = {
    Referer: 'https://tkwsnb.net/',
    Origin: 'https://tkwsnb.net',
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
};

interface RakutenApiItem {
    title?: string;
    author?: string;
    affiliateUrl?: string;
    largeImageUrl?: string;
    mediumImageUrl?: string;
}

interface RakutenApiResponse {
    Items?: Array<{ Item: RakutenApiItem }>;
}

function cachePathFor(isbn: string): string {
    return `${CACHE_DIR}/${isbn}.json`;
}

function buildRequestUrl(isbn: string): string {
    const params = new URLSearchParams({
        format: 'json',
        applicationId: RAKUTEN_APP_ID,
        accessKey: RAKUTEN_ACCESS_KEY,
        affiliateId: RAKUTEN_AFFILIATE_ID,
        isbn,
        booksGenreId: '001001',
    });
    return `${ENDPOINT}?${params.toString()}`;
}

function toBookInfo(isbn: string, raw: RakutenApiItem): RakutenBookInfo | null {
    const info: RakutenBookInfo = {
        title: raw.title ?? '',
        author: raw.author ?? '',
        affiliateUrl: raw.affiliateUrl ?? '',
        largeImageUrl: raw.largeImageUrl ?? raw.mediumImageUrl ?? '',
        isbn,
    };
    return info.largeImageUrl ? info : null;
}

export async function fetchRakutenBookInfo(
    isbn: string,
): Promise<RakutenBookInfo | null> {
    const cached = await readJsonCache<RakutenBookInfo>(cachePathFor(isbn));
    if (cached?.largeImageUrl) return cached;

    try {
        const res = await fetch(buildRequestUrl(isbn), { headers: API_HEADERS });
        if (!res.ok) {
            console.warn(`[rakuten] non-2xx for ${isbn}: ${res.status}`);
            return null;
        }
        const data = (await res.json()) as RakutenApiResponse;
        const first = data.Items?.[0]?.Item;
        if (!first) return null;

        const info = toBookInfo(isbn, first);
        if (!info) return null;

        await writeJsonCache(cachePathFor(isbn), info);
        return info;
    } catch (err) {
        console.error(`[rakuten] fetch error for ${isbn}:`, err);
        return null;
    }
}
