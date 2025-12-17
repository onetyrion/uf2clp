import React from 'react';

export const PulseIndicator = ({ label }: { label: string }) => (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold mb-4 border border-green-500/20">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        {label}
    </div>
);
