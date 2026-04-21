// scrape-shueisha.ts
import * as cheerio from "cheerio";

// 集英社の新刊カレンダーページのURL
// ※実際の構造に合わせて後で変更する可能性がある
const TARGET_URL = "https://www.s-manga.net/new_release/";

async function scrapeShueisha() {
    console.log("集英社のサイトに潜入開始...");

    // 1. Bunの高速なfetchでHTMLをごっそり取得
    const res = await fetch(TARGET_URL, {
        headers: {
            // スクレイピングを弾かれないようにブラウザのフリをする
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    });

    if (!res.ok) {
        console.error("アクセス拒否された。ステータス:", res.status);
        return;
    }

    const html = await res.text();
    console.log("HTMLデータの取得に成功。解析を始めるね。");

    // 2. cheerioにHTMLを読み込ませる
    const $ = cheerio.load(html);
    const books: { title: string; author: string; releaseDate: string; isbn: string }[] = [];

    // 3. HTMLの構造（セレクタ）を推測してデータを抽出
    // ※出版社サイトは頻繁にデザインが変わるから、ここは実際のDOMを見て調整する部分
    $(".book-list .book-item, .bookshelf li, .section-new-release li").each((_, element) => {
        const title = $(element).find(".title, .book-title, h3").text().trim();
        const author = $(element).find(".author, .book-author").text().trim();
        const releaseDate = $(element).find(".date, .release-date").text().trim();

        // ISBNはリンクのURLや画像名に埋まっていることが多いから正規表現で引っこ抜く
        const link = $(element).find("a").attr("href") || $(element).find("img").attr("src") || "";
        const isbnMatch = link.match(/(\d{13})/); // 13桁の数字(ISBN)を探す
        const isbn = isbnMatch ? isbnMatch[1] : "";

        // タイトルとISBNが両方取れたら、有効なデータとして配列に入れる
        if (title && isbn) {
            books.push({ title, author, releaseDate, isbn });
        }
    });

    console.log(`抽出完了。${books.length}件のデータをゲットした。`);

    if (books.length > 0) {
        console.log("--- 取得したデータ（最初の3件） ---");
        console.log(books.slice(0, 3));
    } else {
        console.log("データが0件だった。HTMLのセレクタ（目印）が合っていないみたい。");
    }

    return books;
}

scrapeShueisha();