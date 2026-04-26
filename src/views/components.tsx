import type { Book, FeaturedItem, StoreConfig } from '../types';
import { LOCAL_FALLBACK_IMAGE, openLibraryCoverUrl } from '../lib/cover';
import { bookDetailPath } from '../lib/routes';

const FALLBACK_IMAGE_ONERROR = `this.onerror=null;this.src='${LOCAL_FALLBACK_IMAGE}';this.alt=(this.alt||'書影') + '（画像準備中）';`;

const bookCoverSrc = (book: Book): string =>
    book.imageUrl?.trim() || openLibraryCoverUrl(book.isbn);

const formatDate = (value: string) => value.replace(/-/g, '/');
const formatPrice = (value: number) => `¥${value.toLocaleString()}`;

/** 画像タグ共通プロパティ。onerror でローカル SVG に落とす。 */
const COMMON_IMG_ATTRS = {
    loading: 'lazy' as const,
    decoding: 'async' as const,
    referrerPolicy: 'no-referrer' as const,
    onerror: FALLBACK_IMAGE_ONERROR,
};

export const Notice = ({ children }: { children: any }) => (
    <div class="notice-box">{children}</div>
);

export const PageHeading = ({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) => (
    <section class="page-heading">
        <h1>{title}</h1>
        {subtitle ? <p class="subtitle">{subtitle}</p> : null}
    </section>
);

export const BackLink = ({
    href = '/',
    label = '一覧ページへ戻る',
}: {
    href?: string;
    label?: string;
}) => (
    <p class="back-link-wrap">
        <a href={href} class="back-link">
            ← {label}
        </a>
    </p>
);

export const BookCard = ({ book }: { book: Book }) => (
    <article class="book-card">
        <a href={bookDetailPath(book.isbn)} class="book-link">
            <div class="image-container">
                <img src={bookCoverSrc(book)} alt={book.title} {...COMMON_IMG_ATTRS} />
                <div class="badge">注目</div>
            </div>
            <div class="book-info">
                <div class="tag-row">
                    <span class="label publisher">{book.label}</span>
                </div>
                <h3 class="title">{book.title}</h3>
                <p class="author">{book.author}</p>
                <div class="footer-info">
                    <span class="release-date">{formatDate(book.releaseDate)}</span>
                    <span class="price">{formatPrice(book.price)}</span>
                </div>
            </div>
        </a>
    </article>
);

export const BookDetail = ({
    book,
    store,
}: {
    book: Book;
    store: StoreConfig;
}) => (
    <section class="detail-card">
        <div class="detail-image">
            <img src={bookCoverSrc(book)} alt={book.title} {...COMMON_IMG_ATTRS} />
        </div>
        <div class="detail-content">
            <div class="tag-row">
                <span class="label publisher">{book.label}</span>
                <span class="label detail-isbn">ISBN {book.isbn}</span>
            </div>
            <h1 class="detail-title">{book.title}</h1>
            <p class="author">{book.author}</p>
            <div class="detail-meta">
                <span class="release-date">発売日: {formatDate(book.releaseDate)}</span>
                <span class="price">紙価格目安: {formatPrice(book.price)}</span>
            </div>
            {book.description ? <p class="description">{book.description}</p> : null}
            {book.tags && book.tags.length > 0 ? (
                <div class="tag-list">
                    {book.tags.map((tag) => (
                        <span class="tag-chip">#{tag}</span>
                    ))}
                </div>
            ) : null}
            <Notice>
                <p>
                    {store.name}での配信有無・価格・無料巻数などは時期により変動します。
                    最新情報は必ず公式サイトでご確認ください。
                </p>
            </Notice>
            <div class="store-links">
                <a
                    href={store.buildUrl(book)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    class={`store-btn ${store.className}`}
                >
                    {store.buttonLabel}
                </a>
            </div>
        </div>
    </section>
);

export const FeaturedCard = ({ item }: { item: FeaturedItem }) => (
    <a
        class="featured-card"
        href={item.productUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
    >
        <div class="image-container">
            <img src={item.imageUrl} alt={item.title} {...COMMON_IMG_ATTRS} />
            <div class="badge">{item.releaseLabel}</div>
        </div>
        <div class="featured-info">
            <div class="tag-row">
                <span class="label publisher">{item.genre}</span>
            </div>
            <h3 class="title">
                {item.title}
                {item.volumeLabel ? <span class="vol-num"> {item.volumeLabel}</span> : null}
            </h3>
            <p class="author">{item.author}</p>
        </div>
    </a>
);

export type FeaturedVariant = 'home' | 'full';

const FEATURED_GRID_CLASS: Record<FeaturedVariant, string> = {
    home: 'featured-grid featured-grid--home',
    full: 'featured-grid featured-grid--full',
};

export const FeaturedSection = ({
    items,
    title,
    subtitle,
    variant,
    viewAll,
}: {
    items: FeaturedItem[];
    title: string;
    subtitle?: string;
    variant: FeaturedVariant;
    viewAll?: { href: string; label: string };
}) => {
    if (items.length === 0) return null;

    return (
        <section class="featured-section">
            <div class="featured-heading">
                <h2>{title}</h2>
                {subtitle ? <p class="subtitle">{subtitle}</p> : null}
            </div>
            <div class={FEATURED_GRID_CLASS[variant]}>
                {items.map((item) => (
                    <FeaturedCard item={item} />
                ))}
            </div>
            {viewAll ? (
                <div class="featured-view-all">
                    <a href={viewAll.href} class="featured-view-all-link">
                        {viewAll.label} →
                    </a>
                </div>
            ) : null}
        </section>
    );
};
