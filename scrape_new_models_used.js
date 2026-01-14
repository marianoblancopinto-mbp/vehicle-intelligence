const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Models to scrape (Used)
const MODELS_TO_SCRAPE = [
    { search: 'fiat-fastback', brand_model: 'FIAT FASTBACK' },
    { search: 'fiat-pulse', brand_model: 'FIAT PULSE' },
    { search: 'peugeot-5008', brand_model: 'PEUGEOT 5008' }
];

async function scrapeUsed() {
    console.log('🚀 Starting Used Car Scraper [Fastback, Pulse, 5008] (JS Mode)...');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--start-maximized'
        ]
    });

    let allItems = [];

    for (const model of MODELS_TO_SCRAPE) {
        console.log(`\n📦 Scraping ${model.brand_model}...`);
        const page = await browser.newPage();

        await page.setViewport({ width: 1366, height: 768 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        try {
            const url = `https://listado.mercadolibre.com.ar/${model.search}`;
            console.log(`   Navigating to: ${url}`);

            page.on('console', msg => console.log('PAGE LOG:', msg.text()));

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Wait for items
            await page.waitForSelector('.ui-search-layout__item, .poly-card, .andes-card', { timeout: 10000 }).catch(() => console.log("Wait timeout"));

            await new Promise(r => setTimeout(r, 2000));

            // Extract data
            const items = await page.evaluate((brandModel) => {
                const extracted = [];
                const cards = document.querySelectorAll('.ui-search-layout__item, .poly-card, .andes-card');
                console.log(`   -> Found ${cards.length} cards in DOM`);

                cards.forEach(card => {
                    try {
                        // Title
                        let title = card.querySelector('.ui-search-item__title')?.textContent ||
                            card.querySelector('.poly-component__title')?.textContent || '';
                        title = title.trim();

                        // Price
                        const priceContainer = card.querySelector('.ui-search-price, .poly-price__current, .andes-money-amount-combo');
                        const priceSymbol = priceContainer?.querySelector('.andes-money-amount__currency-symbol')?.textContent?.trim();
                        const priceFraction = priceContainer?.querySelector('.andes-money-amount__fraction')?.textContent?.trim().replace(/\./g, '');

                        if (!priceFraction) return;
                        let price = parseInt(priceFraction);

                        // Currency
                        const priceSymbolText = priceSymbol || '$'; // default to ARS if missing symbol
                        const isUSD = priceSymbolText.includes('U$S') || priceSymbolText.includes('US');
                        let price_usd = price;

                        if (!isUSD) {
                            price_usd = Math.round(price / 1150);
                        }

                        // Attributes (Year & Km)
                        const attrsList = Array.from(card.querySelectorAll('.ui-search-card-attributes__attribute, .poly-attributes-list__item, .ui-search-item__group__element'));
                        let year = 0;
                        let km = 0;

                        attrsList.forEach(attr => {
                            const txt = attr.textContent?.trim() || '';
                            if (!txt) return;
                            if (/^(19|20)\d{2}$/.test(txt)) year = parseInt(txt);
                            if (txt.toLowerCase().includes('km')) km = parseInt(txt.replace(/\D/g, ''));
                        });

                        // Fallback Year from Title
                        if (year === 0) {
                            const match = title.match(/\b(20\d{2}|19\d{2})\b/);
                            if (match) year = parseInt(match[0]);
                        }

                        // ID & URL
                        const link = (card.querySelector('a.ui-search-link') || card.querySelector('a'))?.href || '';
                        const idMatch = link.match(/(MLA-\d+)/) || link.match(/(MLA\d+)/);
                        const id = idMatch ? idMatch[0] : Math.random().toString(36).substring(7);

                        // Filters
                        // Fastback/Pulse are new (2021+), 5008 is 2017+
                        if (price_usd > 5000 && year > 2010) {
                            extracted.push({
                                id,
                                title,
                                version: title,
                                year,
                                km,
                                price_usd,
                                brand_model: brandModel,
                                url: link,
                                scraped_at: new Date().toISOString()
                            });
                        } else {
                            // console.log(`Skipped ${title}: Year ${year}, Price ${price_usd}`);
                        }
                    } catch (err) {
                        // ignore
                    }
                });
                return extracted;
            }, model.brand_model);

            console.log(`   ✅ Found ${items.length} listings for ${model.brand_model}`);
            allItems = allItems.concat(items);

        } catch (error) {
            console.error(`   ❌ Error scraping ${model.brand_model}:`, error.message);
        }

        await page.close();
        await new Promise(r => setTimeout(r, 2000));
    }

    await browser.close();

    console.log(`\n💾 Saving ${allItems.length} total items to data/raw_market_data_new_models.json...`);
    const dataPath = path.join(__dirname, 'data', 'raw_market_data_new_models.json');
    fs.writeFileSync(dataPath, JSON.stringify(allItems, null, 2));
    console.log("✅ Scrape Finished.");
}

scrapeUsed();
