import { PuppeteerMeliClient } from './puppeteer_client';
import { DataCurator } from './curator';
import { promises as fs } from 'fs';
import { join } from 'path';

const TARGET_MODELS = [
    // Benchmark
    "Toyota SW4"
];

async function runAgent() {
    console.log("🚀 Agent A (Miner) Starting [PUPPETEER SAFE MODE]...");

    const client = new PuppeteerMeliClient();
    await client.init();

    try {
        console.log(`📋 Target List: ${TARGET_MODELS.length} models`);
        const rawData = await client.fetchMarketSegment(TARGET_MODELS, 20); // Just 20 items to verify pipeline

        console.log(`\n🧹 Curating ${rawData.length} raw items...`);
        const curator = new DataCurator();
        const cleanData = curator.curate(rawData);

        console.log(`💾 Saving ${cleanData.length} high-quality items to database...`);
        const dataPath = join(process.cwd(), 'data', 'market_data.json');
        await fs.writeFile(dataPath, JSON.stringify(cleanData, null, 2));

        console.log("✅ Agent A Finished Successfully.");
    } catch (e) {
        console.error("❌ Critical Error:", e);
    } finally {
        await client.close();
    }
}

runAgent();
