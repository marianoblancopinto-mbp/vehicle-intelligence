import fs from 'fs';
import { PriceModeler } from './agents/agent_b/modeler';

interface CarData {
    brand_model: string;
    year: number;
    price_usd: number;
    km: number;
    version: string;
    url: string;
}

const rawData = fs.readFileSync('./data/market_data.json', 'utf-8');
const data: CarData[] = JSON.parse(rawData);

const corollas = data.filter(d =>
    d.brand_model?.toUpperCase().includes('COROLLA CROSS')
);

// Focus on PETROL first (N=21)
const petrols = corollas.filter(c => {
    const t = c.version?.toUpperCase() || '';
    return (t.includes('2.0') || t.includes('NAFTA')) && !t.includes('HYBRID');
});

console.log(`\n--- PETROL Segment Analysis (N=${petrols.length}) ---`);

// Buckets for Trims
const seg = petrols.filter(c => c.version.toUpperCase().includes('SEG'));
const xei = petrols.filter(c => c.version.toUpperCase().includes('XEI'));
const xli = petrols.filter(c => c.version.toUpperCase().includes('XLI'));

console.log(`SEG: ${seg.length}`);
console.log(`XEI: ${xei.length}`);
console.log(`XLI: ${xli.length}`);

const modeler = new PriceModeler();

if (seg.length > 3) {
    const m = modeler.trainModel(seg);
    console.log(`[SEG] N=${seg.length} | R2: ${m.r2.toFixed(3)}`);
}

if (xei.length > 3) {
    const m = modeler.trainModel(xei);
    console.log(`[XEI] N=${xei.length} | R2: ${m.r2.toFixed(3)}`);
}

if (xli.length > 3) {
    const m = modeler.trainModel(xli);
    console.log(`[XLI] N=${xli.length} | R2: ${m.r2.toFixed(3)}`);
}

// HYBRID Analysis
const hybrids = corollas.filter(c => {
    const t = c.version?.toUpperCase() || '';
    return (t.includes('1.8') || t.includes('HV') || t.includes('HYBRID'));
});

console.log(`\n--- HYBRID Segment Analysis (N=${hybrids.length}) ---`);

const h_seg = hybrids.filter(c => c.version.toUpperCase().includes('SEG'));
const h_xei = hybrids.filter(c => c.version.toUpperCase().includes('XEI'));

console.log(`Hybrid SEG: ${h_seg.length}`);
console.log(`Hybrid XEI: ${h_xei.length}`);

if (h_seg.length > 3) {
    const m = modeler.trainModel(h_seg);
    console.log(`[H-SEG] N=${h_seg.length} | R2: ${m.r2.toFixed(3)}`);
}

if (h_xei.length > 3) {
    const m = modeler.trainModel(h_xei);
    console.log(`[H-XEI] N=${h_xei.length} | R2: ${m.r2.toFixed(3)}`);
}
