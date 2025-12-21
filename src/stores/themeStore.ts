import { atom } from 'nanostores';

export type Theme = 'light' | 'dark';

export const $theme = atom<Theme>('dark');


export function initTheme() {
    // Always force dark mode
    if (typeof document !== 'undefined') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    $theme.set('dark');
}

