export interface Book {
    title: string;
    author: string;
    releaseDate: string;
    isbn: string;
    label: string;
    price: number;
    /** 未指定なら ISBN から Open Library 表紙URLを組み立てる */
    imageUrl?: string;
    tags?: string[];
    description?: string;
}

export interface StoreConfig {
    id: string;
    name: string;
    buttonLabel: string;
    className: string;
    buildUrl: (book: Book) => string;
}

export interface NavLink {
    href: string;
    label: string;
}

export interface FeaturedItem {
    /** 例: "4/26" */
    releaseLabel: string;
    /** YYYY-MM-DD */
    releaseDate: string;
    genre: string;
    title: string;
    volumeLabel?: string;
    author: string;
    imageUrl: string;
    /** コミックシーモアの該当作品ページ */
    productUrl: string;
}

/** `/api/suggest` の1件。クライアント表示・ナビ用 */
export interface SuggestItem {
    type: 'book' | 'newrelease';
    title: string;
    author: string;
    href: string;
    /** 新刊 / ピックアップ 等 */
    badge: string;
    external: boolean;
}

export interface SiteConfig {
    name: string;
    tagline: string;
    description: string;
    ownerName: string;
    contactEmail: string;
    launchYear: number;
    nav: NavLink[];
}
