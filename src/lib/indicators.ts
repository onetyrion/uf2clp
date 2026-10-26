import type { UFData } from '../services/api';

export interface IndicatorQuote {
    codigo: string;
    nombre: string;
    unidad_medida: string;
    fecha: string;
    valor: number;
    serie: UFData[];
}

interface RawPoint {
    valor?: unknown;
    fecha?: unknown;
}

const API_BASE = 'https://mindicador.cl/api';
const cache = new Map<string, Promise<unknown>>();

function parseSerie(serie: unknown): UFData[] | null {
    if (!Array.isArray(serie)) return null;

    const values = serie
        .filter(
            (item: RawPoint): item is { valor: number; fecha: string } =>
                typeof item?.valor === 'number' && typeof item?.fecha === 'string',
        )
        .map((item) => ({ valor: item.valor, fecha: item.fecha }))
        .sort((a, b) => b.fecha.localeCompare(a.fecha));

    return values.length > 0 ? values : null;
}

async function fetchJson(url: string): Promise<any | null> {
    try {
        const response = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!response.ok) {
            console.error(`[indicadores] La API respondió ${response.status} para ${url}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`[indicadores] No se pudo consultar ${url}:`, error);
        return null;
    }
}

export function fetchIndicator(slug: string): Promise<IndicatorQuote | null> {
    const key = `quote:${slug}`;

    if (!cache.has(key)) {
        cache.set(key, (async () => {
            const data = await fetchJson(`${API_BASE}/${slug}`);
            const serie = parseSerie(data?.serie);
            if (!data || !serie) return null;

            return {
                codigo: String(data.codigo ?? slug),
                nombre: String(data.nombre ?? slug),
                unidad_medida: String(data.unidad_medida ?? ''),
                fecha: serie[0].fecha,
                valor: serie[0].valor,
                serie,
            } satisfies IndicatorQuote;
        })());
    }

    return cache.get(key) as Promise<IndicatorQuote | null>;
}

export function fetchIndicatorYear(slug: string, year: number): Promise<UFData[] | null> {
    const key = `year:${slug}:${year}`;

    if (!cache.has(key)) {
        cache.set(key, (async () => {
            const data = await fetchJson(`${API_BASE}/${slug}/${year}`);
            return parseSerie(data?.serie);
        })());
    }

    return cache.get(key) as Promise<UFData[] | null>;
}
