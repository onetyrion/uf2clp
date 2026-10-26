/**
 * Interpreta montos escritos con separadores de Chile o internacionales.
 * Acepta "1.234,56", "1,234.56", "1.234", "1,5", "0.5", etc.
 */
export function parseAmountInput(raw: string): number | '' {
    const cleaned = raw.replace(/[^\d.,]/g, '');
    if (!cleaned) return '';

    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    const lastSeparator = Math.max(lastComma, lastDot);

    if (lastSeparator === -1) {
        const value = Number(cleaned);
        return Number.isFinite(value) ? value : '';
    }

    const decimals = cleaned.slice(lastSeparator + 1);
    const integerPart = cleaned.slice(0, lastSeparator).replace(/[.,]/g, '');
    const commaCount = (cleaned.match(/,/g) ?? []).length;
    const dotCount = (cleaned.match(/\./g) ?? []).length;

    if (lastComma === -1) {
        if (dotCount > 1 || (dotCount === 1 && decimals.length === 3)) {
            const value = Number(cleaned.replace(/\./g, ''));
            return Number.isFinite(value) ? value : '';
        }
    }

    if (lastDot === -1 && commaCount > 1 && decimals.length === 3) {
        const value = Number(cleaned.replace(/,/g, ''));
        return Number.isFinite(value) ? value : '';
    }

    const value = Number(`${integerPart}.${decimals}`);
    return Number.isFinite(value) ? value : '';
}

export function formatAmountInput(value: number | ''): string {
    return value === ''
        ? ''
        : new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(value);
}
