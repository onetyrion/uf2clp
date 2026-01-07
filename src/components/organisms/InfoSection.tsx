import React, { useRef, useEffect, useState } from 'react';
import { Card } from '../atoms/Card';
import { Subheading, Label } from '../atoms/Typography';
import { WeatherCondition } from '../molecules/WeatherCondition';
import { Button } from '../atoms/Button';
import { crosshairPlugin } from '../molecules/ChartPlugins';
import type { DateRange } from '../../hooks/useCurrency';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    type ScriptableContext
} from 'chart.js';
import type { UFData, WeatherData } from '../../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    crosshairPlugin
);

interface InfoSectionProps {
    history: UFData[];
    weatherData: WeatherData | null;
    weatherLoading: boolean;
    weatherError: string | null;
    requestWeather: () => void;
    range: DateRange;
    setRange: (range: DateRange) => void;
}

export const InfoSection: React.FC<InfoSectionProps> = ({
    history,
    weatherData,
    weatherLoading,
    weatherError,
    requestWeather,
    range,
    setRange
}) => {

    const chartRef = useRef<any>(null);

    const rangeLabels: Record<DateRange, string> = {
        '1M': '1M',
        '3M': '3M',
        '6M': '6M',
        '1Y': '1A'
    };

    const chartData = {
        labels: history.map(h => {
            const d = new Date(h.fecha);
            return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
        }),
        datasets: [{
            data: history.map(h => h.valor),
            borderColor: '#22c55e', // Green-500
            borderWidth: 2,
            fill: true,
            backgroundColor: (context: ScriptableContext<'line'>) => {
                const chart = context.chart;
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;

                if (!chartArea) {
                    // Fallback if chartArea not yet ready
                    return 'rgba(34, 197, 94, 0.2)';
                }

                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, 'rgba(34, 197, 94, 0.5)'); // Start with visible green
                gradient.addColorStop(0.8, 'rgba(34, 197, 94, 0.1)'); // Fade mostly out near bottom
                gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');   // Completely transparent at bottom
                return gradient;
            },
            tension: 0.4, // Smoother curve (not straight lines)
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#22c55e',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: { display: false as const },
            tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#1e293b',
                bodyColor: '#0f172a',
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
                titleFont: {
                    size: 13,
                    family: "'Inter', sans-serif",
                    weight: 'normal' as const
                },
                bodyFont: {
                    size: 14,
                    family: "'Inter', sans-serif",
                    weight: 'bold' as const
                },
                callbacks: {
                    title: function (context: any) {
                        // Title: "23 dic 2025"
                        // Assuming label is "23 dic" - we might want to pass full date in label or access raw data
                        // For simplicity, let's just use the label
                        return context[0].label;
                    },
                    label: function (context: any) {
                        // Value: "39.697,26"
                        return new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(context.raw);
                    }
                },
                // Add shadow to tooltip using external CSS or canvas if needed. ChartJS default doesn't support complex shadows well,
                // but we can rely on border/color contrast first.
                borderColor: '#e2e8f0',
                borderWidth: 1,
            },
            crosshair: true // Enable our custom plugin
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 10 },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6
                },
                border: { display: false }
            },
            y: {
                display: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 10 },
                    maxTicksLimit: 5,
                    callback: function (value: any) {
                        return new Intl.NumberFormat('es-CL').format(value);
                    }
                },
                border: { display: false }
            }
        }
    };

    const ranges: DateRange[] = ['1M', '3M', '6M', '1Y'];

    return (
        <section className="space-y-6">
            <Card className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    {/* Placeholder for Title or Stats if needed, empty for now to match clean look */}
                    <div className="flex gap-2">
                        {ranges.map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${range === r
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                {rangeLabels[r]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[250px]">
                    {history.length > 0 && <Line ref={chartRef} data={chartData} options={chartOptions} />}
                </div>
            </Card>

            <Card className="p-6 relative overflow-hidden min-h-[160px]">
                {weatherLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-black/20 z-20 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-bold uppercase tracking-widest">Buscando Clima...</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-start">
                    <div>
                        <Subheading className="mb-1 tracking-tight">Condiciones Locales</Subheading>
                        <Label>{weatherData ? weatherData.city : 'Ubicación desactivada'}</Label>
                    </div>
                    {weatherData && (
                        <div className="text-right">
                            <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{Math.round(weatherData.temp)}°C</span>
                        </div>
                    )}
                </div>

                {weatherError && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
                        {weatherError}
                    </div>
                )}

                <div className="mt-4 flex items-center gap-4">
                    {!weatherData && !weatherLoading && !weatherError && (
                        <Button className="w-full" onClick={requestWeather}>
                            Activar Widget de Clima
                        </Button>
                    )}

                    {weatherError && (
                        <Button className="w-full" onClick={requestWeather}>
                            Reintentar
                        </Button>
                    )}

                    <WeatherCondition
                        data={weatherData}
                        loading={weatherLoading}
                        onRefresh={requestWeather}
                    />
                </div>
            </Card>
        </section>
    );
};
