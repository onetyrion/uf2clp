import React from 'react';
import { RefreshIcon } from '../atoms/Icons';

interface WeatherData {
    temp: number;
    desc: string;
    city: string;
    icon: string;
    humidity: number;
}

interface WeatherConditionProps {
    data: WeatherData | null;
    loading: boolean;
    onRefresh: () => void;
}

export const WeatherCondition: React.FC<WeatherConditionProps> = ({ data, loading, onRefresh }) => {
    if (!data) return null;

    return (
        <div className="flex items-center gap-3 w-full animate-in fade-in slide-in-from-bottom-2">
            <div className="p-3 bg-blue-600/10 rounded-2xl">
                <img src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} className="w-10 h-10" alt="Icono clima" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold capitalize">{data.desc}</p>
                <p className="text-xs opacity-50">Humedad: <span>{data.humidity}</span>%</p>
            </div>
            <button onClick={onRefresh} className="p-2 opacity-30 hover:opacity-100 transition-opacity" disabled={loading}>
                <RefreshIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
    );
};
