import { SITE } from '../../config';
import { formatJstMonthLabel } from '../../lib/jst';
import { Layout } from '../layout';
import {
    BackLink,
    FeaturedCard,
    Notice,
    PageHeading,
} from '../components';
import type { FeaturedItem } from '../../types';

export interface NewReleasesMonthPageProps {
    year: number;
    month: number;
    items: FeaturedItem[];
}

export const NewReleasesMonthPage = ({
    year,
    month,
    items,
}: NewReleasesMonthPageProps) => {
    const label = formatJstMonthLabel(year, month);
    return (
        <Layout
            title={`${label}の新刊`}
            description={`${label}のコミックシーモア新刊を一覧表示しています。${SITE.name}`}
        >
            <PageHeading
                title={`${label}の新刊`}
                subtitle="コミックシーモアの新刊一覧（自動取得）"
            />
            <Notice>
                <p>
                    掲載内容は非公式の自動抽出です。配信有無・価格は公式でご確認ください。
                </p>
            </Notice>
            {items.length === 0 ? (
                <p class="empty-hint">
                    この月の新刊データがまだ取得できていません。しばらくしてからもう一度お試しください。
                </p>
            ) : (
                <div class="featured-grid featured-grid--full">
                    {items.map((item) => (
                        <FeaturedCard item={item} />
                    ))}
                </div>
            )}
            <BackLink href="/" label="トップへ戻る" />
        </Layout>
    );
};

export const NewReleasesMonthUnavailablePage = () => (
    <Layout title="新刊一覧" description={SITE.description}>
        <PageHeading title="新刊データがありません" />
        <p class="empty-hint">
            今月分の新刊はトップで表示します。他の月のページは、データ取得の都合上お使いできない場合があります。
        </p>
        <BackLink href="/" label="トップへ戻る" />
    </Layout>
);
