import React from 'react';
import { cn } from './Card';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
    return (
        <input
            type="number"
            className={cn("w-full bg-transparent text-5xl font-extrabold outline-none appearance-none m-0", className)}
            placeholder="0"
            {...props}
        />
    );
};
