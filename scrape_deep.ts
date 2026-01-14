import { PuppeteerMeliClient } from './agents/agent_a/puppeteer_client';
import { DataCurator } from './agents/agent_a/curator';
import { promises as fs } from 'fs';
import { join } from 'path';

const TARGET_MODELS = [
    "Toyota Corolla Cross"
    // "Volkswagen Taos",
    // "Nissan Kicks"
];

async function runDeepScrape() {
    console.log("🚀 Deep Scraper Starting [For LLM Analysis]...");

    const client = new PuppeteerMeliClient();
    await client.init();

    try {
        console.log(`📋 Target List: ${TARGET_MODELS.length} models`);
        // We set limit to 100 per model for now to be fast, but user asked for "muchos datos".
        // Let's try 150. Max limit in client handles pagination.
        const rawData = await client.fetchMarketSegment(TARGET_MODELS, 150);

        console.log(`\n🧹 Curating ${rawData.length} raw items...`);
        const curator = new DataCurator();
        const cleanData = curator.process(rawData);

        console.log(`💾 Saving ${cleanData.length} items to data/raw_market_data_deep.json...`);
        const dataPath = join(process.cwd(), 'data', 'raw_market_data_deep.json');
        await fs.writeFile(dataPath, JSON.stringify(cleanData, null, 2));

        console.log("✅ Deep Scrape Finished.");
    } catch (e) {
        console.error("❌ Critical Error:", e);
        await fs.writeFile('scrape_error.log', String(e) + '\n' + (e instanceof Error ? e.stack : ''));
        process.exit(1);
    } finally {
        await client.close();
    }
}

runDeepScrape();
