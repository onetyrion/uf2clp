export interface UFData {
    valor: number;
    fecha: string;
}

export interface UFResponse {
    serie: UFData[];
}

export interface WeatherData {
    temp: number;
    desc: string;
    city: string;
    icon: string;
    humidity: number;
}

export const APIService = {
    async getUF(): Promise<UFResponse> {
        const res = await fetch('https://mindicador.cl/api/uf');
        if (!res.ok) throw new Error('Failed to fetch UF data');
        return res.json();
    },

    async getWeather(lat: number, lon: number): Promise<WeatherData> {
        const apiKey = import.meta.env.PUBLIC_WEATHER_API_KEY;

        if (!apiKey) {
            throw new Error('Weather API Key is missing. Please add PUBLIC_WEATHER_API_KEY to your .env file.');
        }

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`);
        if (!res.ok) throw new Error('Failed to fetch weather data');
        const data = await res.json();

        return {
            temp: data.main.temp,
            desc: data.weather[0].description,
            city: data.name,
            icon: data.weather[0].icon,
            humidity: data.main.humidity
        };
    }
};
