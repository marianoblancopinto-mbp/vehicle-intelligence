const fs = require('fs');

// Parsed from MercadoLibre SUV section (extracted via browser_subagent)
// Format: Title, Price (ARS or USD), Year | Km | Location
const MELI_RAW_LISTINGS = [
    // From the extracted text (first page results)
    { title: "Chevrolet Captiva 1.5 Phev Premier Dht", price_ars: 51037207, year: 2026, km: 0 },
    { title: "Chevrolet Captiva 1.5 Phev Premier", price_ars: 49590000, year: 2025, km: 0 },
    { title: "GWM Haval Jolion Pro Hev Supreme", price_usd: 28997, year: 2026, km: 0 },
    { title: "GWM Haval 2.0t 4wd H6", price_usd: 39899, year: 2026, km: 0 },
    { title: "GWM Haval Jolion Pro-deluxe 1.5 Hibrido", price_usd: 25892, year: 2025, km: 0 },
    { title: "Citroën Aircross 1.0 Vti Xtr Cvt", price_ars: 41500000, year: 2026, km: 0 },
    { title: "Volkswagen Nivus 1.0 Tsi 200 Comfortline", price_ars: 37400000, year: 2026, km: 0 },
    { title: "Volkswagen Tera 1.0t 170 Tsi Highline At", price_ars: 40550000, year: 2025, km: 0 },
    { title: "Toyota Sw4 2.8 Tdi Diamante Ii 6at 7as", price_ars: 80000000, year: 2025, km: 0 },
    { title: "Volkswagen Taos 1.4 250 Tsi Comfortline Tiptronic", price_ars: 50390000, year: 2026, km: 0 },
    { title: "Peugeot 2008 1.0t Active", price_ars: 36500000, year: 2024, km: 0 },
    { title: "Volkswagen Nivus 1.0 Tsi 200 Comfortline", price_ars: 34200000, year: 2026, km: 0 },
    { title: "Chery Tiggo 7 Pro 1.5 Comfort Cvt", price_usd: 31900, year: 2026, km: 0 },
    { title: "Volkswagen Tera 1.0t 170 Tsi Highline At", price_ars: 34300000, year: 2026, km: 0 },
    { title: "Honda Cr-v 2.4 4x4 Ex At", price_usd: 9300, year: 2006, km: 253000 },
    { title: "Fiat 600 Hybrid 1.2 E-dct", price_ars: 34890000, year: 2025, km: 0 },
    { title: "Volkswagen T-cross 1.0 200 Tsi Highline Aut", price_ars: 43300000, year: 2026, km: 0 },
    { title: "Hyundai Creta 1.5 Safety Cvt", price_usd: 27500, year: 2026, km: 0 },
    { title: "Peugeot 2008 1.0t Active", price_ars: 24900000, year: 2025, km: 0 },
    { title: "Volkswagen T-cross 1.0 200 Tsi Highline Aut", price_ars: 42800000, year: 2026, km: 0 },
    { title: "Peugeot 2008 1.6 Active", price_ars: 27000000, year: 2025, km: 0 },
    { title: "Volkswagen Nivus 1.0 Tsi 200 Comfortline", price_ars: 35090000, year: 2025, km: 0 },
    { title: "Nissan Kicks 1.6 Exclusive Cvt", price_usd: 20600, year: 2018, km: 52000 },
    { title: "Chevrolet Tracker 1.2t At", price_ars: 29500023, year: 2025, km: 0 },
    { title: "Peugeot 2008 1.0t Gt", price_ars: 36975000, year: 2025, km: 0 },
    { title: "Kia Seltos 1.5 Lx Cvt", price_usd: 26000, year: 2025, km: 0 },
    { title: "Peugeot 2008 1.0t Gt", price_ars: 45381200, year: 2025, km: 0 },
    { title: "Volkswagen Tera 1.0t 170 Tsi Highline At", price_ars: 24900000, year: 2026, km: 0 },
    { title: "Audi Q8 3.0 55 Tfsi Quattro 340cv", price_usd: 158500, year: 2026, km: 0 },
    { title: "Chevrolet Spark Euv Activ", price_ars: 26900000, year: 2025, km: 0 },
    { title: "Peugeot 3008 1.6 Gt Pack 165cv", price_ars: 64500000, year: 2025, km: 0 },
    { title: "Peugeot 2008 E-2008 Gt", price_ars: 58900000, year: 2025, km: 0 },
    { title: "Kia Sorento 2.2 Crdi Ex At 4x2", price_usd: 24500, year: 2018, km: 110000 },
    { title: "Renault Koleos 2.5 4wd Cvt", price_ars: 69989900, year: 2025, km: 0 },
    { title: "Peugeot 2008 1.0t Active", price_ars: 36000000, year: 2025, km: 0 },
    { title: "Chevrolet Trailblazer 2.8 High Country", price_ars: 68300000, year: 2026, km: 0 },
    { title: "Volkswagen T-cross 1.0 200 Tsi Trendline Aut", price_ars: 34000000, year: 2025, km: 0 },
    { title: "Peugeot 2008 1.0t Active", price_ars: 34000000, year: 2025, km: 0 },
    { title: "Fiat Pulse 1.0 Impetus T3 Cvt", price_usd: 15530, year: 2024, km: 0 },
    { title: "Peugeot 2008 1.0t Active", price_ars: 31088100, year: 2025, km: 0 },
    { title: "Renault Arkana 1.3 E-tech Hybrid", price_ars: 40500000, year: 2025, km: 0 },
    { title: "Peugeot 2008 1.0t Active", price_ars: 33500000, year: 2025, km: 0 },
    { title: "Renault Arkana 1.3 E-tech Hybrid Espirit Alpine", price_ars: 42950000, year: 2025, km: 0 },
    { title: "Chery Tiggo 4 Pro 1.5t Luxury Cvt", price_usd: 27000, year: 2025, km: 0 },
    { title: "Peugeot 2008 1.0t Gt", price_ars: 31900000, year: 2024, km: 0 },
    { title: "Peugeot 2008 1.0t Gt", price_ars: 41900000, year: 2024, km: 0 },
    { title: "Volkswagen Nivus 1.0 Tsi 200 Trendline", price_ars: 33000000, year: 2025, km: 0 },
    { title: "Baic Bj30 1.5t 4wd Hybrid", price_usd: 42500, year: 2025, km: 0 },
    { title: "Volkswagen Nivus 1.0 Tsi 200 Trendline", price_ars: 33500000, year: 2025, km: 0 },
    { title: "Peugeot 2008 1.2 Gt", price_ars: 44200000, year: 2025, km: 0 },
];

const ARS_TO_USD = 1495;

function extractBrandModel(title) {
    // Extract brand and model from title
    const words = title.split(' ');
    if (words.length >= 2) {
        return `${words[0].toUpperCase()} ${words[1].toUpperCase()}`;
    }
    return title.toUpperCase();
}

function parseAndAppend() {
    // Load existing data
    let existingData = [];
    try {
        existingData = JSON.parse(fs.readFileSync('data/market_data.json', 'utf8'));
    } catch (e) {
        console.log('No existing data, starting fresh');
    }

    // Convert new listings
    const newData = MELI_RAW_LISTINGS.map(item => {
        let price_usd = item.price_usd || Math.round(item.price_ars / ARS_TO_USD);
        return {
            brand_model: extractBrandModel(item.title),
            year: item.year,
            km: item.km,
            price_usd: price_usd,
            version: item.title,
            url: "https://autos.mercadolibre.com.ar"
        };
    });

    // Combine
    const combined = [...existingData, ...newData];

    fs.writeFileSync('data/market_data.json', JSON.stringify(combined, null, 2));
    console.log(`✅ Added ${newData.length} MercadoLibre listings. Total: ${combined.length} vehicles.`);
}

parseAndAppend();
