import { readFile } from 'fs/promises';
import { join } from 'path';

async function check() {
    const path = join(process.cwd(), 'data', 'market_data.json');
    const raw = await readFile(path, 'utf-8');
    const data = JSON.parse(raw);

    console.log("Checking first 5 items:");
    data.slice(0, 5).forEach((d: any, i: number) => {
        console.log(`[${i}] Model: ${d.brand_model}, Year: ${d.year} (${typeof d.year}), Price: ${d.price_usd} (${typeof d.price_usd}), Brand: ${d.brand}`);
    });
}
check();
