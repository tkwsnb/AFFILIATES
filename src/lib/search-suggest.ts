import type { Book, FeaturedItem, SuggestItem } from '../types';
import { bookDetailPath } from './routes';

const DEFAULT_MAX = 10;
/** 著者名の一致はタイトル一致よりやや弱めに扱う。 */
const AUTHOR_WEIGHT = 0.85;

function normalize(s: string): string {
    return s.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

function scoreText(hay: string, needle: string): number {
    if (!needle) return 0;
    const h = normalize(hay);
    const n = normalize(needle);
    if (n.length === 0) return 0;
    if (!h.includes(n)) return 0;
    if (h === n) return 13;
    if (h.startsWith(n)) return 9;
    return 4;
}

function titleAuthorScore(title: string, author: string, q: string): number {
    return Math.max(scoreText(title, q), scoreText(author, q) * AUTHOR_WEIGHT);
}

/**
 * ピックアップ（ISBN 書誌）と今月新刊を、タイトル・著者名の部分一致で候補化する。
 */
type ScoredRow = { s: number; item: SuggestItem };

function bookToRow(b: Book, q: string): ScoredRow | null {
    const s = titleAuthorScore(b.title, b.author, q);
    if (s <= 0) return null;
    return {
        s,
        item: {
            type: 'book',
            title: b.title,
            author: b.author,
            href: bookDetailPath(b.isbn),
            badge: 'ピックアップ',
            external: false,
        },
    };
}

function featuredToRow(f: FeaturedItem, q: string): ScoredRow | null {
    const s = titleAuthorScore(f.title, f.author, q);
    if (s <= 0) return null;
    return {
        s,
        item: {
            type: 'newrelease',
            title: f.volumeLabel ? `${f.title} ${f.volumeLabel}` : f.title,
            author: f.author,
            href: f.productUrl,
            badge: '今月新刊',
            external: true,
        },
    };
}

function dedupeKey(i: SuggestItem): string {
    return `${i.type}\t${i.title}\t${i.author}\t${i.href}`;
}

/**
 * ピックアップ（ISBN 書誌）と今月新刊を、タイトル・著者名の部分一致で候補化する。
 */
export function buildSuggestItems(
    query: string,
    books: Book[],
    newReleases: FeaturedItem[],
    limit = DEFAULT_MAX,
): SuggestItem[] {
    const q = query.trim();
    if (q.length < 1) return [];

    const rows: ScoredRow[] = [];
    for (const b of books) {
        const r = bookToRow(b, q);
        if (r) rows.push(r);
    }
    for (const f of newReleases) {
        const r = featuredToRow(f, q);
        if (r) rows.push(r);
    }

    rows.sort((a, b) => b.s - a.s);

    const out: SuggestItem[] = [];
    const seen = new Set<string>();
    for (const { item } of rows) {
        if (out.length >= limit) break;
        const key = dedupeKey(item);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(item);
    }
    return out;
}
