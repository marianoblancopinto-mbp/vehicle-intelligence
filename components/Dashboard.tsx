'use client';
import { useState, useMemo } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ReferenceLine, Cell, ScatterChart, Scatter, ZAxis, Legend } from 'recharts';
import { Activity, Clock, TrendingUp, BarChart3, ChevronRight, AlertTriangle } from 'lucide-react';

// Utility for class names
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface ReportItem {
    model: string;
    count: number;
    depreciation_per_year: number;
    depreciation_per_10k_km: number;
    coefficients: { intercept: number; year: number; km: number };
    buckets: { range: string; avg_price: number; count: number }[];
    resilience_score: number;
    stability_label: string;
    r2: number;
    yearRange: { min: number; max: number };
    kmRange: { min: number; max: number };
    modelType?: 'LINEAR' | 'EXPONENTIAL' | 'ENSEMBLE';
    weights?: { linear: number; exponential: number };
    exponential_coefficients?: { intercept: number; year: number; km: number };
}

interface ZeroKmData {
    model: string;
    prices: number[];
}

interface ScatterPoint {
    year: number;
    km: number;
    price: number;
}

interface DashboardProps {
    data: ReportItem[];
    zeroKmData: ZeroKmData[];
    scatterData?: Record<string, ScatterPoint[]>;
}

export function Dashboard({ data, zeroKmData, scatterData }: DashboardProps) {
    const currentYear = new Date().getFullYear();

    // Group models by Parent 👨‍
    const groupedModels = useMemo(() => {
        const groups: Record<string, ReportItem[]> = {};
        const allModels = data.map(d => d.model);

        // Identify "Parents": Any model that is a prefix of another
        const parents = allModels.filter(m =>
            allModels.some(other => other !== m && other.startsWith(m + ' '))
        );

        const findParent = (modelName: string) => {
            const p = parents.find(parent => modelName.startsWith(parent + ' '));
            return p || modelName; // Fallback to self (Orphan)
        };

        data.forEach(item => {
            const parent = findParent(item.model);
            if (!groups[parent]) groups[parent] = [];
            groups[parent].push(item);
        });

        return groups;
    }, [data]);

    const parentKeys = useMemo(() => Object.keys(groupedModels).sort(), [groupedModels]);

    const [selectedParent, setSelectedParent] = useState(parentKeys[0] || '');

    // We just track selected VARIANT MODEL string
    const [selectedModel, setSelectedModel] = useState(data[0]?.model || '');

    // Derived parent (for UI sync)
    const activeParent = parentKeys.find(p =>
        groupedModels[p].some(item => item.model === selectedModel)
    ) || selectedModel;

    const [calcYear, setCalcYear] = useState(2022);
    const [calcKm, setCalcKm] = useState(50000);
    const [chartFixedYear, setChartFixedYear] = useState(currentYear - 3);
    const [chartFixedKm, setChartFixedKm] = useState(50000);

    const selected = data.find(d => d.model === selectedModel) || data[0];
    const selectedZeroKm = zeroKmData.find(z => z.model === selectedModel);

    // Calculate mean
    const calculateMean = (prices: number[]) => {
        if (prices.length === 0) return 0;
        return prices.reduce((sum, p) => sum + p, 0) / prices.length;
    };

    // Calculate sample standard deviation
    const calculateStdDev = (prices: number[]) => {
        if (prices.length <= 1) return 0;
        const mean = calculateMean(prices);
        const squaredDiffs = prices.map(p => Math.pow(p - mean, 2));
        const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / (prices.length - 1);
        return Math.sqrt(variance);
    };

    // Generate histogram data with fixed range 0-70k USD
    const generateHistogramData = (prices: number[]) => {
        if (prices.length === 0) return [];

        const fixedMin = 0;
        const fixedMax = 70000;
        const binCount = 14;
        const binSize = (fixedMax - fixedMin) / binCount; // 5k per bin

        const bins = Array(binCount).fill(0).map((_, i) => ({
            range: `$${Math.round((fixedMin + i * binSize) / 1000)}k`,
            rangeStart: fixedMin + i * binSize,
            rangeEnd: fixedMin + (i + 1) * binSize,
            count: 0
        }));

        const total = prices.length;
        prices.forEach(price => {
            const binIndex = Math.min(Math.floor((price - fixedMin) / binSize), binCount - 1);
            if (binIndex >= 0 && binIndex < binCount) {
                bins[binIndex].count++;
            }
        });

        return bins.map(b => ({
            ...b,
            percentage: total > 0 ? (b.count / total) * 100 : 0
        }));
    };

    const zeroKmPrices = selectedZeroKm?.prices || [];
    const zeroKmMean = calculateMean(zeroKmPrices);
    const zeroKmStdDev = calculateStdDev(zeroKmPrices);
    const histogramData = generateHistogramData(zeroKmPrices);

    if (!selected) return <div className="text-zinc-500 text-center py-20">Sin datos disponibles</div>;

    const { intercept, year: slopeYear, km: slopeKm } = selected.coefficients;

    const calculateFairPrice = (y: number, k: number) => {
        const age = currentYear - y;

        // Linear Calculation
        const valLinear = Math.max(0, intercept + (slopeYear * age) + (slopeKm * k));

        // Exponential Calculation (if coeffs available, otherwise fallback to linear)
        let valExponential = 0;
        if (selected.exponential_coefficients) {
            const { intercept: i2, year: y2, km: k2 } = selected.exponential_coefficients;
            valExponential = Math.max(0, Math.exp(i2 + (y2 * age) + (k2 * k)));
        } else {
            valExponential = valLinear; // Fallback
        }

        // Ensemble Weighting
        if (selected.weights) {
            return Math.round(selected.weights.linear * valLinear + selected.weights.exponential * valExponential);
        } else if (selected.modelType === 'EXPONENTIAL') {
            return Math.round(valExponential);
        } else {
            return Math.round(valLinear);
        }
    };

    const predictedPrice = calculateFairPrice(calcYear, calcKm);

    // Generate km range - always extend to 350k for projection visibility
    const kmMin = 0;
    const kmMax = 350000;
    const kmStep = 25000;
    const dataKmMax = selected.kmRange?.max || 150000;
    const kmPoints: number[] = [];
    for (let k = kmMin; k <= kmMax; k += kmStep) kmPoints.push(k);

    const usageChartData = kmPoints.map(k => ({
        km: `${k / 1000}k`,
        kmValue: k,
        precio: calculateFairPrice(chartFixedYear, k),
        isExtrapolation: k > dataKmMax
    }));

    // Generate year range based on actual data
    // Only extend to current year if we have data from 2024+ (still manufactured)
    const yearMin = selected.yearRange?.min || 2010;
    const dataMaxYear = selected.yearRange?.max || currentYear;
    const yearMax = dataMaxYear >= currentYear - 1 ? currentYear : Math.min(dataMaxYear + 1, currentYear - 1);
    const yearsRange = [];
    for (let y = yearMax; y >= yearMin; y--) yearsRange.push(y);
    const timeChartData = yearsRange.map(year => ({
        año: year,
        precio: calculateFairPrice(year, chartFixedKm)
    }));

    const getBadgeStyle = (label: string) => {
        if (label.includes('Gold') || label.includes('Benchmark'))
            return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/40';
        if (label.includes('Silver'))
            return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 text-gray-300 border-gray-500/40';
        if (label.includes('Platinum'))
            return 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/40';
        return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/40';
    };

    const showLowConfidence = selected.r2 < 0.6;
    const modelScatterData = scatterData?.[selectedModel] || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 font-sans">
            {/* Header */}
            <header className="border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">V</div>
                        <h1 className="text-xl font-bold tracking-tight">
                            Vehicle <span className="text-blue-400">Intelligence</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <select
                            value={activeParent}
                            onChange={(e) => {
                                const newParent = e.target.value;
                                const variants = groupedModels[newParent];
                                // Prefer "Global" variant if exists (name === newParent)
                                const globalVar = variants.find(v => v.model === newParent);
                                const firstVar = variants[0];
                                setSelectedModel((globalVar || firstVar).model);
                            }}
                            className="bg-transparent text-sm font-medium focus:outline-none text-zinc-200 px-3 py-1.5 cursor-pointer max-w-[250px]"
                        >
                            {parentKeys.map(parent => (
                                <option key={parent} value={parent} className="bg-zinc-900">
                                    {parent}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* Main Grid - 2x2 Layout (Always 2 columns) */}
            <main className="max-w-[1600px] mx-auto p-6">
                <div className="grid grid-cols-2 gap-6">

                    {/* LEFT COLUMN */}
                    <div className="space-y-6">
                        {/* Model Header Card */}
                        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-3xl font-black text-white">{activeParent}</h2>

                                    {/* Variant Selection Tabs */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {groupedModels[activeParent]?.map((variant) => {
                                            const isActive = variant.model === selectedModel;
                                            const shortName = variant.model.replace(activeParent, '').trim() || 'Global';
                                            return (
                                                <button
                                                    key={variant.model}
                                                    onClick={() => setSelectedModel(variant.model)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                                        isActive
                                                            ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20"
                                                            : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-200"
                                                    )}
                                                >
                                                    {shortName}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className={cn("px-3 py-1 rounded-full text-xs font-bold border", getBadgeStyle(selected.stability_label))}>
                                        {selected.stability_label}
                                    </div>
                                    <div className="text-xs text-zinc-500 font-medium">
                                        <span className="text-zinc-300 font-bold">{selected.count}</span> muestras
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-zinc-800/50">
                                <div>
                                    <div className="text-zinc-500 text-xs font-bold uppercase mb-1">R² Score</div>
                                    <div className={cn("text-2xl font-mono font-bold", selected.r2 > 0.8 ? "text-emerald-400" : selected.r2 > 0.6 ? "text-yellow-400" : "text-amber-500")}>
                                        {selected.r2.toFixed(3)}
                                    </div>
                                </div>

                                <div className="ml-auto">
                                    <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Pesos del Modelo</div>
                                    <div className="flex items-center gap-3 text-xs font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            <span className="text-zinc-400">Lin:</span>
                                            <span className="text-blue-400">{Math.round((selected.weights?.linear ?? (selected.modelType === 'LINEAR' ? 1 : 0)) * 100)}%</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                            <span className="text-zinc-400">Exp:</span>
                                            <span className="text-purple-400">{Math.round((selected.weights?.exponential ?? (selected.modelType === 'EXPONENTIAL' ? 1 : 0)) * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5">
                                <div className="text-zinc-500 text-xs font-bold uppercase mb-2">Depreciación Anual</div>
                                <div className="text-2xl font-bold text-red-400">${Math.abs(selected.depreciation_per_year).toLocaleString()}</div>
                                <div className="text-zinc-600 text-xs mt-1">Pérdida por año</div>
                            </div>
                            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5">
                                <div className="text-zinc-500 text-xs font-bold uppercase mb-2">Depreciación Uso</div>
                                <div className="text-2xl font-bold text-orange-400">${Math.abs(selected.depreciation_per_10k_km).toLocaleString()}</div>
                                <div className="text-zinc-600 text-xs mt-1">Cada 10.000 km</div>
                            </div>
                        </div>

                        {/* Calculator */}
                        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-100">Calculadora de Valor Real</h3>
                                    <p className="text-xs text-blue-400 font-medium">
                                        Calculado sobre: <span className="text-zinc-200 font-bold border-b border-zinc-600">{selected.model}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="text-xs text-zinc-500 font-medium block mb-2">Año del Vehículo</label>
                                    <input
                                        type="number"
                                        value={calcYear}
                                        onChange={(e) => setCalcYear(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 font-medium block mb-2">Kilometraje</label>
                                    <input
                                        type="number"
                                        value={calcKm}
                                        onChange={(e) => setCalcKm(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
                                <div className="text-xs text-zinc-400 mb-1">Precio de Mercado Justo</div>
                                <div className="text-4xl font-black text-emerald-400">${predictedPrice.toLocaleString()}</div>
                                <div className="text-xs text-zinc-500 mt-1">Para {calcYear} con {calcKm.toLocaleString()} km</div>
                            </div>
                        </div>

                        {/* 0km Histogram */}
                        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                                        <BarChart3 size={18} className="text-cyan-500" />
                                        Distribución Precios 0km
                                    </h3>
                                    <p className="text-xs text-zinc-500">Histograma de precios de mercado</p>
                                </div>
                            </div>

                            {zeroKmPrices.length > 0 ? (
                                <>
                                    {/* Statistics Display */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
                                            <div className="text-xs text-zinc-400 mb-1">Media (μ)</div>
                                            <div className="text-xl font-bold text-cyan-400">${Math.round(zeroKmMean).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3 text-center">
                                            <div className="text-xs text-zinc-400 mb-1">Desvío Muestral (s)</div>
                                            <div className="text-xl font-bold text-violet-400">${Math.round(zeroKmStdDev).toLocaleString()}</div>
                                        </div>
                                    </div>

                                    {/* Histogram Chart */}
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={histogramData}>
                                                <defs>
                                                    <linearGradient id="colorHistogram" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="range" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} tickFormatter={(v) => `${v}%`} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                                                    formatter={(value: any) => [`${parseFloat(value).toFixed(1)}%`, 'Frecuencia']}
                                                />
                                                <ReferenceLine x={histogramData.find(b => zeroKmMean >= b.rangeStart && zeroKmMean < b.rangeEnd)?.range} stroke="#22d3ee" strokeDasharray="3 3" label={{ value: 'μ', fill: '#22d3ee', fontSize: 12 }} />
                                                <Bar dataKey="percentage" fill="url(#colorHistogram)" radius={[4, 4, 0, 0]}>
                                                    {histogramData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={zeroKmMean >= entry.rangeStart && zeroKmMean < entry.rangeEnd ? '#22d3ee' : 'url(#colorHistogram)'}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="mt-3 text-center text-xs text-zinc-500">
                                        n = {zeroKmPrices.length} vehículos 0km analizados
                                    </div>
                                </>
                            ) : (
                                <div className="h-[280px] flex items-center justify-center text-zinc-500">
                                    <div className="text-center">
                                        <BarChart3 size={48} className="mx-auto mb-2 opacity-30" />
                                        <p>Sin datos 0km disponibles para este modelo</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Charts */}
                    <div className="space-y-6">
                        {showLowConfidence ? (
                            <>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-2">
                                        <AlertTriangle size={20} />
                                        Baja Confianza del Modelo (R² {(selected.r2).toFixed(2)})
                                    </h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed">
                                        {selectedModel === activeParent && groupedModels[activeParent]?.length > 1 ? (
                                            <>
                                                El modelo <strong className="text-zinc-200">Global</strong> agrupa todas las versiones de {activeParent}, lo que genera alta varianza en los precios.
                                                Para este vehículo disponemos de <strong className="text-blue-400">{groupedModels[activeParent].length - 1} versiones segregadas</strong> que pueden ofrecer predicciones más confiables.
                                                Seleccioná una versión específica en los tabs de arriba para mayor precisión.
                                            </>
                                        ) : (
                                            <>
                                                Este modelo presenta una alta varianza en los precios, lo que indica que el año y el kilometraje no son suficientes para explicar completamente su valor.
                                                Esto puede deberse a versiones muy dispares (ej. base vs sport) o un mercado inestable. Las predicciones de la calculadora pueden ser menos precisas.
                                            </>
                                        )}
                                    </p>
                                </div>

                                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 min-h-[350px]">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-zinc-100">Distribución Real de Mercado</h3>
                                        <p className="text-xs text-zinc-500">Dispersión de precios reales por Año</p>
                                    </div>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                                                <XAxis type="number" dataKey="km" name="Kilometraje" unit=" km" stroke="#52525b" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} domain={[0, 'auto']} />
                                                <YAxis type="number" dataKey="price" name="Precio" unit=" USD" stroke="#52525b" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} domain={[0, 'auto']} />
                                                <ZAxis type="number" dataKey="year" name="Año" range={[60, 60]} />
                                                <Tooltip
                                                    cursor={{ strokeDasharray: '3 3' }}
                                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                                                    formatter={(value: any, name: any) => [
                                                        name === 'Precio' ? `$${value?.toLocaleString()}` : name === 'Kilometraje' ? `${value?.toLocaleString()} km` : value,
                                                        name
                                                    ]}
                                                />
                                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                                {/* Group data by year for Legend coloring */}
                                                {Object.entries(modelScatterData.reduce((acc, item) => {
                                                    if (!acc[item.year]) acc[item.year] = [];
                                                    acc[item.year].push(item);
                                                    return acc;
                                                }, {} as Record<number, any[]>))
                                                    .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                                                    .map(([year, items]) => {
                                                        const y = Number(year);
                                                        const color =
                                                            y >= 2025 ? '#10b981' : // Emerald
                                                                y === 2024 ? '#06b6d4' : // Cyan
                                                                    y === 2023 ? '#3b82f6' : // Blue
                                                                        y === 2022 ? '#8b5cf6' : // Violet
                                                                            y === 2021 ? '#d946ef' : // Fuchsia
                                                                                y === 2020 ? '#f43f5e' : // Rose
                                                                                    '#f59e0b';               // Amber (Older)

                                                        return (
                                                            <Scatter key={year} name={`${year}`} data={items} fill={color} shape="circle" />
                                                        );
                                                    })}
                                            </ScatterChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Usage Chart */}
                                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 min-h-[350px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                                                <Activity size={18} className="text-emerald-500" />
                                                Impacto del Kilometraje
                                            </h3>
                                            <p className="text-xs text-zinc-500">Valor vs Km recorridos • <span className="text-amber-400">Zona punteada = proyección</span></p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-zinc-500">Año:</span>
                                            <input
                                                type="number"
                                                value={chartFixedYear}
                                                onChange={(e) => setChartFixedYear(Number(e.target.value))}
                                                className="bg-zinc-800 border-zinc-700 text-zinc-300 w-16 text-center rounded"
                                            />
                                        </div>
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={usageChartData}>
                                                <defs>
                                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="km" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                                                    formatter={(value: any, name: any, props: any) => [
                                                        `$${(value as number)?.toLocaleString() ?? 0}${props.payload?.isExtrapolation ? ' (proyección)' : ''}`,
                                                        'Precio'
                                                    ]}
                                                />
                                                <ReferenceLine
                                                    x={usageChartData.find(d => d.kmValue > dataKmMax)?.km}
                                                    stroke="#f59e0b"
                                                    strokeWidth={2}
                                                    strokeDasharray="8 4"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="precio"
                                                    stroke="#10b981"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorPrice)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Time Chart */}
                                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 min-h-[350px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-100">Impacto de la Antigüedad</h3>
                                            <p className="text-xs text-zinc-500">Valor vs Año de Fabricación</p>
                                        </div>
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={timeChartData}>
                                                <defs>
                                                    <linearGradient id="colorPriceTime" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="año" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }} />
                                                <Area type="monotone" dataKey="precio" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPriceTime)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
