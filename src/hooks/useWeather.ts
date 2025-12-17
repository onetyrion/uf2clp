import { useState, useEffect } from 'react';
import { APIService, type WeatherData } from '../services/api';

export function useWeather() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load from cache on mount
    useEffect(() => {
        const cached = localStorage.getItem('weather_cache');
        if (cached) {
            const parsed = JSON.parse(cached);
            if ((Date.now() - parsed.timestamp) < 1800000) { // 30 mins
                setWeatherData(parsed.data);
            }
        }
    }, []);

    const requestWeather = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocalización no soportada.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const data = await APIService.getWeather(pos.coords.latitude, pos.coords.longitude);
                    setWeatherData(data);
                    localStorage.setItem('weather_cache', JSON.stringify({
                        timestamp: Date.now(),
                        data: data
                    }));
                } catch (e) {
                    console.error(e);
                    setError(e instanceof Error ? e.message : "Error al cargar clima");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error(err);
                setLoading(false);
                setError("Permiso de ubicación denegado.");
            }
        );
    };

    return { weatherData, loading, error, requestWeather };
}
