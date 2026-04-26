import type { Book } from '../types';
import { fetchRakutenBookInfo } from './rakuten';

export const LOCAL_FALLBACK_IMAGE = '/images/no-image.svg';

/**
 * Open Library の ISBN 表紙。
 * default=false を付けないと、表紙が無い ISBN でも 1x1 の透明画像(200) が返ってきて
 * onerror によるフォールバックが効かないため、必ず付ける。
 */
export function openLibraryCoverUrl(isbn: string): string {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
}

/**
 * 書影URLを自動解決する。
 * 優先順位: 手動指定(imageUrl) → 楽天ブックスAPI(キャッシュ込) → Open Library
 * いずれも失敗した場合でも URL は返す（最終的にブラウザ側で onerror → no-image.svg に落ちる）。
 */
export async function resolveCoverUrl(book: Book): Promise<string> {
    const manual = book.imageUrl?.trim();
    if (manual) return manual;

    const rakuten = await fetchRakutenBookInfo(book.isbn);
    if (rakuten?.largeImageUrl) return rakuten.largeImageUrl;

    return openLibraryCoverUrl(book.isbn);
}

/** 全作品の書影URLを並列で解決し、`imageUrl` を埋めた新しい配列を返す。 */
export async function enrichBooksWithCovers(books: Book[]): Promise<Book[]> {
    return Promise.all(
        books.map(async (book) => {
            const imageUrl = await resolveCoverUrl(book);
            return { ...book, imageUrl };
        }),
    );
}
