import { SITE } from '../../config';
import { Layout } from '../layout';
import { PageHeading } from '../components';

export const AboutPage = () => (
    <Layout title="運営者情報">
        <PageHeading title="運営者情報" subtitle="当サイトの運営者と連絡先をご案内します。" />
        <dl class="info-list">
            <dt>サイト名</dt>
            <dd>{SITE.name}</dd>
            <dt>運営者</dt>
            <dd>{SITE.ownerName}</dd>
            <dt>お問い合わせ</dt>
            <dd>
                <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </dd>
            <dt>サイトの目的</dt>
            <dd>{SITE.description}</dd>
        </dl>
    </Layout>
);
