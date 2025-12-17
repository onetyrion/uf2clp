import React from 'react';
import { cn } from './Card';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'icon' | 'ghost';
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    className,
    ...props
}) => {
    const variants = {
        primary: "py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-sm transition-all border border-blue-600/20",
        icon: "p-3 rounded-2xl glass shadow-lg hover:scale-110 transition-transform",
        ghost: "p-2 opacity-30 hover:opacity-100 transition-opacity"
    };

    return (
        <button
            className={cn(variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};
