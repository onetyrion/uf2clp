import type { UFData } from '../services/api';

const UF_API_URL = 'https://mindicador.cl/api/uf';

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
