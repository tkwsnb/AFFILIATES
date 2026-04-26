import type { Book, FeaturedItem } from '../../types';
import { SITE } from '../../config';
import { Layout } from '../layout';
import { BookCard, FeaturedSection, Notice, PageHeading } from '../components';

export interface HomePageProps {
    books: Book[];
    featuredItems: FeaturedItem[];
    featuredMonthLabel: string;
    /** 21件以上あるときだけ表示される「すべて表示」リンク先。 */
    viewAllHref?: string;
}

export const HomePage = ({
    books,
    featuredItems,
    featuredMonthLabel,
    viewAllHref,
}: HomePageProps) => (
    <Layout title="作品一覧" description={SITE.description}>
        <PageHeading title={SITE.name} subtitle={SITE.tagline} />
        <Notice>
            <p>
                このサイトは非公式の紹介サイトです。価格や配信状況は変動するため、
                気になる作品は詳細ページからコミックシーモア公式でご確認ください。
            </p>
        </Notice>
        <FeaturedSection
            items={featuredItems}
            title={`${featuredMonthLabel}の新刊`}
            subtitle="公式サイトから自動取得した今月の新刊です。クリックでコミックシーモアの作品ページへ移動します。"
            variant="home"
            viewAll={viewAllHref ? { href: viewAllHref, label: 'すべて表示' } : undefined}
        />
        <section class="book-list-section">
            <h2 class="section-title">ピックアップタイトル</h2>
            <div class="book-grid">
                {books.map((book) => (
                    <BookCard book={book} />
                ))}
            </div>
        </section>
    </Layout>
);
