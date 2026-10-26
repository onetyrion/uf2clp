import type { UFData } from '../services/api';

const UF_API_URL = 'https://mindicador.cl/api/uf';

interface RawUF {
    valor?: unknown;
    fecha?: unknown;
}

/**
 * Obtiene el valor vigente de la UF en tiempo de build para que el HTML
 * servido incluya el dato (SEO + first paint). Si la API falla, el cliente
 * lo vuelve a intentar, por lo que un fallo aquí no rompe el build.
 */
export async function fetchCurrentUF(): Promise<UFData | null> {
    try {
        const response = await fetch(UF_API_URL, {
            headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
            console.error(`[uf] La API respondió ${response.status}`);
            return null;
        }

        const data = await response.json();
        const current = data?.serie?.[0];

        if (
            !current ||
            typeof current.valor !== 'number' ||
            typeof current.fecha !== 'string'
        ) {
            console.error('[uf] Respuesta inesperada de la API');
            return null;
        }

        return { valor: current.valor, fecha: current.fecha };
    } catch (error) {
        console.error('[uf] No se pudo obtener el valor en build:', error);
        return null;
    }
}

/**
 * Obtiene la serie histórica de la UF para un año. Devuelve los valores
 * ordenados de más nuevo a más antiguo o null si la API falla, para que un
 * error de red nunca interrumpa el build.
 */
export async function fetchUFYear(year: number): Promise<UFData[] | null> {
    try {
        const response = await fetch(`${UF_API_URL}/${year}`, {
            headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
            console.error(`[uf] La API respondió ${response.status} para ${year}`);
            return null;
        }

        const data = await response.json();
        const serie = data?.serie;

        if (!Array.isArray(serie)) {
            console.error(`[uf] Respuesta inesperada de la API para ${year}`);
            return null;
        }

        const values = serie
            .filter(
                (item: RawUF): item is { valor: number; fecha: string } =>
                    typeof item?.valor === 'number' && typeof item?.fecha === 'string',
            )
            .map((item) => ({ valor: item.valor, fecha: item.fecha }))
            .sort((a, b) => b.fecha.localeCompare(a.fecha));

        if (values.length === 0) {
            console.error(`[uf] La serie de ${year} no contiene valores válidos`);
            return null;
        }

        return values;
    } catch (error) {
        console.error(`[uf] No se pudo obtener el historial de ${year}:`, error);
        return null;
    }
}

/**
 * Busca el valor de la UF para una fecha calendario (YYYY-MM-DD). El Banco
 * Central publica los valores con anticipación, así que esto también sirve
 * para consultar el valor de mañana.
 */
export async function fetchUFByDate(date: string): Promise<UFData | null> {
    const year = Number(date.slice(0, 4));
    if (!Number.isInteger(year)) return null;

    const serie = await fetchUFYear(year);
    return serie?.find((item) => item.fecha.slice(0, 10) === date) ?? null;
}
