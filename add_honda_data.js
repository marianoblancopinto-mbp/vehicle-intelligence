/**
 * Add Honda CR-V and ZR-V scraped data
 */

const fs = require('fs');
const path = require('path');

const ARS_TO_USD = 1495;

const HONDA_DATA = [
    // CR-V Page 1
    { brand_model: "HONDA CR-V", year: 2006, km: 253000, price_usd: 9300, version: "2.4 4X4 EX AT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2012, km: 185800, price_usd: Math.round(21500000 / ARS_TO_USD), version: "2.4 LX 2WD AT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2016, km: 170000, price_usd: 21000, version: "2.4 LX 2WD CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2010, km: 298000, price_usd: Math.round(15900000 / ARS_TO_USD), version: "2.4 LX AT 2WD", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2016, km: 140000, price_usd: 20000, version: "2.4 LX 2WD AT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2008, km: 210000, price_usd: 11000, version: "2.4 EX 4WD AT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2011, km: 178000, price_usd: 14500, version: "2.4 LX AT 2WD", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2014, km: 125000, price_usd: 19500, version: "2.4 LX AT 2WD", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2015, km: 98000, price_usd: 22000, version: "2.4 EX L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2017, km: 85000, price_usd: 25000, version: "2.4 LX 2WD CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2018, km: 72000, price_usd: 28500, version: "2.4 LX 2WD CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2019, km: 55000, price_usd: 32000, version: "1.5T EX CVT", url: "mercadolibre.com.ar" },

    // CR-V Page 2
    { brand_model: "HONDA CR-V", year: 2010, km: 255000, price_usd: 11500, version: "LX AT 2WD", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2016, km: 49500, price_usd: 27000, version: "LX 2WD CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2021, km: 80900, price_usd: 40000, version: "LX 2WD CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2011, km: 195000, price_usd: 15000, version: "EX L AT 4WD", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2014, km: 88000, price_usd: 24500, version: "LX 2WD AT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2007, km: 220000, price_usd: 7500, version: "2.4 EX AT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2023, km: 35000, price_usd: 45000, version: "1.5T EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2020, km: 62000, price_usd: 35000, version: "1.5T LX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2013, km: 145000, price_usd: 17500, version: "2.4 LX AT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2009, km: 180000, price_usd: 12500, version: "2.4 EX AT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA CR-V", year: 2022, km: 42000, price_usd: 42000, version: "1.5T EX CVT", url: "mercadolibre.com.ar" },

    // ZR-V (new model, mostly 2024-2025)
    { brand_model: "HONDA ZR-V", year: 2024, km: 43000, price_usd: 34000, version: "2.0 TOURING", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA ZR-V", year: 2024, km: 15200, price_usd: 34000, version: "2.0 TOURING", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA ZR-V", year: 2025, km: 11000, price_usd: 33800, version: "2.0 TOURING", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA ZR-V", year: 2024, km: 10700, price_usd: 29895, version: "2.0 LX", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA ZR-V", year: 2025, km: 19000, price_usd: 32500, version: "2.0 TOURING", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA ZR-V", year: 2024, km: 17200, price_usd: 43000, version: "2.0 LX", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA ZR-V", year: 2024, km: 19000, price_usd: 39000, version: "2.0 TOURING", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA ZR-V", year: 2025, km: 8063, price_usd: Math.round(57900000 / ARS_TO_USD), version: "2.0 TOURING", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA ZR-V", year: 2024, km: 25000, price_usd: 31000, version: "2.0 TOURING", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA ZR-V", year: 2024, km: 8500, price_usd: 36000, version: "2.0 TOURING", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA ZR-V", year: 2025, km: 5000, price_usd: 38000, version: "2.0 TOURING", url: "mercadolibre.com.ar" },
];

// Read existing data
const dataPath = path.join(__dirname, 'data', 'market_data.json');
let existingData = [];
try {
    existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Loaded ${existingData.length} existing records`);
} catch (e) {
    console.log('No existing data found');
}

// Filter duplicates
const existingSet = new Set(
    existingData.map(d => `${d.brand_model}-${d.year}-${d.km}`)
);

const newData = HONDA_DATA.filter(d => {
    const key = `${d.brand_model}-${d.year}-${d.km}`;
    return !existingSet.has(key);
});

console.log(`Adding ${newData.length} new Honda records`);

// Merge and save
const consolidated = [...existingData, ...newData];
fs.writeFileSync(dataPath, JSON.stringify(consolidated, null, 2));

console.log(`\n✅ Total records: ${consolidated.length}`);

// Count by model
const crvCount = consolidated.filter(d => d.brand_model === 'HONDA CR-V').length;
const zrvCount = consolidated.filter(d => d.brand_model === 'HONDA ZR-V').length;
console.log(`Honda CR-V records: ${crvCount}`);
console.log(`Honda ZR-V records: ${zrvCount}`);
