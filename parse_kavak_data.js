const fs = require('fs');

// Combined dataset: Original 60 + New 60 = 120 vehicles
const RAW_DATA = `Marca	Modelo	Año	Kilometraje	Transmisión	Spec (Versión Específica)	Precio
Renault	Duster	2019	59.900 km	Manual	1.6 PRIVILEGE	$21.360.000
Chevrolet	Tracker	2018	29.500 km	Manual	1.8 PREMIER MT	$24.520.000
Jeep	Renegade	2019	45.000 km	Automático	1.8 SPORT AUTO MY19	$27.080.000
Fiat	Pulse	2024	13.000 km	Automático	1.0 T200 AUDACE CVT	$33.470.000
Fiat	Fastback	2024	4.300 km	Automático	1.3 T270 AUTO	$37.260.000
Jeep	Renegade	2020	82.000 km	Automático	1.8 LONGITUDE AUTO MY20	$30.100.000
Ford	EcoSport	2013	105.000 km	Manual	1.6L SE	$15.660.000
Toyota	Corolla Cross	2025	7.000 km	Automático	2.0 SEG CVT	$53.320.000
Honda	HR-V	2021	71.000 km	Automático	1.8 EX CVT	$36.520.000
Renault	Duster	2014	71.000 km	Manual	1.6 16V CONFORT PLUS	$16.780.000
Jeep	Renegade	2018	68.955 km	Manual	1.8 SPORT	$24.770.000
Ford	EcoSport	2018	57.273 km	Manual	1.5 S	$19.780.000
Nissan	Kicks	2020	25.149 km	Automático	1.6 ADVANCE CVT MY20	$29.840.000
Jeep	Renegade	2018	98.135 km	Manual	1.8 SPORT MY18	$23.300.000
Ford	Territory	2024	28.000 km	Automático	1.8 ECOBOOST TITANIUM AUTO	$46.780.000
Honda	HR-V	2019	77.473 km	Automático	1.8 EX CVT	$30.620.000
Ford	EcoSport	2014	115.000 km	Manual	1.6L TITANIUM	$15.630.000
Renault	Duster	2013	128.347 km	Manual	2.0 16V LUXE NAV	$13.160.000
Chevrolet	Tracker	2023	39.330 km	Automático	1.2 TURBO AT	$27.740.000
Honda	HR-V	2020	74.000 km	Automático	1.8 EX L CVT	$32.510.000
Jeep	Renegade	2021	37.408 km	Automático	1.8 LONGITUDE AUTO MY21	$29.900.000
Toyota	SW4	2021	80.346 km	Manual	2.8 TDI SRX 4WD	$55.040.000
Ford	EcoSport	2010	157.871 km	Manual	1.4 TD XLS MP3	$8.990.000
Chevrolet	Tracker	2024	12.368 km	Automático	1.2 TURBO AT MY24	$29.290.000
Citroen	C3 Aircross	2024	10.000 km	Manual	1.6 FEEL PACK	$24.380.000
Ford	Territory	2025	10.800 km	Automático	1.8 ECOBOOST TITANIUM AUTO	$49.060.000
Chevrolet	Tracker	2015	112.523 km	Automático	1.8 LTZ + AT 4X4	$16.850.000
Jeep	Renegade	2020	35.004 km	Automático	1.8 LONGITUDE AUTO MY20	$27.900.000
Jeep	Renegade	2019	60.596 km	Manual	1.8 SPORT	$23.610.000
Ford	EcoSport	2015	91.556 km	Manual	2.0L FREESTYLE 4WD	$17.230.000
Renault	Duster	2017	19.598 km	Manual	1.6 DYNAMIQUE	$18.990.000
Renault	Duster	2014	123.645 km	Manual	2.0 16V LUXE NAV	$13.940.000
Jeep	Compass	2020	53.688 km	Automático	2.4 LONGITUDE AUTO FWD MY20	$32.120.000
Renault	Kardian	2025	11.000 km	Automático	1.0 TCE TECHNO AUTO	$31.270.000
Jeep	Compass	2019	76.713 km	Automático	2.4 LONGITUDE AUTO 4WD MY18	$29.970.000
Jeep	Compass	2020	41.323 km	Automático	2.4 LONGITUDE AUTO FWD MY20	$32.470.000
Jeep	Compass	2022	52.426 km	Automático	1.3 T270 SPORT AUTO	$33.430.000
Chevrolet	Tracker	2021	47.649 km	Automático	1.2 TURBO AT	$25.570.000
Hyundai	Tucson	2018	107.026 km	Manual	2.0 STYLE	$29.250.000
Renault	Duster	2013	72.693 km	Manual	1.6 16V CONFORT PLUS	$13.090.000
Hyundai	Tucson	2018	105.349 km	Automático	2.0 2WD PANORAMA AUTO	$29.230.000
Suzuki	Grand Vitara	2011	120.232 km	Manual	2.4 JLX-L MT 4WD	$20.590.000
Ford	EcoSport	2016	96.222 km	Manual	1.6L SE	$18.685.000
Ford	EcoSport	2012	156.317 km	Manual	1.6 XLS	$10.030.000
Peugeot	3008	2024	14.000 km	Automático	1.6 THP GT PACK TIPTRONIC	$47.140.000
Ford	EcoSport	2013	176.461 km	Manual	1.6L SE	$10.530.000
Nissan	Kicks	2020	99.000 km	Automático	1.6 EXCLUSIVE CVT MY20	$23.920.000
Jeep	Compass	2025	10.197 km	Automático	1.3 T270 SERIE S AUTO	$48.460.000
Jeep	Compass	2017	97.158 km	Automático	2.4 LONGITUDE AUTO 4WD	$28.960.000
Renault	Captur	2018	94.250 km	Manual	1.6 LIFE	$16.880.000
Jeep	Renegade	2018	84.733 km	Automático	1.8 LONGITUDE AUTO	$21.590.000
Chery	Tiggo	2013	99.200 km	Manual	2.0 LUXURY 4X4 MT	$11.390.000
Ford	EcoSport	2012	185.041 km	Manual	2.0 XLT PLUS 4X4	$9.790.000
Chevrolet	Equinox	2023	38.309 km	Automático	1.5T PREMIER AUTO 4WD	$39.850.000
Jeep	Renegade	2016	99.240 km	Manual	1.8 SPORT	$18.000.000
Renault	Duster	2014	132.266 km	Manual	1.6 TECH ROAD	$12.600.000
Volkswagen	Taos	2023	48.057 km	Automático	1.4 250 TSI COMFORTLINE AUTO MY23	$35.420.000
Toyota	Corolla Cross	2024	11.222 km	Automático	2.0 SEG CVT	$53.530.000
Jeep	Compass	2020	53.894 km	Automático	2.4 LIMITED PLUS AUTO 4WD MY20	$37.690.000
Volkswagen	Nivus	2021	41.381 km	Automático	1.0 200 TSI COMFORTLINE AUTO	$25.760.000
Dodge	Journey	2013	117.208 km	Automático	2.4 SXT TECHO DVD AUTO	$16.760.000
Jeep	Renegade	2022	36.135 km	Automático	1.8 LONGITUDE AT 4x2	$30.150.000
Renault	Kardian	2024	15.000 km	Automático	1.0 TCE PREMIERE EDITION AUTO	$30.650.000
Renault	Koleos	2012	197.131 km	Manual	2.5 L 4X4 PRIVILEGE MT	$12.010.000
Ford	Bronco Sport	2023	23.836 km	Automático	2.0 WILDTRAK AUTO 4WD	$48.970.000
Volkswagen	Taos	2022	83.778 km	Automático	1.4 250 TSI HIGHLINE AUTO	$33.820.000
Peugeot	3008	2024	17.535 km	Automático	1.6 THP GT PACK TIPTRONIC	$48.520.000
Chery	Tiggo 3	2018	90.121 km	Manual	1.6 COMFORT 4X2 MT	$15.790.000
Chevrolet	Tracker	2020	53.128 km	Automático	1.2 TURBO PREMIER AT	$27.480.000
Jeep	Compass	2022	50.000 km	Automático	1.3 T270 LIMITED PLUS AUTO	$38.610.000
Ford	Territory	2021	75.630 km	Automático	1.5 TITANIUM CVT	$31.170.000
Ford	EcoSport	2015	139.177 km	Manual	1.6L FREESTYLE	$13.560.000
Toyota	Corolla Cross	2025	51.503 km	Automático	1.8 HYBRID XEI ECVT	$43.620.000
Fiat	Fastback	2024	11.222 km	Automático	1.3 T270 AUTO	$35.380.000
Ford	EcoSport	2020	96.222 km	Manual	1.5 TITANIUM	$23.129.000
Renault	Captur	2017	147.222 km	Manual	2.0 ZEN	$18.170.000
Ford	Bronco Sport	2022	75.000 km	Automático	2.0 WILDTRAK AUTO 4WD	$42.350.000
Nissan	Kicks	2022	26.731 km	Manual	1.6 SENSE	$26.350.000
Ford	Territory	2021	31.179 km	Automático	1.5 TITANIUM CVT	$33.300.000
Ford	Territory	2020	43.860 km	Automático	1.5 TITANIUM CVT	$33.410.000
Ford	Territory	2021	47.637 km	Automático	1.5 TITANIUM CVT	$32.700.000
Ford	EcoSport	2010	174.747 km	Manual	1.6 XL PLUS MP3	$8.850.000
Volkswagen	Taos	2024	27.621 km	Automático	1.4 250 TSI COMFORTLINE AUTO MY24	$36.790.000
Ford	Territory	2021	79.329 km	Automático	1.5 TITANIUM CVT	$31.000.000
Toyota	SW4	2020	86.000 km	Automático	2.8 TDI SRX AUTO 4WD	$53.060.000
Chery	Tiggo 5	2018	68.482 km	Automático	2.0 LUXURY AT	$20.000.000
Ford	Territory	2021	51.186 km	Automático	1.5 TITANIUM CVT	$35.880.000
Chevrolet	Equinox	2021	68.459 km	Automático	1.5 PREMIER AUTO 4WD	$34.980.000
Volkswagen	Tiguan Allspace	2019	67.172 km	Automático	2.0 TSI DSG 4WD HIGHLINE	$44.720.000
Chevrolet	Tracker	2023	43.222 km	Automático	1.2 TURBO AT	$29.663.000
Volkswagen	Tiguan Allspace	2018	109.413 km	Automático	2.0 TSI DSG 4WD COMFORTLINE TECHO	$32.840.000
Fiat	500X	2018	107.565 km	Manual	1.4 POP STAR	$16.430.000
Ford	Territory	2025	1.003 km	Automático	1.8 ECOBOOST SEL AUTO	$51.714.200
Renault	Kardian	2025	1.003 km	Automático	1.0 TCE EVOLUTION AUTO	$37.164.280
Renault	Kardian	2025	1.003 km	Automático	1.0 TCE EVOLUTION AUTO	$36.654.280
Volkswagen	T-Cross	2025	0 km	Automático	1.0 200 TSI TRENDLINE TIPTRONIC MY25	$36.503.300
Volkswagen	T-Cross	2025	1.003 km	Automático	1.0 200 TSI TRENDLINE TIPTRONIC MY25	$37.013.300
Renault	Kardian	2025	1.002 km	Manual	1.6 SCE EVOLUTION	$32.804.252
Volkswagen	T-Cross	2025	1.003 km	Automático	1.0 200 TSI TRENDLINE TIPTRONIC MY25	$36.503.300
Volkswagen	Tiguan Allspace	2019	84.102 km	Automático	1.4 TSI TRENDLINE DSG	$30.700.000
Toyota	Corolla Cross	2023	25.031 km	Automático	2.0 XLI CVT	$36.500.000
Peugeot	2008	2026	1.003 km	Automático	1.0 T200 ALLURE AUTO	$41.480.100
Citroen	Basalt	2025	1.003 km	Manual	1.6 LIVE PK	$29.189.700
Peugeot	2008	2025	3 km	Automático	1.0 T200 ACTIVE AUTO	$38.407.500
Peugeot	2008	2025	2.002 km	Automático	1.0 T200 GT AUTO	$42.504.300
Ford	Bronco Sport	2025	2.033 km	Automático	2.0 BADLANDS AUTO 4WD	$67.494.780
Fiat	600	2025	1.003 km	Automático	1.2 MHEV DCT	$48.444.660
Peugeot	2008	2025	1.002 km	Automático	1.0 T200 ACTIVE AUTO	$40.148.640
Renault	Arkana	2025	1.002 km	Automático	1.3T MHEV ESPRIT ALPINE AUTO	$50.851.529
Renault	Duster	2025	1.002 km	Manual	1.6 INTENS	$38.052.281
Renault	Kardian	2025	1.002 km	Automático	1.0 TCE EVOLUTION AUTO	$37.544.280
Chevrolet	Tracker	2025	1.002 km	Automático	1.2 TURBO RS AUTO	$44.245.440
Renault	Kardian	2025	1.002 km	Manual	1.6 SCE EVOLUTION	$31.266.321
Citroen	Basalt	2025	1.002 km	Manual	1.6 LIVE PK	$30.111.480
Volkswagen	T-Cross	2025	1.002 km	Automático	1.0 200 TSI TRENDLINE TIPTRONIC MY25	$37.383.300
Ford	Territory	2025	1.003 km	Automático	1.8 ECOBOOST SEL AUTO	$51.312.420
Renault	Arkana	2025	1.003 km	Automático	1.3T MHEV ESPRIT ALPINE AUTO	$50.697.900
Volkswagen	Taos	2025	1.003 km	Automático	1.4 250 TSI HIGHLINE AUTO MY24	$59.403.600
Volkswagen	Taos	2025	1.003 km	Automático	1.4 250 TSI COMFORTLINE AUTO MY24	$54.026.550
Volkswagen	T-Cross	2025	1.003 km	Automático	1.0 200 TSI COMFORTLINE TIPTRONIC MY25	$41.736.150`;

function parseData() {
    const lines = RAW_DATA.trim().split('\n');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split('\t');
        if (parts.length < 7) continue;

        const brand = parts[0].trim();
        const model = parts[1].trim();
        const year = parseInt(parts[2].trim());
        const kmStr = parts[3].trim().replace(' km', '').replace(/\./g, '');
        const km = parseInt(kmStr);
        const spec = parts[5].trim();

        // Price: Convert ARS to USD (1 USD = 1495 ARS)
        const priceRaw = parseInt(parts[6].trim().replace('$', '').replace(/\./g, ''));
        const price_usd = Math.round(priceRaw / 1495);

        data.push({
            brand_model: `${brand.toUpperCase()} ${model.toUpperCase()}`,
            year: year,
            km: km,
            price_usd: price_usd,
            version: spec,
            url: "https://kavak.com/ar"
        });
    }

    fs.writeFileSync('data/market_data.json', JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${data.length} items to market_data.json`);
}

parseData();
