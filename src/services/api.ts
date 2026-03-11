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
        const res = await fetch('/api/uf');
        if (!res.ok) throw new Error('Failed to fetch UF data');
        return res.json();
    },

    async getUFHistory(year: number): Promise<UFResponse> {
        const res = await fetch(`/api/uf?year=${year}`);
        if (!res.ok) throw new Error('Failed to fetch historical data');
        return res.json();
    },

    async getWeather(lat: number, lon: number): Promise<WeatherData> {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
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
