const fs = require('fs');
const path = require('path');

const ARS_TO_USD = 1495; // Fixed exchange rate
const OUTPUT_FILE = path.join(__dirname, 'market_data.json');

// Mappings from scraped file name (or content) to brand_model
const FILE_MAPPINGS = [
    { file: 'scraped_data_kicks_0km.json', brand_model: 'NISSAN KICKS' },
    { file: 'scraped_data_taos_0km.json', brand_model: 'VOLKSWAGEN TAOS' },
    { file: 'scraped_data_tcross_0km.json', brand_model: 'VOLKSWAGEN T-CROSS' },
    { file: 'scraped_data_corollacross_0km.json', brand_model: 'TOYOTA COROLLA CROSS' },
    { file: 'scraped_data_nivus_0km.json', brand_model: 'VOLKSWAGEN NIVUS' },
    { file: 'scraped_data_tucson_0km.json', brand_model: 'HYUNDAI TUCSON' },
    { file: 'scraped_data_kardian_0km.json', brand_model: 'RENAULT KARDIAN' }
];

function loadExistingData() {
    if (fs.existsSync(OUTPUT_FILE)) {
        return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    }
    return [];
}

function processFiles() {
    let marketData = loadExistingData();
    let initialCount = marketData.length;
    let newEntriesCount = 0;

    FILE_MAPPINGS.forEach(mapping => {
        const filePath = path.join(__dirname, mapping.file);
        if (fs.existsSync(filePath)) {
            console.log(`Processing ${mapping.file}...`);
            const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            rawData.forEach(item => {
                let priceUSD = 0;

                // Normalization of currency
                if (item.currency === 'ARS') {
                    priceUSD = Math.round(item.price / ARS_TO_USD);
                } else {
                    priceUSD = item.price;
                }

                // Create the data object compatible with market_data.json
                const newEntry = {
                    brand_model: mapping.brand_model, // Use the mapped standard name
                    year: 2025, // 0km assumption
                    km: 0,
                    price: priceUSD,
                    // Optional metadata to trace source
                    source: 'mercadolibre_0km_scrape',
                    version: item.version
                };

                // Deduplication check
                const exists = marketData.some(entry =>
                    entry.brand_model === newEntry.brand_model &&
                    entry.year === newEntry.year &&
                    entry.km === newEntry.km &&
                    Math.abs(entry.price - newEntry.price) < 100 // Tolerance for price dupes
                );

                if (!exists) {
                    marketData.push(newEntry);
                    newEntriesCount++;
                }
            });
        } else {
            console.warn(`File not found: ${mapping.file}`);
        }
    });

    // Write back to market_data.json
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(marketData, null, 2));
    console.log(`Consolidation complete. Added ${newEntriesCount} new 0km entries. Total data points: ${marketData.length}`);
}

processFiles();
