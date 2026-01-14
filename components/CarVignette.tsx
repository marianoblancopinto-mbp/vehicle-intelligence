'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VignetteProps {
    data: {
        model: string;
        count: number;
        depreciation_per_year: number;
        depreciation_per_10k_km: number;
        coefficients: { intercept: number; year: number; km: number };
        buckets: { range: string; avg_price: number; count: number }[];
        resilience_score: number;
        stability_label: string;
    };
}

export function CarVignette({ data }: VignetteProps) {
    const [calcYear, setCalcYear] = useState(2022);
    const [calcKm, setCalcKm] = useState(50000);

    const currentYear = new Date().getFullYear();
    const { intercept, year: slopeYear, km: slopeKm } = data.coefficients;

    const calculateFairPrice = (y: number, k: number) => {
        const age = currentYear - y;
        const price = intercept + (slopeYear * age) + (slopeKm * k);
        return Math.max(0, Math.round(price));
    };

    const predictedPrice = calculateFairPrice(calcYear, calcKm);

    // Chart data for Usage Impact (fixed 3yo car, varying km)
    const usageChartData = [0, 50000, 100000, 150000, 200000].map(k => ({
        km: `${k / 1000}k`,
        price: calculateFairPrice(currentYear - 3, k)
    }));

    // Chart data for Time Impact (fixed 50k km, varying age)
    const timeChartData = [0, 1, 2, 3, 4, 5, 6, 7].map(age => ({
        year: currentYear - age,
        price: calculateFairPrice(currentYear - age, 50000)
    })).reverse();

    const badgeColor = data.stability_label.includes('Gold') || data.stability_label.includes('Benchmark')
        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        : data.stability_label.includes('Silver')
            ? 'bg-gray-400/20 text-gray-300 border-gray-500/30'
            : data.stability_label.includes('Platinum')
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                : 'bg-orange-500/20 text-orange-400 border-orange-500/30';

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{data.model}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${badgeColor}`}>
                        {data.stability_label}
                    </span>
                </div>
                <div className="flex gap-4 mt-2 text-sm text-zinc-500">
                    <span>{data.count} unidades analizadas</span>
                    <span>•</span>
                    <span>Score: {Math.round(data.resilience_score)}</span>
                </div>
            </div>

            {/* Body */}
            <div className="grid md:grid-cols-3 gap-0">

                {/* Left: Depreciation Stats & Calculator */}
                <div className="p-6 border-r border-zinc-800 space-y-6">
                    {/* Depreciation Cards */}
                    <div>
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                            Depreciación Dual
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-zinc-800/50 rounded-lg p-3">
                                <div className="text-2xl font-bold text-red-400">
                                    ${Math.abs(data.depreciation_per_year).toLocaleString()}
                                </div>
                                <div className="text-xs text-zinc-500 mt-1">por año</div>
                            </div>
                            <div className="bg-zinc-800/50 rounded-lg p-3">
                                <div className="text-2xl font-bold text-red-400">
                                    ${Math.abs(data.depreciation_per_10k_km).toLocaleString()}
                                </div>
                                <div className="text-xs text-zinc-500 mt-1">por 10.000 km</div>
                            </div>
                        </div>
                    </div>

                    {/* Calculator */}
                    <div className="bg-zinc-800 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-white mb-4">⚡ Calculadora de Precio Justo</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Año del vehículo</label>
                                <input
                                    type="number"
                                    value={calcYear}
                                    onChange={(e) => setCalcYear(Number(e.target.value))}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                                    min={2010}
                                    max={currentYear}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Kilometraje</label>
                                <select
                                    value={calcKm}
                                    onChange={(e) => setCalcKm(Number(e.target.value))}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value={0}>0 km (Nuevo)</option>
                                    <option value={25000}>25.000 km</option>
                                    <option value={50000}>50.000 km</option>
                                    <option value={75000}>75.000 km</option>
                                    <option value={100000}>100.000 km</option>
                                    <option value={150000}>150.000 km</option>
                                    <option value={200000}>200.000 km</option>
                                </select>
                            </div>
                            <div className="pt-3 border-t border-zinc-700">
                                <div className="text-xs text-zinc-500 mb-1">Precio Justo Estimado</div>
                                <div className="text-3xl font-bold text-emerald-400">
                                    ${predictedPrice.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Usage Chart */}
                <div className="p-6 border-r border-zinc-800">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                        Impacto del Uso (Auto 3 años)
                    </h3>
                    <div style={{ height: 256, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={usageChartData}>
                                <XAxis dataKey="km" stroke="#71717a" fontSize={11} />
                                <YAxis
                                    stroke="#71717a"
                                    fontSize={11}
                                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                    width={50}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid #3f3f46',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Precio']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Time Chart */}
                <div className="p-6">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                        Impacto del Tiempo (50.000 km)
                    </h3>
                    <div style={{ height: 256, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timeChartData}>
                                <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
                                <YAxis
                                    stroke="#71717a"
                                    fontSize={11}
                                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                    width={50}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid #3f3f46',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Precio']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
