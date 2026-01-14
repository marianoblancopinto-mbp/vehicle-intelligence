import { promises as fs } from 'fs';
import { join } from 'path';

async function analyze() {
    const dataPath = join(process.cwd(), 'data', 'market_data.json');
    const rawData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

    const distribution: Record<string, Set<string>> = {};

    rawData.forEach((item: any) => {
        const key = item.brand_model;
        if (!distribution[key]) distribution[key] = new Set();

        // Combine Version and Title for full context
        const text = `${item.version || ''} | ${item.title}`.toUpperCase();
        distribution[key].add(text);
    });

    let output = '';
    Object.keys(distribution).forEach(model => {
        output += `\n\n=== ${model} (${distribution[model].size} unique signatures) ===\n`;
        const sorted = Array.from(distribution[model]).sort();
        sorted.forEach(s => output += s + '\n');
    });

    await fs.writeFile('analysis_output.txt', output);
    console.log("Analysis saved to analysis_output.txt");
}

analyze();
