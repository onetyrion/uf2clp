import { useState, useEffect, useMemo } from 'react';
import { APIService, type UFData } from '../services/api';

export type DateRange = '1M' | '3M' | '6M' | '1Y';

export function useCurrency() {
    const [ufValue, setUfValue] = useState<number>(0);
    const [history, setHistory] = useState<UFData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number | ''>(1);
    const [isUfToClp, setIsUfToClp] = useState(true);
    const [dateStr, setDateStr] = useState('');
    const [range, setRange] = useState<DateRange>('1M');

    const [fullHistory, setFullHistory] = useState<UFData[]>([]);

    // Initial fetch of ALL data
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch current data (last 30 days default) to get today's value quickly
                const responseDefault = await APIService.getUF();
                const currentData = responseDefault.serie;
                const current = currentData[0];
                setUfValue(current.valor);

                setDateStr(new Date(current.fecha).toLocaleDateString('es-CL', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                }));

                // 2. Fetch full history for range support (Current Year + Previous Year to support '1A')
                const currentYear = new Date().getFullYear();

                const [responseCurrent, responsePrev] = await Promise.all([
                    fetch(`https://mindicador.cl/api/uf/${currentYear}`),
                    fetch(`https://mindicador.cl/api/uf/${currentYear - 1}`)
                ]);

                if (!responseCurrent.ok || !responsePrev.ok) {
                    throw new Error('Failed to fetch historical data');
                }

                const dataCurrent = await responseCurrent.json();
                const dataPrev = await responsePrev.json();

                // Combine: [newest...oldest]
                const combinedHistory = [...dataCurrent.serie, ...dataPrev.serie];
                setFullHistory(combinedHistory);

            } catch (err) {
                console.error(err);
                setError("Error al obtener valor UF");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []); // Run ONCE on mount

    // Filter history based on selected range (derived state)
    useEffect(() => {
        if (fullHistory.length === 0) return;

        let filtered = [...fullHistory];

        if (range === '1M') {
            filtered = filtered.slice(0, 30);
        } else if (range === '3M') {
            filtered = filtered.slice(0, 90);
        } else if (range === '6M') {
            filtered = filtered.slice(0, 180);
        } else if (range === '1Y') {
            filtered = filtered.slice(0, 365);
        }

        setHistory(filtered.reverse());
    }, [range, fullHistory]);

    const result = useMemo(() => {
        const numAmount = Number(amount);
        if (!numAmount || !ufValue) {
            return isUfToClp ? '$ 0' : '0.00 UF';
        }

        if (isUfToClp) {
            return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Math.round(numAmount * ufValue));
        }
        return (numAmount / ufValue).toFixed(2) + ' UF';
    }, [amount, ufValue, isUfToClp]);

    const formattedUF = useMemo(() => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(ufValue);
    }, [ufValue]);

    return {
        ufValue,
        formattedUF,
        history,
        loading,
        amount,
        setAmount,
        isUfToClp,
        setIsUfToClp,
        result,
        dateStr,
        error,
        range,
        setRange
    };
}
