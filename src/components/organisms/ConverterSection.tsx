import React, { useEffect, useRef, useState } from 'react';
import { PulseIndicator } from '../atoms/PulseIndicator';
import { Heading } from '../atoms/Typography';
import { Card } from '../atoms/Card';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { ExchangeIcon } from '../atoms/Icons';
import { ConversionResult } from '../molecules/ConversionResult';
import { formatAmountInput, parseAmountInput } from '../../lib/number';

interface ConverterSectionProps {
    loading: boolean;
    error: string | null;
    ufValue: number;
    formattedUF: string;
    dateStr: string;
    amount: number | '';
    setAmount: (val: number | '') => void;
    isUfToClp: boolean;
    toggleDirection: () => void;
    result: string;
}

export const ConverterSection: React.FC<ConverterSectionProps> = ({
    loading, error, ufValue, formattedUF, dateStr, amount, setAmount, isUfToClp, toggleDirection, result
}) => {
    const [inputValue, setInputValue] = useState(() => formatAmountInput(amount));
    const lastEmittedAmount = useRef<number | ''>(amount);

    useEffect(() => {
        if (amount !== lastEmittedAmount.current) {
            lastEmittedAmount.current = amount;
            setInputValue(formatAmountInput(amount));
        }
    }, [amount]);

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value.replace(/[^\d.,]/g, '');
        setInputValue(raw);

        const parsed = parseAmountInput(raw);
        lastEmittedAmount.current = parsed;
        setAmount(parsed);
    };

    const toggleLabel = isUfToClp
        ? 'Cambiar a conversión de pesos a UF'
        : 'Cambiar a conversión de UF a pesos';

    return (
        <section id="calculadora" className="space-y-8">
            <div>
                {error && ufValue === 0 ? (
                    <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium mb-2">
                        {error}
                    </div>
                ) : (
                    <>
                        {!loading && <PulseIndicator label="VALOR OFICIAL" />}
                        <Heading as="h1">
                            <span className="block text-sm font-bold uppercase tracking-[0.2em] text-blue-400 mb-3">
                                UF a pesos · valor hoy
                            </span>
                            {loading ? <span className="opacity-50">Cargando...</span> : <span>{formattedUF}</span>}
                        </Heading>
                        <p className="text-slate-400 capitalize">{dateStr}</p>
                        <p className="mt-1 text-xs text-slate-400">
                            Actualizado {import.meta.env.PUBLIC_BUILD_TIME} · Fuente:{' '}
                            <a
                                href="https://mindicador.cl/uf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-400 transition-colors"
                            >
                                mindicador.cl
                            </a>{' '}
                            · Banco Central de Chile
                        </p>
                        {error && ufValue > 0 && (
                            <p role="alert" className="mt-2 text-xs text-amber-500">
                                No se pudo actualizar el valor. Mostrando el último dato disponible.
                            </p>
                        )}
                    </>
                )}
            </div>

            <Card className="p-8 shadow-2xl">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-400 uppercase">
                            {isUfToClp ? 'UF a Pesos' : 'Pesos a UF'}
                        </span>
                        <Button
                            type="button"
                            variant="primary"
                            aria-label={toggleLabel}
                            title={toggleLabel}
                            className="bg-blue-600 text-white rounded-2xl hover:rotate-180 transition-transform duration-500 shadow-lg shadow-blue-500/30 w-auto h-auto p-3"
                            onClick={toggleDirection}
                        >
                            <ExchangeIcon className="h-6 w-6" />
                        </Button>
                    </div>

                    <Input
                        id="monto"
                        inputMode="decimal"
                        pattern="[0-9.,]*"
                        spellCheck={false}
                        aria-label={isUfToClp ? 'Monto en UF' : 'Monto en pesos chilenos'}
                        aria-describedby="resultado"
                        value={inputValue}
                        onChange={handleAmountChange}
                        onBlur={() => setInputValue(formatAmountInput(amount))}
                    />

                    <ConversionResult value={result} />
                </div>
            </Card>
        </section>
    );
};
