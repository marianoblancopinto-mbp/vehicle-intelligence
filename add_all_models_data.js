/**
 * Add all scraped MercadoLibre data for multiple models
 */

const fs = require('fs');
const path = require('path');

const ARS_TO_USD = 1495;

// All scraped data from MercadoLibre
const ALL_NEW_DATA = [
    // ============ TOYOTA SW4 ============
    { brand_model: "TOYOTA SW4", year: 2019, km: 117000, price_usd: 38000, version: "2.8 SRX 177CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2017, km: 190000, price_usd: 38000, version: "2.8 SRX 177CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2022, km: 78352, price_usd: 53000, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2018, km: 133480, price_usd: 40000, version: "2.8 SRX 177CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2020, km: 115000, price_usd: 42000, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2020, km: 68500, price_usd: 46000, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2021, km: 115711, price_usd: 41300, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2006, km: 330000, price_usd: 16500, version: "3.0 SRV CUERO", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2020, km: 79539, price_usd: 45000, version: "2.8 SRX TDI", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2021, km: 106000, price_usd: 41000, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2021, km: 109345, price_usd: 45000, version: "2.8 SRX 177CV MT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2021, km: 19461, price_usd: 69000, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2018, km: 80000, price_usd: 35999, version: "2.8 SRX 204CV MT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2024, km: 80000, price_usd: 47000, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2023, km: 70000, price_usd: 61800, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2019, km: 140000, price_usd: 38000, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2024, km: 10000, price_usd: 58000, version: "2.8 TDI DIAMOND", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2023, km: 88900, price_usd: 50000, version: "2.8 SRX HAR", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2021, km: 198000, price_usd: 40000, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2012, km: 210000, price_usd: 29900, version: "3.0 SRV CUERO", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2024, km: 20000, price_usd: 54900, version: "2.8 TDI DIAMOND", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2022, km: 79000, price_usd: 43900, version: "2.8 SRX 177CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2013, km: 181000, price_usd: 27500, version: "3.0 SRV CUERO", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2021, km: 100000, price_usd: 44700, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2023, km: 35000, price_usd: 51000, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA SW4", year: 2023, km: 29350, price_usd: 49900, version: "2.8 SRX 204CV", url: "mercadolibre.com.ar" },

    // ============ HONDA HR-V ============
    { brand_model: "HONDA HR-V", year: 2018, km: 82000, price_usd: 21900, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2017, km: 112131, price_usd: 21000, version: "EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2017, km: 151315, price_usd: 19000, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2017, km: 125500, price_usd: Math.round(24900000 / ARS_TO_USD), version: "1.8 LX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2017, km: 141000, price_usd: 14900, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2016, km: 110000, price_usd: 17300, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2019, km: 135000, price_usd: 21400, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2016, km: 121000, price_usd: 15900, version: "1.8 LX", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2017, km: 88000, price_usd: 21000, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2016, km: 120000, price_usd: 17800, version: "1.8 LX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2016, km: 115000, price_usd: 20000, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2016, km: 175000, price_usd: 17900, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2015, km: 98000, price_usd: 18500, version: "1.8 LX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2015, km: 135000, price_usd: 17000, version: "1.8 LX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2019, km: 120000, price_usd: 19000, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2019, km: 120000, price_usd: 20500, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2018, km: 33000, price_usd: 25499, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2018, km: 140000, price_usd: 17990, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2019, km: 95000, price_usd: 21900, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2021, km: 76000, price_usd: 26400, version: "1.8 LX CVT L20", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2018, km: 141000, price_usd: 18500, version: "1.8 LX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2020, km: 66000, price_usd: 24000, version: "1.8 LX CVT L20", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2017, km: 108000, price_usd: 19500, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2022, km: 60000, price_usd: 28500, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2022, km: 42000, price_usd: 27900, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2016, km: 148684, price_usd: 19000, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2018, km: 151800, price_usd: 20500, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2017, km: 189000, price_usd: 18500, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2016, km: 102000, price_usd: 19000, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2018, km: 135000, price_usd: 20500, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2020, km: 109000, price_usd: 23000, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2017, km: 143000, price_usd: 16999, version: "1.8 EX-L CVT", url: "mercadolibre.com.ar" },
    { brand_model: "HONDA HR-V", year: 2017, km: 106000, price_usd: 17900, version: "1.8 EX CVT", url: "mercadolibre.com.ar" },

    // ============ NISSAN KICKS ============
    { brand_model: "NISSAN KICKS", year: 2018, km: 52000, price_usd: 20600, version: "1.6 EXCLUSIVE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2020, km: 81000, price_usd: 19200, version: "1.6 EXCLUSIVE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2021, km: 53000, price_usd: 20400, version: "1.6 ADVANCE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 94754, price_usd: Math.round(23000000 / ARS_TO_USD), version: "1.6 ADVANCE", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2022, km: 54000, price_usd: Math.round(27400000 / ARS_TO_USD), version: "1.6 SENSE", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2023, km: 44000, price_usd: 24000, version: "1.6 EXCLUSIVE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2017, km: 101055, price_usd: Math.round(22000000 / ARS_TO_USD), version: "1.6 ADVANCE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2021, km: 78000, price_usd: 23000, version: "1.6 EXCLUSIVE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2020, km: 69000, price_usd: 17000, version: "1.6 SENSE", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 85000, price_usd: 18500, version: "1.6 ADVANCE", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2018, km: 92000, price_usd: 17800, version: "1.6 ADVANCE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2022, km: 38000, price_usd: 21500, version: "1.6 EXCLUSIVE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2020, km: 65000, price_usd: 19000, version: "1.6 ADVANCE CVT", url: "mercadolibre.com.ar" },
    { brand_model: "NISSAN KICKS", year: 2019, km: 110000, price_usd: 16500, version: "1.6 SENSE", url: "mercadolibre.com.ar" },

    // ============ HYUNDAI TUCSON ============
    { brand_model: "HYUNDAI TUCSON", year: 2019, km: 62000, price_usd: 27700, version: "1.6 TGDI TCT", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2018, km: 41700, price_usd: 26500, version: "2.0 STYLE 2WD AT", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2017, km: 59000, price_usd: 22800, version: "2.0 16V", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2016, km: 95000, price_usd: 22000, version: "2.0 GL 6AT", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2015, km: 75000, price_usd: 14500, version: "2.0 GL 6AT", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2013, km: 120000, price_usd: 14500, version: "2.0 GLS PREMIUM", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2012, km: 145000, price_usd: 14000, version: "2.0 GL 5MT", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2011, km: 156907, price_usd: 12000, version: "2.0 GL 5MT", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2010, km: 144000, price_usd: 7800, version: "2.0 CRDI", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2018, km: 85000, price_usd: 24000, version: "2.0 STYLE", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2017, km: 98000, price_usd: 21000, version: "2.0 GL AT", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2019, km: 78000, price_usd: 25500, version: "2.0 PREMIUM", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2016, km: 125000, price_usd: 18500, version: "2.0 GL 6AT", url: "mercadolibre.com.ar" },
    { brand_model: "HYUNDAI TUCSON", year: 2014, km: 110000, price_usd: 16000, version: "2.0 GL", url: "mercadolibre.com.ar" },

    // ============ VW TAOS ============
    { brand_model: "VOLKSWAGEN TAOS", year: 2024, km: 24000, price_usd: 34000, version: "1.4 HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2023, km: 26000, price_usd: 28500, version: "1.4 HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2021, km: 56000, price_usd: 27000, version: "1.4 COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2022, km: 51000, price_usd: Math.round(36999999 / ARS_TO_USD), version: "1.4 COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2023, km: 62000, price_usd: Math.round(36900000 / ARS_TO_USD), version: "1.4 COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2022, km: 49000, price_usd: Math.round(35900000 / ARS_TO_USD), version: "1.4 COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2021, km: 67000, price_usd: 30500, version: "1.4 HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2021, km: 92000, price_usd: Math.round(38500000 / ARS_TO_USD), version: "1.4 HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2021, km: 77000, price_usd: Math.round(33000000 / ARS_TO_USD), version: "1.4 HERO", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2021, km: 105000, price_usd: 26000, version: "1.4 HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2022, km: 80000, price_usd: 25500, version: "1.4 COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2022, km: 59500, price_usd: 28900, version: "1.4 COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2021, km: 59000, price_usd: 25000, version: "1.4 COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2022, km: 72000, price_usd: 28500, version: "1.4 HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN TAOS", year: 2022, km: 126000, price_usd: Math.round(36750000 / ARS_TO_USD), version: "1.4 HIGHLINE", url: "mercadolibre.com.ar" },

    // ============ VW NIVUS ============
    { brand_model: "VOLKSWAGEN NIVUS", year: 2022, km: 50000, price_usd: 21600, version: "1.0 TSI COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2021, km: 73000, price_usd: 20900, version: "1.0 TSI HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2021, km: 42000, price_usd: 21500, version: "1.0 TSI HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2023, km: 97000, price_usd: Math.round(27500000 / ARS_TO_USD), version: "1.0 TSI 170 MT", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2021, km: 140000, price_usd: Math.round(26500000 / ARS_TO_USD), version: "1.0 TSI HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2021, km: 67900, price_usd: 19000, version: "1.0 TSI COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2020, km: 59500, price_usd: 19500, version: "1.0 TSI COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2022, km: 55000, price_usd: 20500, version: "1.0 TSI COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2021, km: 85000, price_usd: 18500, version: "1.0 TSI COMFORTLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2022, km: 68000, price_usd: 19800, version: "1.0 TSI HIGHLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2021, km: 92000, price_usd: 17500, version: "1.0 TSI TRENDLINE", url: "mercadolibre.com.ar" },
    { brand_model: "VOLKSWAGEN NIVUS", year: 2023, km: 45000, price_usd: 22500, version: "1.0 TSI HIGHLINE", url: "mercadolibre.com.ar" },

    // ============ TOYOTA COROLLA CROSS ============
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 77500, price_usd: Math.round(35900000 / ARS_TO_USD), version: "2.0 XLI CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 12600, price_usd: 31900, version: "1.8 SEG ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 45000, price_usd: Math.round(48000000 / ARS_TO_USD), version: "2.0 SEG CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 50000, price_usd: 30000, version: "2.0 SEG CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 42000, price_usd: Math.round(43700000 / ARS_TO_USD), version: "2.0 SEG CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 70000, price_usd: Math.round(37900000 / ARS_TO_USD), version: "2.0 XLI CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 40576, price_usd: Math.round(43399000 / ARS_TO_USD), version: "2.0 SEG CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 77800, price_usd: Math.round(39900000 / ARS_TO_USD), version: "1.8 XEI ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 63000, price_usd: Math.round(43000000 / ARS_TO_USD), version: "1.8 XEI ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 43000, price_usd: 34000, version: "2.0 XEI CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 86000, price_usd: Math.round(43000000 / ARS_TO_USD), version: "2.0 SEG CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 39879, price_usd: Math.round(45000000 / ARS_TO_USD), version: "2.0 SEG CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 59000, price_usd: Math.round(50000000 / ARS_TO_USD), version: "1.8 SEG ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 42900, price_usd: 30000, version: "1.8 SEG ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 65260, price_usd: Math.round(39266000 / ARS_TO_USD), version: "1.8 SEG HEV", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 25000, price_usd: 30000, version: "1.8 XEI ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 79000, price_usd: 26900, version: "1.8 XEI ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 49600, price_usd: Math.round(42150000 / ARS_TO_USD), version: "2.0 SEG CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 34000, price_usd: 28900, version: "2.0 XEI CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 64000, price_usd: 27500, version: "2.0 XEI CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 51000, price_usd: 32500, version: "1.8 XEI ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 48000, price_usd: 26000, version: "2.0 SEG CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 45300, price_usd: 31100, version: "1.8 SEG ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 56000, price_usd: 32500, version: "1.8 SEG ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 44000, price_usd: Math.round(42000000 / ARS_TO_USD), version: "2.0 XEI CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 22000, price_usd: 34500, version: "1.8 SEG ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 86000, price_usd: 29000, version: "1.8 XEI ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2021, km: 49500, price_usd: 30500, version: "1.8 SEG ECVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 39400, price_usd: 32000, version: "2.0 GR-SPORT CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 30000, price_usd: 28000, version: "2.0 XLI CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2023, km: 18000, price_usd: 31000, version: "2.0 SEG CVT", url: "mercadolibre.com.ar" },
    { brand_model: "TOYOTA COROLLA CROSS", year: 2022, km: 44000, price_usd: 30000, version: "2.0 SEG CVT", url: "mercadolibre.com.ar" },

    // ============ RENAULT KARDIAN ============
    { brand_model: "RENAULT KARDIAN", year: 2024, km: 9200, price_usd: 19700, version: "1.0 TCE EVOLUTION", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT KARDIAN", year: 2024, km: 800, price_usd: 20500, version: "1.6 SCE EVOLUTION", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT KARDIAN", year: 2024, km: 38000, price_usd: Math.round(28990000 / ARS_TO_USD), version: "1.0 TCE TECHNO", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT KARDIAN", year: 2024, km: 12000, price_usd: Math.round(32800000 / ARS_TO_USD), version: "1.0 TCE PREMIERE", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT KARDIAN", year: 2024, km: 1000, price_usd: 24700, version: "1.0 TCE PREMIERE", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT KARDIAN", year: 2025, km: 5000, price_usd: Math.round(35900000 / ARS_TO_USD), version: "1.0 TCE TECHNO", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT KARDIAN", year: 2025, km: 7200, price_usd: Math.round(34900000 / ARS_TO_USD), version: "1.0 TCE TECHNO", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT KARDIAN", year: 2025, km: 1000, price_usd: Math.round(31500000 / ARS_TO_USD), version: "1.0 TCE EVOLUTION", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT KARDIAN", year: 2025, km: 1000, price_usd: Math.round(24390000 / ARS_TO_USD), version: "1.6 SCE EVOLUTION", url: "mercadolibre.com.ar" },
    { brand_model: "RENAULT KARDIAN", year: 2025, km: 1150, price_usd: Math.round(40650000 / ARS_TO_USD), version: "1.0 TCE ICONIC", url: "mercadolibre.com.ar" },
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

const newData = ALL_NEW_DATA.filter(d => {
    const key = `${d.brand_model}-${d.year}-${d.km}`;
    return !existingSet.has(key);
});

console.log(`Adding ${newData.length} new records (${ALL_NEW_DATA.length - newData.length} duplicates filtered)`);

// Merge and save
const consolidated = [...existingData, ...newData];
fs.writeFileSync(dataPath, JSON.stringify(consolidated, null, 2));

console.log(`\n✅ Total records: ${consolidated.length}`);

// Count by model
const counts = {};
consolidated.forEach(d => {
    counts[d.brand_model] = (counts[d.brand_model] || 0) + 1;
});

console.log('\n📊 Records per model:');
Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([model, count]) => {
        console.log(`  ${model}: ${count}`);
    });
