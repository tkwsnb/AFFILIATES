
import * as cheerio from "cheerio";

const TARGET_URL = "https://www.s-manga.net/newcomics/index.html?month=next";

async function testExtraction() {
    const res = await fetch(TARGET_URL, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    });
    const html = await res.text();
    const regex = /var ssd = (\{.*?\});/s;
    const match = html.match(regex);
    if (match) {
        const ssd = JSON.parse(match[1]);
        console.log("Count:", ssd.count);
        const paperItems = ssd.data.paper_data.item_datas;
        console.log("First Paper Item:", paperItems[0]);
    } else {
        console.log("No ssd found");
    }
}

testExtraction();
