const UF_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

/**
 * Convierte la fecha de la serie de mindicador (ISO en UTC) a una fecha
 * calendario estable. El string "YYYY-MM-DD" ya representa el día local
 * en Chile, por lo que nunca debe reinterpretarse como un instante UTC.
 */
function toCalendarDate(fecha: string): Date | null {
    const match = UF_DATE_PATTERN.exec(fecha);
    if (!match) return null;

    const [, year, month, day] = match;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatUfDate(fecha: string): string {
    const date = toCalendarDate(fecha);
    if (!date) return '';

    return date.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}

export function formatUfShortDate(fecha: string): string {
    const date = toCalendarDate(fecha);
    if (!date) return '';

    return date.toLocaleDateString('es-CL', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
    });
}

export function getTodayISO(): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Santiago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
}

export function formatNumericDate(fecha: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(fecha);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
}

export function formatMonthYear(fecha: string): string {
    const date = toCalendarDate(fecha);
    if (!date) return '';

    return date.toLocaleDateString('es-CL', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });
}
