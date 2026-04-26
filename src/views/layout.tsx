import { SITE } from '../config';
import { SUGGEST_ENDPOINT } from '../lib/routes';

interface LayoutProps {
    title?: string;
    description?: string;
    children: any;
}

export const Layout = ({ title, description, children }: LayoutProps) => {
    const pageTitle = title ? `${title} | ${SITE.name}` : SITE.name;
    const metaDescription = description ?? SITE.description;

    return (
        <html lang="ja">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={metaDescription} />
                <title>{pageTitle}</title>
                <link rel="stylesheet" href="/index.css" />
            </head>
            <body>
                <SiteHeader />
                <main class="container">{children}</main>
                <SiteFooter />
                <script type="module" src="/search-suggest.js"></script>
            </body>
        </html>
    );
};

const SiteHeader = () => (
    <header class="site-header">
        <div class="container site-header-inner">
            <a href="/" class="site-logo">
                {SITE.name}
            </a>
            <div class="site-header-right">
                <nav class="site-nav" aria-label="サイト内ナビ">
                    {SITE.nav.map((item) => (
                        <a href={item.href}>{item.label}</a>
                    ))}
                </nav>
                <div class="site-search" id="site-search" data-endpoint={SUGGEST_ENDPOINT}>
                    <div class="site-search-inner" role="search">
                        <label class="visually-hidden" for="site-search-input">
                            タイトル・著者で検索
                        </label>
                        <input
                            type="search"
                            id="site-search-input"
                            name="q"
                            placeholder="タイトル・著者で検索"
                            autocomplete="off"
                            maxlength="200"
                            enterkeyhint="search"
                        />
                        <ul
                            class="site-search-list"
                            id="site-search-list"
                            role="listbox"
                            aria-label="検索候補"
                            hidden
                        />
                    </div>
                </div>
            </div>
        </div>
    </header>
);

const SiteFooter = () => (
    <footer class="site-footer">
        <div class="container">
            <p class="disclosure">
                当サイトはコミックシーモア公式サイトとは関係のない、非公式の紹介サイトです。
                一部リンクにはアフィリエイトプログラムを利用しています。
            </p>
            <p class="copyright">
                &copy; {SITE.launchYear} {SITE.name}
            </p>
        </div>
    </footer>
);
