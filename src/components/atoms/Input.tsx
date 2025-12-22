import React from 'react';
import { cn } from './Card';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
    const valueStr = String(props.value || '');
    const length = valueStr.length;

    let fontSize = 'text-5xl';
    if (length > 18) fontSize = 'text-2xl';
    else if (length > 14) fontSize = 'text-3xl';
    else if (length > 10) fontSize = 'text-4xl';

    return (
        <input
            type="text"
            inputMode="numeric"
            className={cn("w-full bg-transparent font-extrabold outline-none appearance-none m-0 placeholder:text-slate-700/20 dark:placeholder:text-white/20 transition-all duration-200", fontSize, className)}
            placeholder="0"
            autoComplete="off"
            {...props}
        />
    );
};
