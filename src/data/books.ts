import type { Book } from '../types';
import { enrichBooksWithCovers } from '../lib/cover';

const RAW_BOOKS: Book[] = [
    {
        title: 'SAKAMOTO DAYS 27',
        author: '鈴木 祐斗',
        releaseDate: '2026-04-04',
        isbn: '9784088850344',
        label: 'ジャンプコミックス',
        price: 528,
        tags: ['少年', 'アクション', 'コメディ'],
        description:
            '元最強の殺し屋・坂本太郎が、家族を守るため再び戦いの世界に身を投じるアクションコメディ。',
    },
    {
        title: '青の祓魔師 34',
        author: '加藤 和恵',
        releaseDate: '2026-04-04',
        isbn: '9784088850054',
        label: 'ジャンプコミックスSQ',
        price: 528,
        tags: ['少年', 'バトル', 'ダークファンタジー'],
        description: 'サタンの息子として生まれた奥村燐が、祓魔師として悪魔と戦う王道バトル作品。',
    },
    {
        title: 'ガチャンキイ 2',
        author: '下元 朗',
        releaseDate: '2026-04-04',
        isbn: '9784088850627',
        label: 'ジャンプコミックス',
        price: 528,
        tags: ['少年', 'コメディ'],
        description:
            '個性派キャラクターが次々に登場する、テンポ感が心地よいギャグコメディ。',
    },
];

let ENRICHED_BOOKS: Book[] = RAW_BOOKS;

export async function initializeBooks(): Promise<void> {
    ENRICHED_BOOKS = await enrichBooksWithCovers(RAW_BOOKS);
}

export function findBookByIsbn(isbn: string): Book | undefined {
    return ENRICHED_BOOKS.find((book) => book.isbn === isbn);
}

export function listBooks(limit = 40): Book[] {
    return ENRICHED_BOOKS.slice(0, limit);
}
