// test-rakuten.ts
// ※ Obsidian内のsecrets.jsonの絶対パスか相対パスに書き換えてね
import secrets from "./secrets.json" with { type: "json" };

const RAKUTEN_APP_ID = secrets.RAKUTEN_APP_ID;
const RAKUTEN_AFFILIATE_ID = secrets.RAKUTEN_AFFILIATES_ID;

async function fetchRakutenBook(isbn: string) {
    // 楽天ブックス書籍検索APIのエンドポイント
    const endpoint = "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404";

    const params = new URLSearchParams({
        format: "json",
        applicationId: RAKUTEN_APP_ID,
        affiliateId: RAKUTEN_AFFILIATE_ID,
        isbn: isbn,
        booksGenreId: "001001", // 漫画・コミックのジャンルID
    });

    console.log("楽天APIに問い合わせ中...");

    const res = await fetch(`${endpoint}?${params.toString()}`);

    if (!res.ok) {
        console.error("APIエラーが発生したよ:", res.status, res.statusText);
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

// テスト実行（例：適当な人気漫画のISBN13桁を入れてみて）
// ここでは仮にダミーのISBNを入れておくから、手元にある漫画のバーコードの数字に変えてね
fetchRakutenBook("9784088838847");