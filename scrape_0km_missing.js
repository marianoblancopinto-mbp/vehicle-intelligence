const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Models that need 0km data (excluding Ford EcoSport which has no listings)
const MODELS_TO_SCRAPE = [
    { search: 'jeep-compass-0km', brand_model: 'JEEP COMPASS', file: 'scraped_data_compass_0km.json' },
    { search: 'jeep-renegade-0km', brand_model: 'JEEP RENEGADE', file: 'scraped_data_renegade_0km.json' },
    { search: 'honda-hr-v-0km', brand_model: 'HONDA HR-V', file: 'scraped_data_hrv_0km.json' },
    { search: 'ford-territory-0km', brand_model: 'FORD TERRITORY', file: 'scraped_data_territory_0km.json' },
    { search: 'toyota-sw4-0km', brand_model: 'TOYOTA SW4', file: 'scraped_data_sw4_0km.json' },
    { search: 'volkswagen-tiguan-allspace-0km', brand_model: 'VOLKSWAGEN TIGUAN ALLSPACE', file: 'scraped_data_tiguanallspace_0km.json' },
    { search: 'volkswagen-tiguan-0km', brand_model: 'VOLKSWAGEN TIGUAN', file: 'scraped_data_tiguan_0km.json' },
    { search: 'peugeot-2008-0km', brand_model: 'PEUGEOT 2008', file: 'scraped_data_peugeot2008_0km.json' },
    { search: 'honda-cr-v-0km', brand_model: 'HONDA CR-V', file: 'scraped_data_crv_0km.json' },
    { search: 'kia-sorento-0km', brand_model: 'KIA SORENTO', file: 'scraped_data_sorento_0km.json' },
    { search: 'chevrolet-tracker-0km', brand_model: 'CHEVROLET TRACKER', file: 'scraped_data_tracker_0km.json' },
    { search: 'renault-duster-0km', brand_model: 'RENAULT DUSTER', file: 'scraped_data_duster_0km.json' }
];

async function scrapeZeroKm() {
    console.log('🚀 Starting 0km scraper for missing models...');

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
    console.log('\n🎉 Scraping complete!');
}

scrapeZeroKm();
