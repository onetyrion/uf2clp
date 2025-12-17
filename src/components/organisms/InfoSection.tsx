import React from 'react';
import { Card } from '../atoms/Card';
import { Subheading, Label } from '../atoms/Typography';
import { WeatherCondition } from '../molecules/WeatherCondition';
import { Button } from '../atoms/Button';
import { useStore } from '@nanostores/react';
import { $theme } from '../../stores/themeStore';
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
    Filler
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
    Filler
);

interface InfoSectionProps {
    history: UFData[];
    weatherData: WeatherData | null;
    weatherLoading: boolean;
    weatherError: string | null;
    requestWeather: () => void;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ history, weatherData, weatherLoading, weatherError, requestWeather }) => {

    const chartData = {
        labels: history.map(h => {
            const d = new Date(h.fecha);
            return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
        }),
        datasets: [{
            data: history.map(h => h.valor),
            borderColor: '#2563eb',
            borderWidth: 3,
            fill: true,
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
            pointRadius: 4, // Make points slightly visible for interaction
            pointBackgroundColor: '#2563eb',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
        }]
    };

    const theme = useStore($theme);

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
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                padding: 14,
                cornerRadius: 12,
                displayColors: false, // Hide the little color box
                titleFont: {
                    size: 14,
                    weight: 'bold' as const,
                    family: "'Inter', sans-serif"
                },
                bodyFont: {
                    size: 13,
                    family: "'Inter', sans-serif"
                },
                callbacks: {
                    title: function (context: any) {
                        return `Día ${context[0].label}`;
                    },
                    label: function (context: any) {
                        return `Valor: ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(context.raw)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false, // Cleaner look without vertical lines
                },
                ticks: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#94a3b8',
                    font: { size: 10 }
                },
                border: { display: false }
            },
            y: {
                display: true,
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#94a3b8',
                    font: { size: 10 },
                    maxTicksLimit: 6, // Limit number of labels to avoid crowding
                    callback: function (value: any) {
                        return new Intl.NumberFormat('es-CL').format(value); // Just numbers, no $ sign for cleaner look
                    }
                },
                border: { display: false }
            }
        }
    };

    return (
        <section className="space-y-6">
            <Card className="p-6">
                <Subheading>Tendencia UF</Subheading>
                <div className="h-[200px]">
                    {history.length > 0 && <Line data={chartData} options={chartOptions} />}
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
