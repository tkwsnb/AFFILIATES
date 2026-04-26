import type { Book, StoreConfig } from '../../types';
import { Layout } from '../layout';
import { BackLink, BookDetail } from '../components';

export const BookDetailPage = ({
    book,
    store,
}: {
    book: Book;
    store: StoreConfig;
}) => (
    <Layout title={book.title} description={book.description ?? book.title}>
        <BookDetail book={book} store={store} />
        <BackLink />
    </Layout>
);

export const BookNotFoundPage = () => (
    <Layout title="作品が見つかりませんでした">
        <section class="page-heading">
            <h1>作品が見つかりませんでした</h1>
            <p class="subtitle">
                URL が間違っているか、掲載が終了している可能性があります。
            </p>
        </section>
        <BackLink />
    </Layout>
);
