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

        const fetchFallback = async () => {
            try {
                // Fallback to Santiago, Chile
                const data = await APIService.getWeather(-33.4489, -70.6693);
                setWeatherData(data);
            } catch (e) {
                setError("No se pudo obtener el clima.");
            } finally {
                setLoading(false);
            }
        };

        if (!navigator.geolocation) {
            fetchFallback();
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
                    // If API fails with coords, try fallback or just show error
                    fetchFallback();
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.warn("Geolocation failed, using fallback:", err);
                fetchFallback();
            }
        );
    };

    return { weatherData, loading, error, requestWeather };
}
