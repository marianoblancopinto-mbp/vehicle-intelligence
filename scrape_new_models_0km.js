const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Models specifically requested by user
const MODELS_TO_SCRAPE = [
    { search: 'fiat-fastback-0km', brand_model: 'FIAT FASTBACK', file: 'scraped_data_fastback_0km.json' },
    { search: 'fiat-pulse-0km', brand_model: 'FIAT PULSE', file: 'scraped_data_pulse_0km.json' },
    { search: 'peugeot-5008-0km', brand_model: 'PEUGEOT 5008', file: 'scraped_data_peugeot5008_0km.json' }
];

async function scrapeZeroKm() {
    console.log('🚀 Starting 0km scraper for New Models (Fastback, Pulse, 5008)...');

    const browser = await puppeteer.launch({
        headless: false, // Keep visible for debugging if needed, or change to true
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--start-maximized'
        ]
    });

    for (const model of MODELS_TO_SCRAPE) {
        console.log(`\n📦 Scraping ${model.brand_model}...`);
        const page = await browser.newPage();

        await page.setViewport({ width: 1366, height: 768 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        try {
            const url = `https://listado.mercadolibre.com.ar/${model.search}`;
            console.log(`   Navigating to: ${url}`);
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Wait for items to load
            await page.waitForSelector('.ui-search-layout__item, .poly-card, .andes-card', { timeout: 10000 }).catch(() => null);

            // Add a human-like delay
            await new Promise(r => setTimeout(r, 2000));

            // Extract data
            const items = await page.evaluate(() => {
                const extracted = [];
                const cards = document.querySelectorAll('.ui-search-layout__item, .poly-card, .andes-card');

                cards.forEach(card => {
                    try {
                        // Title/Version
                        let title = card.querySelector('.ui-search-item__title')?.textContent ||
                            card.querySelector('.poly-component__title')?.textContent || '';
                        title = title.trim();

                        // Price
                        const priceContainer = card.querySelector('.ui-search-price, .poly-price__current, .andes-money-amount-combo');
                        const priceSymbol = priceContainer?.querySelector('.andes-money-amount__currency-symbol')?.textContent?.trim();
                        const priceFraction = priceContainer?.querySelector('.andes-money-amount__fraction')?.textContent?.trim().replace(/\./g, '');

                        if (!priceFraction) return;
                        const price = parseInt(priceFraction);

                        // Determine currency
                        const currency = (priceSymbol?.includes('U$S') || priceSymbol?.includes('US')) ? 'USD' : 'ARS';

                        if (price > 1000) {
                            extracted.push({
                                version: title,
                                price: price,
                                currency: currency
                            });
                        }
                    } catch (err) {
                        // ignore individual card errors
                    }
                });
                return extracted;
            });

            console.log(`   ✅ Found ${items.length} listings for ${model.brand_model}`);

            if (items.length > 0) {
                const filePath = path.join(__dirname, model.file);
                fs.writeFileSync(filePath, JSON.stringify(items, null, 4));
                console.log(`   💾 Saved to ${model.file}`);
            } else {
                console.log(`   ⚠️ No 0km listings found for ${model.brand_model}`);
            }

        } catch (error) {
            console.error(`   ❌ Error scraping ${model.brand_model}:`, error.message);
        }

        await page.close();
        // Delay between models to avoid rate limiting
        await new Promise(r => setTimeout(r, 3000));
    }

    await browser.close();
    console.log('\n🎉 0km Scraping complete!');
}

scrapeZeroKm();
