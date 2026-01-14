import { readFile } from 'fs/promises';
import { join } from 'path';

async function diagnose() {
    const path = join(process.cwd(), 'data', 'market_data.json');
    try {
        const raw = await readFile(path, 'utf-8');
        const data = JSON.parse(raw);

        console.log(`Total Items: ${data.length}`);

        // Group by model
        const counts: Record<string, number> = {};
        const prices: Record<string, number[]> = {};

        data.forEach((d: any) => {
            const m = d.brand_model || "UNKNOWN";
            counts[m] = (counts[m] || 0) + 1;
            if (!prices[m]) prices[m] = [];
            prices[m].push(d.price_usd);

            // Debbug Filter
            if (m.includes("Toyota SW4")) {
                const passYear = d.year > 1990;
                const passPrice = d.price_usd > 2000;
                const passKm = d.km >= 0;
                if (!passYear || !passPrice || !passKm) {
                    console.log(`[DEBUG FAIL] Model: ${m}, Year: ${d.year} (${passYear}), Price: ${d.price_usd} (${passPrice}), Km: ${d.km} (${passKm})`);
                }
            }
        });

        console.log("\n--- Counts per Model ---");
        Object.keys(counts).forEach(m => {
            const avgPrice = prices[m].reduce((a, b) => a + b, 0) / prices[m].length;
            console.log(`${m}: ${counts[m]} items. Avg Price: $${avgPrice.toFixed(0)}`);
        });

        // Check for zeros
        const zeros = data.filter((d: any) => d.price_usd === 0 || d.year === 0).length;
        console.log(`\nItems with 0 Price/Year: ${zeros}`);

        if (data.length > 0) {
            console.log("\nSample Item:", data[0]);
        }

    } catch (e) {
        console.error("Error reading data:", e);
    }
}

diagnose();
