// test-rakuten.ts
// ※ Obsidian内のsecrets.jsonの絶対パスか相対パスに書き換えてね
import secrets from "./secrets.json" with { type: "json" };

const RAKUTEN_APP_ID = secrets.RAKUTEN_APP_ID;
const RAKUTEN_ACCESS_KEY = secrets.RAKUTEN_ACCESS_KEY;
const RAKUTEN_AFFILIATE_ID = secrets.RAKUTEN_AFFILIATE_ID;

async function fetchRakutenBook(isbn: string) {
    const endpoint = "https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404";

    const params = new URLSearchParams({
        format: "json",
        applicationId: RAKUTEN_APP_ID,
        accessKey: RAKUTEN_ACCESS_KEY,
        affiliateId: RAKUTEN_AFFILIATE_ID,
        isbn: isbn,
        booksGenreId: "001001", // 漫画・コミックのジャンルID
    });

    console.log("楽天API(新システム)に全力で問い合わせ中...");

    // Headersオブジェクトを使って強固にヘッダーを定義する
    const customHeaders = new Headers();

    // 楽天に登録したURL。末尾のスラッシュ「/」があるかないかで弾かれることもあるから念のため付ける
    customHeaders.append("Referer", "https://tkwsnb.net/");
    customHeaders.append("Origin", "https://tkwsnb.net");
    // 無機質なアクセスだと思われないようにユーザーエージェントも偽装する
    customHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

    const res = await fetch(`${endpoint}?${params.toString()}`, {
        method: "GET",
        headers: customHeaders,
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("APIエラーが発生したよ:", res.status, res.statusText);
        console.error("エラーの詳しい理由:", errorText);
        return;
    }

    const data = await res.json();

    if (data.Items && data.Items.length > 0) {
        // 最初のヒット結果を取得
        const book = data.Items[0].Item;
        console.log("--- 取得成功 ---");
        console.log(`タイトル: ${book.title}`);
        console.log(`著者: ${book.author}`);
        console.log(`アフィリエイトURL: ${book.affiliateUrl}`);
        console.log(`画像URL: ${book.largeImageUrl}`);
    } else {
        console.log("そのISBNの漫画は見つからなかったみたい。");
    }
}

fetchRakutenBook("9784088838847");