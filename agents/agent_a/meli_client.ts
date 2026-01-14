import * as cheerio from 'cheerio';

export interface VehicleRAW {
    id: string;
    title: string;
    price_usd: number;
    currency: string;
    url: string;
    year: number;
    km: number;
    location: string;
    body_type: string;
}

export class MercadoLibreClient {
    private readonly BASE_URL = "https://autos.mercadolibre.com.ar";

    // Headers to mimic a browser
    private readonly HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Referer': 'https://www.mercadolibre.com.ar/'
    };

    /**
     * Scrapes a specific model by constructing the search URL.
     * URL Pattern: https://autos.mercadolibre.com.ar/{brand}-{model}/_Desde_{offset + 1}
     * or generic search: https://autos.mercadolibre.com.ar/{query}_Desde_{offset + 1}
     */
    async fetchMarketSegment(models: string[], maxItemsPerModel = 150) {
        let allItems: VehicleRAW[] = [];

        for (const model of models) {
            console.log(`🔎 Scraping MELI (HTML) for: ${model}...`);
            let offset = 0;
            let keepFetching = true;

            // Formatter for URL slug (e.g. "Toyota SW4" -> "toyota-sw4")
            const querySlug = model.toLowerCase().replace(/\s+/g, '-');

            while (keepFetching && offset < maxItemsPerModel) {
                // Strategy: Use the brand-model URL structure if possible, or generic search
                // URL for page 1: https://autos.mercadolibre.com.ar/toyota-sw4
                // URL for page 2 (item 49+): https://autos.mercadolibre.com.ar/toyota-sw4_Desde_49

                const url = offset === 0
                    ? `${this.BASE_URL}/${querySlug}_NoIndex_True`
                    : `${this.BASE_URL}/${querySlug}_Desde_${offset + 1}_NoIndex_True`;

                try {
                    const html = await this.fetchHtml(url);
                    const items = this.parseListings(html);

                    if (items.length === 0) {
                        console.log(`   -> No more items found at offset ${offset}. Stopping.`);
                        keepFetching = false;
                        break;
                    }

                    console.log(`   -> Found ${items.length} items on page.`);

                    // Inject the model name being searched as the brand_model
                    // This fixes the missing metadata issue from HTML scraping
                    const taggedItems = items.map(item => ({
                        ...item,
                        brand_model: model, // e.g. "Toyota SW4"
                        brand: model.split(' ')[0],
                        model: model.split(' ').slice(1).join(' ')
                    }));

                    allItems = allItems.concat(taggedItems);

                    offset += 48; // MELI usually shows 48 or 50 items per page
                    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000)); // Politeness delay

                } catch (error) {
                    console.error(`   -> Error scraping ${url}:`, error);
                    keepFetching = false;
                }
            }
        }
        return allItems;
    }

    private async fetchHtml(url: string): Promise<string> {
        const res = await fetch(url, { headers: this.HEADERS });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        return await res.text();
    }

    private parseListings(html: string): VehicleRAW[] {
        const $ = cheerio.load(html);
        const items: VehicleRAW[] = [];

        // Try multiple container selectors (Grid vs List vs Poly)
        // .ui-search-layout__item is the wrapper for both Grid and List usually
        const containers = $('.ui-search-layout__item, .poly-card, .andes-card');

        containers.each((_, el) => {
            try {
                // Title Selectors
                let title = $(el).find('.ui-search-item__title').text().trim();
                if (!title) title = $(el).find('.poly-component__title').text().trim();
                if (!title) title = $(el).find('h2').text().trim();

                // Link Selectors
                let link = $(el).find('a.ui-search-link').attr('href') || '';
                if (!link) link = $(el).find('a').attr('href') || '';

                // Price Selectors
                // Price typically in .ui-search-price or .poly-price
                // We look for the FIRST .andes-money-amount__fraction inside the price container
                const priceContainer = $(el).find('.ui-search-price, .poly-price__current, .andes-money-amount-combo');
                const priceSymbol = priceContainer.find('.andes-money-amount__currency-symbol').first().text().trim();
                const priceFraction = priceContainer.find('.andes-money-amount__fraction').first().text().replace(/\./g, '').trim();
                const price = parseInt(priceFraction) || 0;

                // Attributes (Year | Km)
                // New Poly cards might have them in .poly-attributes-list
                const attrsList = $(el).find('.ui-search-card-attributes__attribute, .poly-attributes-list__item');
                let year = 0;
                let km = 0;

                attrsList.each((_, attr) => {
                    const txt = $(attr).text().trim();
                    const yearMatch = txt.match(/\b(19|20)\d{2}\b/);
                    if (yearMatch) year = parseInt(yearMatch[0]);

                    if (txt.toLowerCase().includes('km')) km = parseInt(txt.replace(/\D/g, ''));
                });

                // Fallback: Extract Year from Title if not found in attributes
                if (year === 0) {
                    const titleYearMatch = title.match(/\b(19|20)\d{2}\b/);
                    if (titleYearMatch) year = parseInt(titleYearMatch[0]);
                }

                if (title && price > 0) {
                    const isUSD = priceSymbol.includes('U$S') || priceSymbol.includes('US');
                    let finalPrice = price;
                    const currencyCode = isUSD ? 'USD' : 'ARS';

                    if (currencyCode === 'ARS') {
                        finalPrice = Math.round(price / 1150);
                    }

                    // ID extraction
                    const idMatch = link.match(/(MLA-\d+)/) || link.match(/(MLA\d+)/);
                    const id = idMatch ? idMatch[0] : `scraped_${Math.random().toString(36).substr(2, 9)}`;

                    // Avoid duplicates if same item matched by multiple selectors (unlikely with .each on containers)
                    // But filtered mainly by price > 0

                    items.push({
                        id,
                        title,
                        price_usd: finalPrice,
                        currency: currencyCode,
                        url: link,
                        year,
                        km,
                        location: $(el).find('.ui-search-item__location, .poly-component__location').text().trim(),
                        body_type: 'Unknown'
                    });
                }
            } catch (e) {
                // Ignore
            }
        });

        // Dedup by ID just in case
        const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
        return uniqueItems;
    }
}
