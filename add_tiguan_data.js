/**
 * Add Tiguan data from MercadoLibre scraping
 */

const fs = require('fs');
const path = require('path');

const ARS_TO_USD = 1495;

// Tiguan data scraped from MercadoLibre (3 pages)
const TIGUAN_DATA = [
    // Page 1
    { brand_model: "VOLKSWAGEN TIGUAN ALLSPACE", year: 2024, km: 26000, price_usd: 49900, version: "350 TSI 4MOTION DSG", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2014, km: 152000, price_usd: Math.round(25000000 / ARS_TO_USD), version: "2.0 SPORT STYLE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2021, km: 83296, price_usd: Math.round(41700000 / ARS_TO_USD), version: "1.4 TSI DSG", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2020, km: 95000, price_usd: 25300, version: "250TSI DSG", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN ALLSPACE", year: 2019, km: 75700, price_usd: 33000, version: "2.0 TSI HIGHLINE 4MOTION", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2013, km: 129000, price_usd: 16000, version: "2.0 SPORT STYLE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2012, km: 39000, price_usd: 21000, version: "2.0 SPORT STYLE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2012, km: 250000, price_usd: 17500, version: "2.0 PREMIUM TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2021, km: 39000, price_usd: Math.round(38900000 / ARS_TO_USD), version: "250 TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2013, km: 127000, price_usd: 18499, version: "2.0 EXCLUSIVE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2016, km: 104500, price_usd: Math.round(37000000 / ARS_TO_USD), version: "2.0 ELEGANCE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2015, km: 153000, price_usd: 21900, version: "2.0 TDI 4MOTION SPORT", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 70282, price_usd: 27800, version: "1.4 TSI DSG", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2014, km: 117500, price_usd: 18000, version: "2.0 EXCLUSIVE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2013, km: 110000, price_usd: 15900, version: "2.0 SPORT STYLE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2014, km: 119000, price_usd: 14400, version: "2.0 EXCLUSIVE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2009, km: 225000, price_usd: 10000, version: "2.0 TSI SPORT STYLE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2012, km: 210000, price_usd: Math.round(21900000 / ARS_TO_USD), version: "2.0 PREMIUM", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 116000, price_usd: 25500, version: "1.4 TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2015, km: 200000, price_usd: Math.round(25000000 / ARS_TO_USD), version: "2.0 EXCLUSIVE TSI 4X4", url: "mercadolibre.com.ar" },

    // Page 2
    { brand_model: "VOLKSWAGEN TIGUAN ALLSPACE", year: 2019, km: 88000, price_usd: 22999, version: "1.4 TRENDLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN ALLSPACE", year: 2019, km: 110000, price_usd: Math.round(33700000 / ARS_TO_USD), version: "1.4 TRENDLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN ALLSPACE", year: 2018, km: 92500, price_usd: 30500, version: "2.0 TSI HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN ALLSPACE", year: 2018, km: 120000, price_usd: 21500, version: "1.4 TRENDLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN ALLSPACE", year: 2021, km: 64800, price_usd: 41500, version: "2.0 TSI HIGHLINE", url: "mercadolibre.com.ar" },

    // Page 3
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 140000, price_usd: 24900, version: "2.0 PREMIUM TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 137634, price_usd: 23500, version: "1.4 TSI DSG", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2023, km: 59000, price_usd: 41900, version: "2.0 PREMIUM TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2010, km: 200000, price_usd: 11000, version: "2.0 SPORT STYLE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2012, km: 207000, price_usd: 16800, version: "2.0 PREMIUM TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2013, km: 180000, price_usd: 16500, version: "2.0 EXCLUSIVE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2012, km: 185000, price_usd: 15000, version: "2.0 PREMIUM TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 78000, price_usd: 27000, version: "1.4 DSG TRENDLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 194000, price_usd: 22000, version: "1.4 TSI DSG TRENDLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2012, km: 178000, price_usd: 13000, version: "2.0 SPORT STYLE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2010, km: 242000, price_usd: 14900, version: "2.0 TSI EXCLUSIVE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2012, km: 124000, price_usd: 12800, version: "2.0 EXCLUSIVE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2020, km: 174632, price_usd: 22000, version: "250TSI DSG", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2013, km: 160000, price_usd: 15900, version: "2.0 SPORT STYLE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2012, km: 118000, price_usd: 16500, version: "2.0 EXCLUSIVE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2012, km: 210000, price_usd: 15000, version: "2.0 SPORT STYLE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2014, km: 196000, price_usd: 14900, version: "2.0 EXCLUSIVE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2013, km: 160000, price_usd: 15500, version: "2.0 EXCLUSIVE TSI", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN ALLSPACE", year: 2019, km: 62000, price_usd: 26800, version: "1.4 TRENDLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2010, km: 129000, price_usd: 15900, version: "2.0 TSI EXCLUSIVE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN ALLSPACE", year: 2018, km: 220000, price_usd: Math.round(27800000 / ARS_TO_USD), version: "1.4T TRENDLINE", url: "mercadolibre.com.ar" }
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

// Filter duplicates based on brand_model + year + km combo
const existingSet = new Set(
    existingData.map(d => `${d.brand_model}-${d.year}-${d.km}`)
);

const newData = TIGUAN_DATA.filter(d => {
    const key = `${d.brand_model}-${d.year}-${d.km}`;
    return !existingSet.has(key);
});

console.log(`Adding ${newData.length} new Tiguan records (${TIGUAN_DATA.length - newData.length} duplicates filtered)`);

// Merge
const consolidated = [...existingData, ...newData];
fs.writeFileSync(dataPath, JSON.stringify(consolidated, null, 2));

console.log(`\nTotal records: ${consolidated.length}`);

// Count Tiguans
const tiguanCount = consolidated.filter(d => d.brand_model.includes('TIGUAN')).length;
console.log(`Total Tiguan records: ${tiguanCount}`);
