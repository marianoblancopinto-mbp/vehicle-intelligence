import puppeteer, { Browser, Page } from 'puppeteer';

export interface VehicleReal {
    id: string;
    title: string;
    price_usd: number;
    currency: string;
    url: string;
    year: number;
    km: number;
    location: string;
    brand_model: string;
}

export class PuppeteerMeliClient {
    private browser: Browser | null = null;
    private readonly MAX_CONCURRENT_PAGES = 3;

    async init() {
        console.log("   [Puppeteer] Launching VISIBLE browser (stealth mode)...");
        this.browser = await puppeteer.launch({
            headless: true, // Run headless in agent environment
            defaultViewport: { width: 1366, height: 768 },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled', // Mask webdriver
                '--start-maximized'
            ]
        });
    }

    async close() {
        if (this.browser) await this.browser.close();
    }

    /**
     * Scrapes multiple models using concurrent tabs
     */
    async fetchMarketSegment(models: string[], maxItemsPerModel = 50): Promise<VehicleReal[]> {
        if (!this.browser) await this.init();
        let allItems: VehicleReal[] = [];

        // Process models in chunks to respect concurrency
        for (let i = 0; i < models.length; i += this.MAX_CONCURRENT_PAGES) {
            const chunk = models.slice(i, i + this.MAX_CONCURRENT_PAGES);
            console.log(`🔎 Scraping chunk: ${chunk.join(', ')}`);

            const results = await Promise.all(
                chunk.map(model => this.scrapeModel(model, maxItemsPerModel))
            );

            results.forEach(items => allItems = allItems.concat(items));
        }

        return allItems;
    }

    private async scrapeModel(model: string, maxLimit: number): Promise<VehicleReal[]> {
        if (!this.browser) return [];
        const page = await this.browser.newPage();
        const items: VehicleReal[] = [];
        const querySlug = model.toLowerCase().replace(/\s+/g, '-');

        page.on('console', msg => {
            if (msg.text().startsWith('[Browser]')) {
                console.log(`   ${msg.text()}`);
            }
        });

        // Emulate typical desktop viewport
        await page.setViewport({ width: 1366, height: 768 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        let offset = 0;
        let keepFetching = true;

        while (keepFetching && items.length < maxLimit) {
            // URL Structure
            const url = offset === 0
                ? `https://autos.mercadolibre.com.ar/${querySlug}_NoIndex_True`
                : `https://autos.mercadolibre.com.ar/${querySlug}_Desde_${offset + 1}_NoIndex_True`;

            try {
                // console.log(`   Navigating to: ${url}`);
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

                // Wait specifically for the items to load
                await page.waitForSelector('.ui-search-layout__item, .poly-card, .andes-card', { timeout: 5000 }).catch(() => null);

                // Extract Data from Page Context
                const pageItems = await page.evaluate((modelName) => {
                    const extracted: any[] = [];
                    // Selectors for both old Grid and new Poly layouts
                    const cards = document.querySelectorAll('.ui-search-layout__item, .poly-card, .andes-card');
                    console.log(`[Browser] Found ${cards.length} cards on page.`);

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

                            // Normalize Currency
                            const currency = (priceSymbol?.includes('U$S') || priceSymbol?.includes('US')) ? 'USD' : 'ARS';
                            if (currency === 'ARS') price = Math.round(price / 1150); // Hardcoded Blue Dollar, update if needed

                            // Attributes (Year & Km) - Crucial Step
                            // Usually in "2018 | 85.000 km" text blocks
                            const attrsList = Array.from(card.querySelectorAll('.ui-search-card-attributes__attribute, .poly-attributes-list__item, .ui-search-item__group__element'));
                            let year = 0;
                            let km = 0;

                            attrsList.forEach(attr => {
                                const txt = attr.textContent?.trim() || '';
                                if (!txt) return;

                                // Extract Year (19xx or 20xx)
                                // Only match if it stands alone or looks like a year
                                if (/^(19|20)\d{2}$/.test(txt)) {
                                    year = parseInt(txt);
                                }

                                // Extract Km
                                if (txt.toLowerCase().includes('km')) {
                                    km = parseInt(txt.replace(/\D/g, ''));
                                }
                            });

                            // Fallback Year from Title if missing
                            if (year === 0) {
                                const match = title.match(/\b(20\d{2}|19\d{2})\b/);
                                if (match) year = parseInt(match[0]);
                            }

                            // Link
                            const link = (card.querySelector('a.ui-search-link') as HTMLAnchorElement)?.href ||
                                (card.querySelector('a') as HTMLAnchorElement)?.href || '';

                            // ID
                            const idMatch = link.match(/(MLA-\d+)/) || link.match(/(MLA\d+)/);
                            const id = idMatch ? idMatch[0] : Math.random().toString(36);

                            if (price > 1000 && year > 1990) {
                                extracted.push({
                                    id,
                                    title,
                                    price_usd: price,
                                    currency,
                                    url: link,
                                    year,
                                    km,
                                    location: card.querySelector('.ui-search-item__location')?.textContent?.trim() || '',
                                    brand_model: modelName
                                });
                            }
                        } catch (err) {
                            // ignore individual card errors
                        }
                    });
                    return extracted;
                }, model);

                if (pageItems.length === 0) {
                    keepFetching = false;
                } else {
                    items.push(...pageItems);
                    offset += 48; // Standard MeLi pagination
                    // console.log(`   -> Extracted ${pageItems.length} items. Total: ${items.length}`);
                }

            } catch (error) {
                console.error(`   Error scraping ${model}:`, error);
                keepFetching = false;
            }
        }

        await page.close();
        console.log(`✅ ${model}: Done. Got ${items.length} valid vehicles.`);
        return items;
    }
}
