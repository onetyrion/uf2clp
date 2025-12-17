import React, { useMemo } from 'react';
import { PulseIndicator } from '../atoms/PulseIndicator';
import { Heading } from '../atoms/Typography';
import { Card } from '../atoms/Card';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { ExchangeIcon } from '../atoms/Icons';
import { ConversionResult } from '../molecules/ConversionResult';

interface ConverterSectionProps {
    loading: boolean;
    error: string | null;
    ufValue: number;
    formattedUF: string;
    dateStr: string;
    amount: number | '';
    setAmount: (val: number | '') => void;
    isUfToClp: boolean;
    setIsUfToClp: (val: boolean) => void;
    result: string;
}

export const ConverterSection: React.FC<ConverterSectionProps> = ({
    loading, error, ufValue, formattedUF, dateStr, amount, setAmount, isUfToClp, setIsUfToClp, result
}) => {
    return (
        <section className="space-y-8">
            <div>
                {!loading && !error && <PulseIndicator label="VALOR HOY" />}

                {error ? (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium mb-2">
                        {error}
                    </div>
                ) : (
                    <>
                        <Heading>
                            {loading ? <span className="opacity-20">Cargando...</span> : <span>{formattedUF}</span>}
                        </Heading>
                        <p className="opacity-60 capitalize">{dateStr}</p>
                    </>
                )}
            </div>

            <Card className="p-8 shadow-2xl">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold opacity-50 uppercase">
                            {isUfToClp ? 'UF a Pesos' : 'Pesos a UF'}
                        </span>
                        <Button
                            variant="primary"
                            className="bg-blue-600 text-white rounded-2xl hover:rotate-180 transition-transform duration-500 shadow-lg shadow-blue-500/30 w-auto h-auto p-3"
                            onClick={() => setIsUfToClp(!isUfToClp)}
                        >
                            <ExchangeIcon className="h-6 w-6" />
                        </Button>
                    </div>

                    <Input
                        value={amount === '' ? '' : new Intl.NumberFormat('es-CL').format(amount)}
                        onChange={(e) => {
                            // Remove dots and everything that is not a number
                            const cleanValue = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
                            setAmount(cleanValue === '' ? '' : Number(cleanValue));
                        }}
                    />

                    <ConversionResult value={result} />
                </div>
            </Card>
        </section>
    );
};
