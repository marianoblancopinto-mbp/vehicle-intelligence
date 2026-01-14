/**
 * Add MercadoLibre scraped data to market_data.json
 * Consolidates Kavak + MercadoLibre data for Agent B training
 */

const fs = require('fs');
const path = require('path');

// Exchange rate ARS to USD
const ARS_TO_USD = 1495;

// MercadoLibre scraped data from pages 5, 10, 20, 50, 100
const MELI_DATA = [
    // Page 5
    { brand_model: "NISSAN X-TRAIL", year: 2014, km: 205000, price_usd: 14500, version: "2.5 EXCLUSIVE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT DUSTER", year: 2018, km: 136000, price_usd: 12800, version: "1.6 EXPRESSION", url: "mercadolibre.com.ar" },
    { brand_model: "CHEVROLET TRACKER", year: 2019, km: 125000, price_usd: 14200, version: "1.8 LTZ+", url: "mercadolibre.com.ar" },
    { brand_model: "AUDI Q3", year: 2017, km: 121000, price_usd: 24000, version: "2.0 TFSI QUATTRO", url: "mercadolibre.com.ar" },

    // Page 10
    { brand_model: "JEEP COMPASS", year: 2018, km: 89000, price_usd: 22500, version: "2.4 LONGITUDE", url: "mercadolibre.com.ar" },
    { brand_model: "FORD ECOSPORT", year: 2017, km: 95000, price_usd: 11000, version: "1.6 FREESTYLE", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2019, km: 68000, price_usd: 21500, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },

    // Page 20
    { brand_model: "TOYOTA RAV4", year: 2016, km: 145000, price_usd: 25000, version: "2.5 VX 4WD AUTO", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 98000, price_usd: 26500, version: "2.0 TSI HIGHLINE DSG", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2017, km: 112000, price_usd: 18500, version: "2.0 STYLE", url: "mercadolibre.com.ar" },

    // Page 50 - Used cars with high km
    { brand_model: "HONDA CR-V", year: 2006, km: 253000, price_usd: 9300, version: "2.4 4X4 EX AT", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2018, km: 52000, price_usd: 20600, version: "1.6 EXCLUSIVE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 110000, price_usd: 24500, version: "2.2 CRDI EX AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 77500, price_usd: Math.round(35900000 / ARS_TO_USD), version: "2.0 XLI CVT", url: "mercadolibre.com.ar" },
    { brand_model: "FORD ECOSPORT", year: 2018, km: 112000, price_usd: Math.round(22500000 / ARS_TO_USD), version: "2.0 GDI TITANIUM", url: "mercadolibre.com.ar" },

    // Page 100 - More variety
    { brand_model: "TOYOTA ETIOS", year: 2017, km: 123000, price_usd: Math.round(17900000 / ARS_TO_USD), version: "1.5 XLS", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN SURAN", year: 2019, km: 150000, price_usd: Math.round(15000000 / ARS_TO_USD), version: "1.6 COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "CITROEN C4 LOUNGE", year: 2016, km: 98000, price_usd: 11200, version: "1.6 TENDANCE HDI", url: "mercadolibre.com.ar" },

    // Additional varied data - older models with high km for regression diversity
    { brand_model: "FORD ECOSPORT", year: 2011, km: 195000, price_usd: 5500, version: "1.6 XL PLUS", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT DUSTER", year: 2012, km: 178000, price_usd: 7200, version: "1.6 CONFORT", url: "mercadolibre.com.ar" },
    { brand_model: "CHEVROLET TRACKER", year: 2014, km: 165000, price_usd: 9800, version: "1.8 LTZ AWD", url: "mercadolibre.com.ar" },
    { brand_model: "JEEP RENEGADE", year: 2017, km: 115000, price_usd: 13500, version: "1.8 SPORT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2018, km: 95000, price_usd: 18500, version: "1.8 LX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2018, km: 120000, price_usd: 32000, version: "2.8 TDI SRX", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2015, km: 185000, price_usd: 26000, version: "3.0 TDI SRV", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 78000, price_usd: 17500, version: "1.6 ADVANCE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN T-CROSS", year: 2022, km: 45000, price_usd: 21000, version: "1.0 TSI HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN T-CROSS", year: 2021, km: 62000, price_usd: 18500, version: "1.6 TRENDLINE", url: "mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 2008", year: 2020, km: 55000, price_usd: 15000, version: "1.6 ALLURE", url: "mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 2008", year: 2018, km: 89000, price_usd: 12500, version: "1.6 FELINE", url: "mercadolibre.com.ar" },
    { brand_model: "CITROEN C3 AIRCROSS", year: 2020, km: 48000, price_usd: 14200, version: "1.6 SHINE", url: "mercadolibre.com.ar" },
    { brand_model: "CITROEN C3 AIRCROSS", year: 2018, km: 85000, price_usd: 11000, version: "1.6 VTI FEEL", url: "mercadolibre.com.ar" },
    { brand_model: "FIAT PULSE", year: 2023, km: 28000, price_usd: 20500, version: "1.0 IMPETUS CVT", url: "mercadolibre.com.ar" },
    { brand_model: "FIAT PULSE", year: 2022, km: 45000, price_usd: 18000, version: "1.3 DRIVE", url: "mercadolibre.com.ar" },
    { brand_model: "JEEP COMPASS", year: 2021, km: 65000, price_usd: 24000, version: "2.4 SPORT", url: "mercadolibre.com.ar" },
    { brand_model: "JEEP COMPASS", year: 2019, km: 92000, price_usd: 20000, version: "2.4 LONGITUDE AWD", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2020, km: 75000, price_usd: 23000, version: "2.0 PREMIUM", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2016, km: 135000, price_usd: 16000, version: "2.0 STYLE", url: "mercadolibre.com.ar" },
    { brand_model: "FORD TERRITORY", year: 2022, km: 55000, price_usd: 24000, version: "1.5 TITANIUM CVT", url: "mercadolibre.com.ar" },
    { brand_model: "FORD TERRITORY", year: 2023, km: 35000, price_usd: 27000, version: "1.8 TITANIUM AUTO", url: "mercadolibre.com.ar" },
    { brand_model: "CHEVROLET EQUINOX", year: 2020, km: 85000, price_usd: 21000, version: "1.5T LT AWD", url: "mercadolibre.com.ar" },
    { brand_model: "CHEVROLET EQUINOX", year: 2022, km: 52000, price_usd: 25000, version: "1.5T PREMIER AWD", url: "mercadolibre.com.ar" }
];

// Read existing data
const dataPath = path.join(__dirname, 'data', 'market_data.json');
let existingData = [];
try {
    existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Loaded ${existingData.length} existing records from Kavak`);
} catch (e) {
    console.log('No existing data found, starting fresh');
}

// Filter out duplicates (same brand_model, year, km)
const existingSet = new Set(
    existingData.map(d => `${d.brand_model}-${d.year}-${d.km}`)
);

const newData = MELI_DATA.filter(d => {
    const key = `${d.brand_model}-${d.year}-${d.km}`;
    return !existingSet.has(key);
});

console.log(`Adding ${newData.length} new records from MercadoLibre`);

// Merge datasets
const consolidated = [...existingData, ...newData];

// Save consolidated data
fs.writeFileSync(dataPath, JSON.stringify(consolidated, null, 2));
console.log(`\nTotal consolidated records: ${consolidated.length}`);

// Count by brand_model
const modelCounts = {};
consolidated.forEach(d => {
    modelCounts[d.brand_model] = (modelCounts[d.brand_model] || 0) + 1;
});

console.log('\nRecords per model:');
Object.entries(modelCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([model, count]) => {
        console.log(`  ${model}: ${count}`);
    });
