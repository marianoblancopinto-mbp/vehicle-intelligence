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
    console.log('🚀 Starting Used Car Scraper [Fastback, Pulse, 5008] (Simple Mode)...');

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
            // "NoIndex_True" keeps us out of google index pages if that matters, but standard search is fine.
            // Using standard search URL matching the manual browser behavior
            // "listado" usually redirects to "autos", but let's try just the slug
            const url = `https://listado.mercadolibre.com.ar/${model.search}`;
            console.log(`   Navigating to: ${url}`);

            // Capture browser logs
            page.on('console', msg => console.log('PAGE LOG:', msg.text()));

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Wait for items
            try {
                await page.waitForSelector('.ui-search-layout__item, .poly-card, .andes-card', { timeout: 10000 });
            } catch (e) {
                console.log('   ⚠️ Wait for selector timed out, checking content anyway...');
            }

            // Scroll a bit to trigger lazy loads
            await page.evaluate(() => window.scrollBy(0, 500));
            await new Promise(r => setTimeout(r, 2000));

            // Extract data
            const items = await page.evaluate((brandModel) => {
                console.log('Evaluating page content...');
                const extracted = [];
                // Try multiple selectors
                const cards = document.querySelectorAll('.ui-search-layout__item, .poly-card, .andes-card, li.ui-search-layout__item');
                console.log(`Found ${cards.length} potential cards`);

                cards.forEach(card => {
                    try {
                        // Title
                        let title = card.querySelector('.ui-search-item__title')?.textContent ||
                            card.querySelector('.poly-component__title')?.textContent ||
                            card.querySelector('h2')?.textContent || '';
                        title = title.trim();

                        if (!title) return;

                        // Price
                        const priceContainer = card.querySelector('.ui-search-price, .poly-price__current, .andes-money-amount-combo');
                        const priceSymbol = priceContainer?.querySelector('.andes-money-amount__currency-symbol')?.textContent?.trim();
                        const priceFraction = priceContainer?.querySelector('.andes-money-amount__fraction')?.textContent?.trim().replace(/\./g, '');

                        if (!priceFraction) return;
                        let price = parseInt(priceFraction);

                        // Currency Normalization
                        const currency = (priceSymbol?.includes('U$S') || priceSymbol?.includes('US')) ? 'USD' : 'ARS';
                        if (currency === 'ARS') {
                            // Convert ARS to USD (approx 1150)
                            price = Math.round(price / 1150);
                        }

                        // Attributes (Year & Km)
                        const attrsList = Array.from(card.querySelectorAll('.ui-search-card-attributes__attribute, .poly-attributes-list__item, .ui-search-item__group__element'));
                        let year = 0;
                        let km = 0;

                        attrsList.forEach(attr => {
                            const txt = attr.textContent?.trim() || '';
                            if (!txt) return;
                            // Strict year match
                            if (/^(19|20)\d{2}$/.test(txt)) year = parseInt(txt);
                            // Km match
                            if (txt.toLowerCase().includes('km')) km = parseInt(txt.replace(/\D/g, ''));
                        });

                        // Fallback Year from Title
                        if (year === 0) {
                            const match = title.match(/\b(20\d{2}|19\d{2})\b/);
                            if (match) year = parseInt(match[0]);
                        }

                        // Link & ID
                        const link = (card.querySelector('a.ui-search-link') || card.querySelector('a'))?.href || '';
                        const idMatch = link.match(/(MLA-\d+)/) || link.match(/(MLA\d+)/);
                        const id = idMatch ? idMatch[0] : Math.random().toString(36).substring(7);

                        // Basic Filtering
                        if (price > 3000 && year > 1990) {
                            extracted.push({
                                id,
                                title, // Important for emergent rules
                                version: title, // Keeping title as version for now
                                year,
                                km,
                                price_usd: price,
                                brand_model: brandModel, // Enforce our known model name
                                url: link,
                                scraped_at: new Date().toISOString()
                            });
                        } else {
                            // console.log(`Skipped: ${title} - Price: ${price}, Year: ${year}`);
                        }
                    } catch (err) {
                        console.log('Error processing card:', err.message);
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
