export const UF_START_YEAR = 2019;

const currentYear = Number(
    new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Santiago',
        year: 'numeric',
    }).format(new Date())
);

export const UF_CURRENT_YEAR = currentYear;

export const UF_YEARS = Array.from(
    { length: currentYear - UF_START_YEAR + 1 },
    (_, index) => UF_START_YEAR + index
);

export const UF_MONTHS = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
];

export function getMonthName(month: number): string {
    return UF_MONTHS[month - 1] ?? '';
}

export function getMonthSlug(month: number): string {
    return String(month).padStart(2, '0');
}
