const clpFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const usdFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export function formatClp(value: number): string {
    return clpFormatter.format(value);
}

export function formatUsd(value: number): string {
    return usdFormatter.format(value);
}

export function formatNumber(value: number, digits = 2): string {
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: digits }).format(value);
}

export function formatPercent(value: number): string {
    return `${formatNumber(value)}%`;
}
