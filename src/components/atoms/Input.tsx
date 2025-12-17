import React from 'react';
import { cn } from './Card';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
    return (
        <input
            type="text"
            inputMode="numeric"
            className={cn("w-full bg-transparent text-5xl font-extrabold outline-none appearance-none m-0 placeholder:text-slate-700/20 dark:placeholder:text-white/20", className)}
            placeholder="0"
            autoComplete="off"
            {...props}
        />
    );
};
