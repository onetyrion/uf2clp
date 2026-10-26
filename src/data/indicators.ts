import { UF_CURRENT_YEAR, UF_START_YEAR } from './uf-years';

export const INDICATOR_YEARS = Array.from(
    { length: UF_CURRENT_YEAR - UF_START_YEAR + 1 },
    (_, index) => UF_START_YEAR + index
);

export type IndicatorValueUnit = 'CLP' | 'USD' | 'percent';

export interface IndicatorMeta {
    slug: string;
    name: string;
    valueUnit: IndicatorValueUnit;
    frequency: 'daily' | 'monthly';
    description: string;
    source: string;
    sourceUrl: string;
}

export const INDICATORS: Record<string, IndicatorMeta> = {
    utm: {
        slug: 'utm',
        name: 'UTM',
        valueUnit: 'CLP',
        frequency: 'monthly',
        description: 'Unidad Tributaria Mensual, usada para impuestos, multas y trámites.',
        source: 'SII',
        sourceUrl: 'https://www.sii.cl/',
    },
    dolar: {
        slug: 'dolar',
        name: 'Dólar observado',
        valueUnit: 'CLP',
        frequency: 'daily',
        description: 'Tipo de cambio oficial del dólar en Chile.',
        source: 'Banco Central de Chile',
        sourceUrl: 'https://www.bcentral.cl/',
    },
    tpm: {
        slug: 'tpm',
        name: 'Tasa de política monetaria',
        valueUnit: 'percent',
        frequency: 'daily',
        description: 'Tasa de interés que fija el Banco Central para la política monetaria.',
        source: 'Banco Central de Chile',
        sourceUrl: 'https://www.bcentral.cl/',
    },
    tasa_desempleo: {
        slug: 'tasa_desempleo',
        name: 'Tasa de desempleo',
        valueUnit: 'percent',
        frequency: 'monthly',
        description: 'Porcentaje de la fuerza laboral que no encuentra empleo.',
        source: 'INE',
        sourceUrl: 'https://www.ine.gob.cl/',
    },
    imacec: {
        slug: 'imacec',
        name: 'Imacec',
        valueUnit: 'percent',
        frequency: 'monthly',
        description: 'Variación mensual de la actividad económica del país.',
        source: 'Banco Central de Chile',
        sourceUrl: 'https://www.bcentral.cl/',
    },
    libra_cobre: {
        slug: 'libra_cobre',
        name: 'Libra de cobre',
        valueUnit: 'USD',
        frequency: 'daily',
        description: 'Precio internacional del cobre en dólares por libra.',
        source: 'Banco Central de Chile',
        sourceUrl: 'https://www.bcentral.cl/',
    },
};
