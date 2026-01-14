const fs = require('fs');
const path = require('path');

// Exchange rate ARS to USD (as of January 2026)
const ARS_TO_USD_RATE = 1495;

// New scraped data from MercadoLibre (January 2026)
// All data comes from real listings, NO 0km vehicles

const newData = [
    // ========== PEUGEOT 5008 ==========
    { brand_model: "PEUGEOT 5008", year: 2019, km: 58000, price_usd: 29500, version: "2.0 ALLURE PLUS HDI", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2021, km: 25000, price_usd: 35000, version: "2.0 ALLURE PLUS HDI", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2013, km: 86500, price_usd: Math.round(14500000 / ARS_TO_USD_RATE), version: "1.6 ALLURE 156CV", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2018, km: 138000, price_usd: 24000, version: "1.6 ALLURE", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2013, km: 160000, price_usd: Math.round(14900000 / ARS_TO_USD_RATE), version: "1.6 ALLURE PLUS 156CV", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2019, km: 123200, price_usd: 19990, version: "1.6 ALLURE THP", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2021, km: 59000, price_usd: 30000, version: "1.6 FELINE HDI", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2018, km: 80000, price_usd: 20900, version: "1.6 ALLURE", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2018, km: 107000, price_usd: 22000, version: "2.0 ALLURE PLUS HDI", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2023, km: 40000, price_usd: 35900, version: "2.0 ALLURE PLUS HDI", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2020, km: 50000, price_usd: 27500, version: "2.0 ALLURE PLUS HDI", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2024, km: 5500, price_usd: 46000, version: "1.6 GT PACK THP 165CV", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2018, km: 82000, price_usd: Math.round(34489900 / ARS_TO_USD_RATE), version: "2.0 ALLURE PLUS HDI", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2019, km: 79500, price_usd: Math.round(31500000 / ARS_TO_USD_RATE), version: "1.6 ALLURE PLUS THP", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2014, km: 160000, price_usd: Math.round(13000000 / ARS_TO_USD_RATE), version: "1.6 ALLURE 156CV", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2017, km: 100000, price_usd: 16200, version: "1.6 ALLURE THP", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2019, km: 102000, price_usd: 25000, version: "2.0 ALLURE PLUS HDI", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2021, km: 81760, price_usd: Math.round(39800000 / ARS_TO_USD_RATE), version: "2.0 ALLURE PLUS HDI", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2017, km: 126000, price_usd: Math.round(20000000 / ARS_TO_USD_RATE), version: "1.6 FELINE", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "PEUGEOT 5008", year: 2014, km: 132000, price_usd: 9500, version: "1.6 ALLURE PLUS 156CV", url: "https://autos.mercadolibre.com.ar" },

    // ========== VOLKSWAGEN TIGUAN HIGHLINE (Note: Most are TIGUAN ALLSPACE HIGHLINE) ==========
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 152000, price_usd: 29500, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 138500, price_usd: 29000, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 92500, price_usd: 30500, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 108000, price_usd: 33000, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 75660, price_usd: 33000, version: "2.0 TSI HIGHLINE 4MOTION", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 75700, price_usd: 33000, version: "2.0 TSI HIGHLINE 4MOTION", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 63000, price_usd: 36500, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 97000, price_usd: 31500, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2021, km: 64800, price_usd: 41500, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 90000, price_usd: 36500, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 140000, price_usd: 31000, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 94000, price_usd: 29300, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 70000, price_usd: 36600, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2021, km: 70000, price_usd: 40000, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 136000, price_usd: 28500, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 120000, price_usd: 29500, version: "2.0 TSI HIGHLINE DSG", url: "https://autos.mercadolibre.com.ar" },

    // ========== VOLKSWAGEN TIGUAN TRENDLINE ==========
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 165800, price_usd: Math.round(26000000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 129000, price_usd: Math.round(35000000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 88909, price_usd: 25000, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 109000, price_usd: 23500, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 134000, price_usd: Math.round(31800000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 90000, price_usd: 23800, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 113200, price_usd: 24000, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 150000, price_usd: 25450, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 179000, price_usd: Math.round(30200000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 127000, price_usd: Math.round(28400000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 118000, price_usd: Math.round(27900000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2020, km: 91000, price_usd: 25000, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2020, km: 115000, price_usd: Math.round(34500000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2022, km: 110000, price_usd: 27900, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 143000, price_usd: Math.round(30000000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 71000, price_usd: Math.round(36000000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 118000, price_usd: 26500, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 130000, price_usd: 19800, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 164000, price_usd: 21500, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 184000, price_usd: 19900, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 100000, price_usd: Math.round(30900000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 120000, price_usd: 23400, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2019, km: 88000, price_usd: 22999, version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TIGUAN", year: 2018, km: 126000, price_usd: Math.round(31500000 / ARS_TO_USD_RATE), version: "1.4 TSI TRENDLINE DSG", url: "https://autos.mercadolibre.com.ar" },

    // ========== TOYOTA COROLLA CROSS SEG HYBRID ==========
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 84000, price_usd: Math.round(45000000 / ARS_TO_USD_RATE), version: "1.8 SEG HYBRID ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 42900, price_usd: 30000, version: "1.8 SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 32000, price_usd: 33000, version: "1.8 SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 12600, price_usd: 31900, version: "1.8 SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 45300, price_usd: 31100, version: "1.8 SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 22000, price_usd: 34500, version: "1.8 SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 49500, price_usd: 30500, version: "1.8 SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2025, km: 14791, price_usd: 38500, version: "1.8 HEV SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2025, km: 8300, price_usd: 37000, version: "1.8 HEV SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 23900, price_usd: Math.round(48000000 / ARS_TO_USD_RATE), version: "1.8 SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 36000, price_usd: 34000, version: "1.8 SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 53000, price_usd: 28900, version: "1.8 SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2024, km: 9000, price_usd: 38000, version: "1.8 HEV SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2024, km: 15583, price_usd: 34000, version: "1.8 HEV SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2024, km: 12600, price_usd: Math.round(47850000 / ARS_TO_USD_RATE), version: "1.8 HEV SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2025, km: 7500, price_usd: Math.round(54500000 / ARS_TO_USD_RATE), version: "1.8 HEV SEG ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2025, km: 2000, price_usd: Math.round(49900000 / ARS_TO_USD_RATE), version: "1.8 HEV SEG ECVT", url: "https://autos.mercadolibre.com.ar" },

    // ========== TOYOTA COROLLA CROSS XEI HYBRID ==========
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 86000, price_usd: 29000, version: "1.8 XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2025, km: 30000, price_usd: Math.round(47800000 / ARS_TO_USD_RATE), version: "1.8 HEV XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2024, km: 1000, price_usd: Math.round(49500000 / ARS_TO_USD_RATE), version: "1.8 HEV XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2024, km: 18000, price_usd: 31000, version: "1.8 HEV XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2024, km: 28500, price_usd: Math.round(49000000 / ARS_TO_USD_RATE), version: "1.8 HEV XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2025, km: 1111, price_usd: 39000, version: "1.8 HEV XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 37000, price_usd: Math.round(42000000 / ARS_TO_USD_RATE), version: "1.8 XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 22500, price_usd: 29799, version: "1.8 XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 22990, price_usd: 29990, version: "1.8 XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 58000, price_usd: 28500, version: "1.8 XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 22500, price_usd: 31000, version: "1.8 XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 31000, price_usd: 28500, version: "1.8 XEI ECVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 77800, price_usd: Math.round(39900000 / ARS_TO_USD_RATE), version: "1.8 XEI ECVT", url: "https://autos.mercadolibre.com.ar" },

    // ========== NISSAN KICKS ADVANCE ==========
    { brand_model: "NISSAN KICKS", year: 2017, km: 107000, price_usd: 16200, version: "1.6 ADVANCE 120CV AT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2021, km: 53000, price_usd: 20400, version: "1.6 ADVANCE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2017, km: 137000, price_usd: 16500, version: "1.6 ADVANCE AT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2021, km: 112000, price_usd: Math.round(27500000 / ARS_TO_USD_RATE), version: "1.6 ADVANCE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2018, km: 114141, price_usd: Math.round(20000000 / ARS_TO_USD_RATE), version: "1.6 ADVANCE", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 94754, price_usd: Math.round(23000000 / ARS_TO_USD_RATE), version: "1.6 ADVANCE", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2021, km: 132500, price_usd: 18800, version: "1.6 ADVANCE CVT PLUS", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2022, km: 56000, price_usd: Math.round(32000000 / ARS_TO_USD_RATE), version: "1.6 ADVANCE", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2018, km: 89000, price_usd: Math.round(24489900 / ARS_TO_USD_RATE), version: "1.6 ADVANCE AT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2021, km: 113000, price_usd: Math.round(26500000 / ARS_TO_USD_RATE), version: "1.6 ADVANCE CVT PLUS", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 101800, price_usd: Math.round(24000000 / ARS_TO_USD_RATE), version: "1.6 ADVANCE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2018, km: 93000, price_usd: Math.round(24489900 / ARS_TO_USD_RATE), version: "1.6 ADVANCE AT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2017, km: 101055, price_usd: Math.round(22000000 / ARS_TO_USD_RATE), version: "1.6 ADVANCE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2018, km: 89000, price_usd: 17500, version: "1.6 ADVANCE AT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 27000, price_usd: Math.round(27000000 / ARS_TO_USD_RATE), version: "1.6 ADVANCE", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2022, km: 74000, price_usd: Math.round(29989900 / ARS_TO_USD_RATE), version: "1.6 ADVANCE CVT 120CV", url: "https://autos.mercadolibre.com.ar" },

    // ========== NISSAN KICKS EXCLUSIVE ==========
    { brand_model: "NISSAN KICKS", year: 2020, km: 150000, price_usd: Math.round(25000000 / ARS_TO_USD_RATE), version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2017, km: 90000, price_usd: 18900, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2021, km: 52000, price_usd: 23500, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2017, km: 144000, price_usd: 16800, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2020, km: 90000, price_usd: Math.round(27500000 / ARS_TO_USD_RATE), version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 84000, price_usd: Math.round(24900000 / ARS_TO_USD_RATE), version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2018, km: 74000, price_usd: 17900, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 63400, price_usd: 19500, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 98200, price_usd: 18000, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2018, km: 70000, price_usd: Math.round(25900000 / ARS_TO_USD_RATE), version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2018, km: 114000, price_usd: 16500, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2017, km: 72000, price_usd: 19500, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 57000, price_usd: 18500, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2021, km: 78000, price_usd: 23000, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2018, km: 31000, price_usd: 18500, version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2022, km: 88600, price_usd: Math.round(31500000 / ARS_TO_USD_RATE), version: "1.6 EXCLUSIVE CVT", url: "https://autos.mercadolibre.com.ar" },
];

// Load existing data
const marketDataPath = path.join(__dirname, 'data', 'market_data.json');
let existingData = [];

try {
    existingData = JSON.parse(fs.readFileSync(marketDataPath, 'utf-8'));
    console.log(`Loaded ${existingData.length} existing records`);
} catch (e) {
    console.error('Error loading market_data.json:', e.message);
    process.exit(1);
}

// Create a key for deduplication
const createKey = (item) => `${item.brand_model}|${item.year}|${item.km}|${item.price_usd}`;

// Create set of existing keys
const existingKeys = new Set(existingData.map(createKey));

// Filter new data to avoid duplicates
const uniqueNewData = newData.filter(item => {
    const key = createKey(item);
    if (existingKeys.has(key)) {
        console.log(`Skipping duplicate: ${item.brand_model} ${item.year} ${item.km}km $${item.price_usd}`);
        return false;
    }
    return true;
});

console.log(`\nAdding ${uniqueNewData.length} new unique records`);
console.log(`Skipped ${newData.length - uniqueNewData.length} duplicates`);

// Combine and save
const combinedData = [...existingData, ...uniqueNewData];

fs.writeFileSync(marketDataPath, JSON.stringify(combinedData, null, 2));

console.log(`\nTotal records now: ${combinedData.length}`);
console.log('Market data updated successfully!');

// Print summary by model
const summary = {};
uniqueNewData.forEach(item => {
    const model = item.brand_model;
    summary[model] = (summary[model] || 0) + 1;
});

console.log('\nNew records by model:');
Object.entries(summary).sort((a, b) => b[1] - a[1]).forEach(([model, count]) => {
    console.log(`  ${model}: +${count}`);
});
