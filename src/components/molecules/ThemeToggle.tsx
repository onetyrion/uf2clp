import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { Button } from '../atoms/Button';
import { MoonIcon, SunIcon } from '../atoms/Icons';
import { $theme, toggleTheme, initTheme } from '../../stores/themeStore';

export const ThemeToggle = () => {
    const theme = useStore($theme);

    useEffect(() => {
        initTheme();
    }, []);

    return (
        <Button
            variant="icon"
            onClick={toggleTheme}
            className="dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 transition-colors"
            aria-label="Alternar tema"
        >
            {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-yellow-300" />
            ) : (
                <MoonIcon className="h-5 w-5 text-slate-600" />
            )}
        </Button>
    );
};
