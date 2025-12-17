import { useState, useEffect, useMemo } from 'react';
import { APIService, type UFData } from '../services/api';

export function useCurrency() {
    const [ufValue, setUfValue] = useState<number>(0);
    const [history, setHistory] = useState<UFData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number | ''>(1);
    const [isUfToClp, setIsUfToClp] = useState(true);
    const [dateStr, setDateStr] = useState('');

    useEffect(() => {
        setLoading(true);
        setError(null);
        APIService.getUF().then(data => {
            const current = data.serie[0];
            setUfValue(current.valor);
            setHistory(data.serie.slice(0, 10).reverse());
            setDateStr(new Date(current.fecha).toLocaleDateString('es-CL', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            }));
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setError("Error al obtener valor UF");
            setLoading(false);
        });
    }, []);

    const result = useMemo(() => {
        const numAmount = Number(amount);
        if (!numAmount || !ufValue) {
            return isUfToClp ? '$ 0' : '0.00 UF';
        }

        return isUfToClp
            ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(numAmount * ufValue)
            : (numAmount / ufValue).toFixed(2) + ' UF';
    }, [amount, ufValue, isUfToClp]);

    const formattedUF = useMemo(() => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(ufValue);
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
        error
    };
}
