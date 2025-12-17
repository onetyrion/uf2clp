import React from 'react';

interface ConversionResultProps {
    value: string;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({ value }) => {
    return (
        <div className="py-4 border-t border-slate-200 dark:border-white/10">
            <p className="text-sm opacity-50 mb-1">Equivale a:</p>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {value}
            </div>
        </div>
    );
};
