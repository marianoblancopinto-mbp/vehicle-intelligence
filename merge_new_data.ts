import { promises as fs } from 'fs';
import { join } from 'path';

async function mergeData() {
    const mainPath = join(process.cwd(), 'data', 'market_data.json');
    const newPath = join(process.cwd(), 'data', 'raw_market_data_new_models.json');

    try {
        const mainData = JSON.parse(await fs.readFile(mainPath, 'utf-8'));
        const newData = JSON.parse(await fs.readFile(newPath, 'utf-8'));

        console.log(`Original count: ${mainData.length}`);
        console.log(`New items to merge: ${newData.length}`);

        // Simple deduplication based on ID if available, or just append
        // Our scraper generates IDs, so let's use them.
        const existingIds = new Set(mainData.map((d: any) => d.id));
        let addedCount = 0;

        for (const item of newData) {
            if (!existingIds.has(item.id)) {
                mainData.push(item);
                existingIds.add(item.id);
                addedCount++;
            }
        }

        console.log(`Added ${addedCount} unique records.`);
        console.log(`Final count: ${mainData.length}`);

        await fs.writeFile(mainPath, JSON.stringify(mainData, null, 2));
        console.log('✅ Merge successful!');

    } catch (error) {
        console.error('❌ Merge failed:', error);
    }
}

mergeData();
