/**
 * Add Kia Sorento data from MercadoLibre
 */

const fs = require('fs');
const path = require('path');

const ARS_TO_USD = 1495;

const SORENTO_DATA = [
    // Page 1
    { brand_model: "KIA SORENTO", year: 2018, km: 110000, price_usd: 24500, version: "2.2 CRDI EX AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2011, km: 220000, price_usd: Math.round(19000000 / ARS_TO_USD), version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2014, km: 185000, price_usd: 14850, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 240000, price_usd: 12900, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2014, km: 197000, price_usd: Math.round(19500000 / ARS_TO_USD), version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2006, km: 141000, price_usd: 10500, version: "3.5 EXCLUSIVE 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 175000, price_usd: 21000, version: "2.4 EX FULL AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 130000, price_usd: 26000, version: "2.2 CRDI EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2009, km: 267000, price_usd: 10500, version: "2.5 CRDI MT", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2007, km: 186000, price_usd: 11000, version: "2.5 EX 4X4 AT", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 200000, price_usd: Math.round(39000000 / ARS_TO_USD), version: "2.2 CRDI EX AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2011, km: 250000, price_usd: 11500, version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2012, km: 194000, price_usd: 13200, version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2008, km: 198000, price_usd: 9000, version: "3.3 LX V6 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 173000, price_usd: 17990, version: "2.2 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 203000, price_usd: 12500, version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2012, km: 120000, price_usd: 16500, version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 90000, price_usd: 34500, version: "2.2 CRDI EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2016, km: 141000, price_usd: 27000, version: "2.2 EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2014, km: 133000, price_usd: 20900, version: "2.2 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 225000, price_usd: 22000, version: "2.2 CRDI EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 187300, price_usd: Math.round(21000000 / ARS_TO_USD), version: "2.4 EX FULL 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2014, km: 203000, price_usd: 20900, version: "2.2 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 109113, price_usd: Math.round(45000000 / ARS_TO_USD), version: "2.2 CRDI GT-LINE", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2008, km: 220000, price_usd: 11900, version: "3.8 EX 4X4 AT", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2016, km: 102000, price_usd: 30000, version: "2.2 CRDI 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 110000, price_usd: 25000, version: "2.2 CRDI EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 99600, price_usd: 27500, version: "2.4 EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2011, km: 221000, price_usd: 12500, version: "2.4 EX FULL 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2005, km: 308000, price_usd: 8500, version: "3.5 EX AT", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 140000, price_usd: 15000, version: "2.4 EX FULL 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2014, km: 190000, price_usd: 22500, version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2016, km: 91000, price_usd: 28400, version: "2.2 EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2019, km: 105000, price_usd: 27000, version: "2.2 CRDI EX AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 70000, price_usd: 23900, version: "2.4 EX FULL AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2011, km: 190000, price_usd: 17500, version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 86000, price_usd: 26900, version: "2.4 EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2012, km: 123000, price_usd: 15800, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 340000, price_usd: 16400, version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 200000, price_usd: 12000, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2015, km: 93000, price_usd: 16000, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 110000, price_usd: 23500, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 157000, price_usd: 14890, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 170000, price_usd: 14900, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2011, km: 209000, price_usd: 15000, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 120000, price_usd: 27900, version: "2.4 EX AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 126300, price_usd: Math.round(38000000 / ARS_TO_USD), version: "2.2 EX AT 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2012, km: 222222, price_usd: 15500, version: "2.4 EX FULL 4X2", url: "mercadolibre.com.ar" },

    // Page 2
    { brand_model: "KIA SORENTO", year: 2019, km: 83000, price_usd: 32000, version: "2.2 CRDI EX AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 173000, price_usd: 15000, version: "EX 2.4L 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2010, km: 165000, price_usd: 15000, version: "2.2 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 69000, price_usd: Math.round(42300000 / ARS_TO_USD), version: "2.2 CRDI EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 98000, price_usd: 29900, version: "2.2 CRDI EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2011, km: 250000, price_usd: Math.round(23000000 / ARS_TO_USD), version: "2.2 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 56000, price_usd: 29800, version: "2.4 EX AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 118000, price_usd: Math.round(31000000 / ARS_TO_USD), version: "2.4 EX FULL AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2011, km: 198000, price_usd: 17500, version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2010, km: 267000, price_usd: 14500, version: "2.2 CRDI 6AT", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2011, km: 230000, price_usd: Math.round(17000000 / ARS_TO_USD), version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 101000, price_usd: 29990, version: "2.2 CRDI EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2016, km: 167400, price_usd: 24400, version: "2.2 EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 132000, price_usd: 33400, version: "2.2 CRDI EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2012, km: 225000, price_usd: 14500, version: "2.4 EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2006, km: 167000, price_usd: 8150, version: "3.5 EX 4X4 AT", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2011, km: 259000, price_usd: 13900, version: "2.2 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2010, km: 173500, price_usd: 14900, version: "2.4 EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2012, km: 255400, price_usd: 12000, version: "2.4 EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2009, km: 190000, price_usd: Math.round(15500000 / ARS_TO_USD), version: "2.5 CRDI EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2008, km: 337500, price_usd: Math.round(13000000 / ARS_TO_USD), version: "2.5 CRDI EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2010, km: 220000, price_usd: 18500, version: "2.2 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2019, km: 90000, price_usd: 31000, version: "2.2 EX AT 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 136000, price_usd: 23800, version: "2.4 EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2005, km: 204500, price_usd: 9800, version: "2.5 EX CRDI", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 217000, price_usd: 20000, version: "2.2 CRDI EX AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2011, km: 310000, price_usd: 11500, version: "2.2 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 147000, price_usd: 28000, version: "2.2 CRDI EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2016, km: 110000, price_usd: 24990, version: "2.2 EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2008, km: 198000, price_usd: 11000, version: "2.5 CRDI EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 110000, price_usd: 23999, version: "2.4 EX AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2012, km: 93000, price_usd: 16000, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2009, km: 188000, price_usd: 10000, version: "2.5 CRDI EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 115000, price_usd: 14900, version: "2.4 EX FULL 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 370000, price_usd: Math.round(16500000 / ARS_TO_USD), version: "2.4 EX FULL 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 126500, price_usd: 30900, version: "2.2 CRDI EX 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2016, km: 134000, price_usd: 28500, version: "2.2 EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 100000, price_usd: 21900, version: "2.4 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2004, km: 290000, price_usd: 8000, version: "2.5 EX CRDI", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2014, km: 172000, price_usd: 18900, version: "2.2 EX PREMIUM 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2013, km: 150000, price_usd: 16000, version: "2.4 EX 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 125000, price_usd: 28000, version: "2.2 CRDI EX AT 4X4", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2010, km: 260000, price_usd: Math.round(12500000 / ARS_TO_USD), version: "2.5 CRDI MT", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2018, km: 101000, price_usd: Math.round(40000000 / ARS_TO_USD), version: "2.2 CRDI EX AT 4X2", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2017, km: 74000, price_usd: 32000, version: "2.2 CRDI EX", url: "mercadolibre.com.ar" },
    { brand_model: "KIA SORENTO", year: 2008, km: 297000, price_usd: Math.round(19910400 / ARS_TO_USD), version: "2.5 CRDI EX 4X4", url: "mercadolibre.com.ar" },
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

const newData = SORENTO_DATA.filter(d => {
    const key = `${d.brand_model}-${d.year}-${d.km}`;
    return !existingSet.has(key);
});

console.log(`Adding ${newData.length} new Sorento records (${SORENTO_DATA.length - newData.length} duplicates filtered)`);

// Merge and save
const consolidated = [...existingData, ...newData];
fs.writeFileSync(dataPath, JSON.stringify(consolidated, null, 2));

console.log(`\n✅ Total records: ${consolidated.length}`);

// Count Sorentos
const sorentoCount = consolidated.filter(d => d.brand_model.includes('SORENTO')).length;
console.log(`Total Sorento records: ${sorentoCount}`);
