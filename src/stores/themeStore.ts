import { atom } from 'nanostores';

export type Theme = 'light' | 'dark';

export const $theme = atom<Theme>('dark');

export function initTheme() {
    // Always force dark mode
    $theme.set('dark');
}

export function toggleTheme() {
    const newTheme = $theme.get() === 'light' ? 'dark' : 'light';
    $theme.set(newTheme);

    if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}
