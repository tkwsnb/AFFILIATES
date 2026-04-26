import { SITE } from '../../config';
import { Layout } from '../layout';
import { PageHeading } from '../components';

export const PrivacyPage = () => (
    <Layout title="プライバシーポリシー">
        <PageHeading
            title="プライバシーポリシー"
            subtitle="当サイトにおける情報の取扱い方針をご案内します。"
        />
        <article class="article">
            <h2>アクセス解析</h2>
            <p>
                当サイトではサービス品質向上のため、アクセスログやアクセス解析ツール等を利用する場合があります。
                取得する情報には個人を特定するものは含まれません。
            </p>
            <h2>Cookie について</h2>
            <p>
                当サイトおよびリンク先の広告提供元では、利用状況の把握を目的として Cookie を利用する場合があります。
                ブラウザの設定により Cookie を無効化することができます。
            </p>
            <h2>お問い合わせ</h2>
            <p>
                本ポリシーに関するお問い合わせは
                <a href={`mailto:${SITE.contactEmail}`}> {SITE.contactEmail} </a>
                までご連絡ください。
            </p>
        </article>
    </Layout>
);
