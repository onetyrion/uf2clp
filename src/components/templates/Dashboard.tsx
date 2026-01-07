import React from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { useWeather } from '../../hooks/useWeather';
import { ConverterSection } from '../organisms/ConverterSection';
import { InfoSection } from '../organisms/InfoSection';

export const Dashboard = () => {
    const currency = useCurrency();
    const weather = useWeather();

    return (
        <div className="relative min-h-screen">
            {currency.loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-300">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white font-medium tracking-wider text-sm uppercase">Cargando Datos...</span>
                    </div>
                </div>
            )}

            <main className={`max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start transition-all duration-500 ${currency.loading ? 'blur-md opacity-50 scale-95' : 'blur-0 opacity-100 scale-100'}`}>
                <ConverterSection
                    loading={currency.loading}
                    error={currency.error}
                    ufValue={currency.ufValue}
                    formattedUF={currency.formattedUF}
                    dateStr={currency.dateStr}
                    amount={currency.amount}
                    setAmount={currency.setAmount}
                    isUfToClp={currency.isUfToClp}
                    setIsUfToClp={currency.setIsUfToClp}
                    result={currency.result}
                />

                <InfoSection
                    history={currency.history}
                    weatherData={weather.weatherData}
                    weatherLoading={weather.loading}
                    weatherError={weather.error}
                    requestWeather={weather.requestWeather}
                    range={currency.range}
                    setRange={currency.setRange}
                />
            </main>
        </div>
    );
};
