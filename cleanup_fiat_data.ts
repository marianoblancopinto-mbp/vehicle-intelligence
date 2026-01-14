import { promises as fs } from 'fs';
import { join } from 'path';

async function cleanupFiatData() {
    const dataPath = join(process.cwd(), 'data', 'market_data.json');

    try {
        const raw = await fs.readFile(dataPath, 'utf-8');
        const data = JSON.parse(raw);
        console.log(`Original count: ${data.length}`);

        // Filter out Fiat Fastback and Fiat Pulse
        const cleaned = data.filter((item: any) => {
            const brand = item.brand_model.toUpperCase();
            if (brand.includes('FIAT FASTBACK')) return false;
            if (brand.includes('FIAT PULSE')) return false;
            return true;
        });

        console.log(`Cleaned count: ${cleaned.length}`);
        console.log(`Removed: ${data.length - cleaned.length} records`);

        await fs.writeFile(dataPath, JSON.stringify(cleaned, null, 2));
        console.log('✅ Fiat data removed successfully.');

    } catch (e) {
        console.error('Error cleaning data:', e);
    }
}

cleanupFiatData();
