import * as fs from 'fs';

async function debugScraper() {
    const url = "https://autos.mercadolibre.com.ar/toyota-sw4";
    const HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Referer': 'https://www.mercadolibre.com.ar/'
    };

    console.log(`Fetching ${url}...`);
    const res = await fetch(url, { headers: HEADERS });
    const html = await res.text();

    fs.writeFileSync('debug_page.html', html);
    console.log(`Saved ${html.length} chars to debug_page.html`);
}

debugScraper();
