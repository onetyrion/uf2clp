import React from 'react';
import { cn } from '../atoms/Card';

interface ConversionResultProps {
    value: string;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({ value }) => {
    const length = value.length;

    let fontSize = 'text-4xl';
    if (length > 20) fontSize = 'text-xl';
    else if (length > 16) fontSize = 'text-2xl';
    else if (length > 12) fontSize = 'text-3xl';

    return (
        <div id="resultado" role="status" aria-live="polite" aria-atomic="true" className="py-4 border-t border-slate-200 dark:border-white/10">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Equivale a:</p>
            <div className={cn("font-bold text-blue-600 dark:text-blue-400 break-words transition-all duration-200", fontSize)}>
                {value}
            </div>
        </div>
    );
};
