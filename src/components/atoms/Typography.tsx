import React from 'react';
import { cn } from './Card';

export const Heading = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <h2 className={cn("text-5xl md:text-6xl font-extrabold mb-2 tracking-tight text-slate-900 dark:text-white", className)}>
        {children}
    </h2>
);

export const Subheading = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <h3 className={cn("text-lg font-bold mb-4 text-slate-900 dark:text-white", className)}>
        {children}
    </h3>
);

export const Label = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <span className={cn("text-sm font-semibold opacity-50 uppercase text-slate-900 dark:text-white", className)}>
        {children}
    </span>
);
