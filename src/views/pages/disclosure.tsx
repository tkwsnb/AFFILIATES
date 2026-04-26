import { Layout } from '../layout';
import { PageHeading } from '../components';

export const DisclosurePage = () => (
    <Layout title="広告・アフィリエイトについて">
        <PageHeading
            title="広告・アフィリエイトについて"
            subtitle="当サイトにおける広告表示の方針をご案内します。"
        />
        <article class="article">
            <p>
                当サイトはアフィリエイトプログラムに参加しており、サイト内の一部リンクから商品ページへ遷移した場合、
                運営者に紹介料が支払われることがあります。紹介料は運営費用に充てられます。
            </p>
            <p>
                価格・セール・配信状況などの最新情報は、必ずリンク先の公式サイトにてご確認ください。
                当サイトに掲載された情報と公式サイトの情報に差異がある場合は、公式サイトの情報が優先されます。
            </p>
            <p>
                当サイトはコミックシーモアを含む各公式サイトの運営会社とは無関係の非公式サイトです。
            </p>
        </article>
    </Layout>
);
