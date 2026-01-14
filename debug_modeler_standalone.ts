import { PriceModeler } from './agents/agent_b/modeler';
import { readFile } from 'fs/promises';
import { join } from 'path';

async function test() {
    const modeler = new PriceModeler();

    // 2. Real Data Test
    console.log("\n--- TEST 2: Real Data ---");
    const content = await readFile(join(process.cwd(), 'data', 'market_data.json'), 'utf-8');
    const allData = JSON.parse(content);

    // Force lowercase matching or something? No, exact match.
    // Let's grab ANY item first to see if it trains.
    // Or stick to SW4.
    const sw4Data = allData.filter((d: any) => d.brand_model.includes("SW4"));
    console.log(`Loaded ${sw4Data.length} SW4 items.`);

    if (sw4Data.length > 0) {
        console.log("Sample SW4 Item:", sw4Data[0]);
        const res2 = modeler.trainModel(sw4Data);
        console.log("Result 2 R2:", res2.r2);
        console.log("Depreciation:", res2.depreciation);
    } else {
        console.log("No SW4 data found in loaded file.");
    }
}

test();
