import React from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { useWeather } from '../../hooks/useWeather';
import { ConverterSection } from '../organisms/ConverterSection';
import { InfoSection } from '../organisms/InfoSection';

export const Dashboard = () => {
    const currency = useCurrency();
    const weather = useWeather();

    return (
        <main className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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
            />
        </main>
    );
};
