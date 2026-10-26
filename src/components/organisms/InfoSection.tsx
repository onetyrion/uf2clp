import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Card } from '../atoms/Card';
import { Subheading, Label } from '../atoms/Typography';
import { WeatherCondition } from '../molecules/WeatherCondition';
import { Button } from '../atoms/Button';
import type { DateRange } from '../../hooks/useCurrency';
import type { UFData, WeatherData } from '../../services/api';

const LazyUFChart = lazy(() => import('../molecules/UFChart'));

const ChartPlaceholder = () => (
    <div className="h-full w-full rounded-xl bg-slate-800/40 animate-pulse" aria-hidden="true" />
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
    const [chartVisible, setChartVisible] = useState(false);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = chartContainerRef.current;
        if (!element) return;

        if (typeof IntersectionObserver === 'undefined') {
            setChartVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setChartVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const rangeLabels: Record<DateRange, string> = {
        '1M': '1M',
        '3M': '3M',
        '6M': '6M',
        '1Y': '1A'
    };

    const ranges: DateRange[] = ['1M', '3M', '6M', '1Y'];

    return (
        <section className="space-y-6">
            <Card className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex gap-2" role="group" aria-label="Rango de tiempo del gráfico">
                        {ranges.map((r) => (
                            <button
                                key={r}
                                type="button"
                                aria-pressed={range === r}
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

                <div ref={chartContainerRef} className="h-[250px]">
                    {chartVisible && history.length > 0 ? (
                        <Suspense fallback={<ChartPlaceholder />}>
                            <LazyUFChart history={history} />
                        </Suspense>
                    ) : (
                        <ChartPlaceholder />
                    )}
                </div>
            </Card>

            <Card className="p-6 relative overflow-hidden min-h-[160px]">
                {weatherLoading && (
                    <div
                        role="status"
                        aria-live="polite"
                        aria-label="Cargando el clima"
                        className="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-black/20 z-20 backdrop-blur-sm"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
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
                    <div role="alert" className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
                        {weatherError}
                    </div>
                )}

                <div className="mt-4 flex items-center gap-4">
                    {!weatherData && !weatherLoading && !weatherError && (
                        <Button type="button" className="w-full" onClick={requestWeather}>
                            Activar Widget de Clima
                        </Button>
                    )}

                    {weatherError && (
                        <Button type="button" className="w-full" onClick={requestWeather}>
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
