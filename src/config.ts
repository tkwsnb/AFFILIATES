import type { SiteConfig, StoreConfig } from './types';

const normalizeCmoaKeyword = (value: string) =>
    value
        .replace(/\s+/g, ' ')
        .replace(/[／/]/g, ' ')
        .trim();

export const SITE: SiteConfig = {
    name: 'コミックシーモア 新刊情報',
    tagline: '今月の新刊をサクッと読もう',
    description:
        'コミックシーモアで読める作品を、紙版の情報と合わせて紹介する非公式ガイドです。公式サイトへの導線に特化しています。',
    ownerName: 'コミックシーモア大好きマン',
    contactEmail: 'info@gmail.com',
    launchYear: 2026,
    nav: [
        { href: '/', label: '作品一覧' },
        { href: '/about', label: '運営者情報' },
        { href: '/privacy', label: 'プライバシー' },
        { href: '/disclosure', label: '広告について' },
    ],
};

export const CMOA_STORE: StoreConfig = {
    id: 'cmoa',
    name: 'コミックシーモア',
    buttonLabel: 'コミックシーモアで読む',
    className: 'cmoa',
    buildUrl: (book) => {
        // ISBN 付き検索はヒットしないケースが多いため、まず作品名で検索する。
        const keyword = encodeURIComponent(normalizeCmoaKeyword(book.title));
        return `https://www.cmoa.jp/search/result/?word=${keyword}`;
    },
};

export const PRIMARY_STORE = CMOA_STORE;
