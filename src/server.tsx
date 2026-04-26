import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { PRIMARY_STORE } from './config';
import { findBookByIsbn, initializeBooks, listBooks } from './data/books';
import { fetchThisMonthFeaturedItems, refreshCmoaNewReleaseCache } from './lib/cmoa-newrelease';
import { startCmoaNewReleaseAutoRefresh } from './lib/cmoa-refresh-scheduler';
import {
    formatJstMonthLabel,
    getJstCalendar,
    isCurrentJstMonth,
} from './lib/jst';
import { newReleaseMonthPath } from './lib/routes';
import { buildSuggestItems } from './lib/search-suggest';
import type { SuggestItem } from './types';
import { AboutPage } from './views/pages/about';
import { BookDetailPage, BookNotFoundPage } from './views/pages/book';
import { DisclosurePage } from './views/pages/disclosure';
import { HomePage } from './views/pages/home';
import {
    NewReleasesMonthPage,
    NewReleasesMonthUnavailablePage,
} from './views/pages/newrelease-month';
import { PrivacyPage } from './views/pages/privacy';

const FEATURED_HOME_MAX = 20;
const SUGGEST_MAX_QUERY_LENGTH = 200;
const SUGGEST_LOOKUP_BOOK_LIMIT = 200;

const app = new Hono();

// --- API (serveStatic より前に登録して静的配信に食われないようにする) ---

app.get('/api/suggest', async (c) => {
    const q = c.req.query('q') ?? '';
    if (q.length < 1) return c.json({ items: [] as SuggestItem[] });
    if (q.length > SUGGEST_MAX_QUERY_LENGTH) {
        return c.json({ error: 'query too long' }, 400);
    }
    const [books, newReleases] = [
        listBooks(SUGGEST_LOOKUP_BOOK_LIMIT),
        await fetchThisMonthFeaturedItems(),
    ];
    return c.json({ items: buildSuggestItems(q, books, newReleases) });
});

/**
 * クラウドの cron / GitHub Actions から新刊 cache を再取得する用。
 * 環境変数 CMOA_CRON_SECRET を設定し、
 *   Authorization: Bearer <CMOA_CRON_SECRET>
 * で呼ぶ。未設定時は 404（ルート非公開扱い）。
 */
app.post('/api/cron/refresh-cmoa', async (c) => {
    const secret = process.env.CMOA_CRON_SECRET;
    if (!secret) return c.text('Not Found', 404);
    const auth = c.req.header('Authorization');
    if (auth !== `Bearer ${secret}`) {
        return c.text('Forbidden', 403);
    }
    const r = await refreshCmoaNewReleaseCache();
    if (!r.ok) {
        return c.json(
            { ok: false, error: r.error, itemCount: r.itemCount },
            500,
        );
    }
    return c.json({ ok: true, itemCount: r.itemCount });
});

app.use('/*', serveStatic({ root: './public' }));

// --- Pages ---

app.get('/', async (c) => {
    const cal = getJstCalendar();
    const allFeatured = await fetchThisMonthFeaturedItems();
    const featuredItems = allFeatured.slice(0, FEATURED_HOME_MAX);
    const viewAllHref =
        allFeatured.length > FEATURED_HOME_MAX
            ? newReleaseMonthPath(cal.year, cal.month)
            : undefined;

    return c.html(
        <HomePage
            books={listBooks()}
            featuredItems={featuredItems}
            featuredMonthLabel={formatJstMonthLabel(cal.year, cal.month)}
            viewAllHref={viewAllHref}
        />,
    );
});

app.get('/newrelease/:year/:month', async (c) => {
    const year = Number(c.req.param('year'));
    const month = Number(c.req.param('month'));
    const isValid =
        Number.isInteger(year) &&
        Number.isInteger(month) &&
        month >= 1 &&
        month <= 12;

    // 現状はスクレイピング元が「今月の新刊」しか返せないので、他の月は 404。
    if (!isValid || !isCurrentJstMonth(year, month)) {
        return c.html(<NewReleasesMonthUnavailablePage />, 404);
    }

    const items = await fetchThisMonthFeaturedItems();
    return c.html(<NewReleasesMonthPage year={year} month={month} items={items} />);
});

app.get('/book/:isbn', (c) => {
    const book = findBookByIsbn(c.req.param('isbn'));
    if (!book) return c.html(<BookNotFoundPage />, 404);
    return c.html(<BookDetailPage book={book} store={PRIMARY_STORE} />);
});

app.get('/about', (c) => c.html(<AboutPage />));
app.get('/privacy', (c) => c.html(<PrivacyPage />));
app.get('/disclosure', (c) => c.html(<DisclosurePage />));

app.notFound((c) => c.html(<BookNotFoundPage />, 404));
app.onError((err, c) => {
    console.error(err);
    return c.text('サーバ内部でエラーが発生しました。', 500);
});

// --- Bootstrap ---

const port = Number(process.env.PORT ?? 3000);

console.log('書影キャッシュを初期化中...');
await initializeBooks();
startCmoaNewReleaseAutoRefresh();
console.log(`Server is running on http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch,
};
