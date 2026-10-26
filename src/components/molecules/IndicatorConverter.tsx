import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../atoms/Card';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { ExchangeIcon } from '../atoms/Icons';
import { ConversionResult } from './ConversionResult';
import { formatAmountInput, parseAmountInput } from '../../lib/number';
import { formatClp } from '../../lib/format';

interface IndicatorConverterProps {
    unitLabel: string;
    rate: number;
}

export const IndicatorConverter: React.FC<IndicatorConverterProps> = ({ unitLabel, rate }) => {
    const [isToClp, setIsToClp] = useState(true);
    const [amount, setAmount] = useState<number | ''>(1);
    const [inputValue, setInputValue] = useState('1');
    const lastEmittedAmount = useRef<number | ''>(1);

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

    const toggleDirection = () => {
        if (amount !== '' && rate > 0) {
            const converted = isToClp
                ? Number((amount * rate).toFixed(2))
                : Number((amount / rate).toFixed(2));
            setAmount(converted);
        }
        setIsToClp(!isToClp);
    };

    const result = amount === '' || rate <= 0
        ? (isToClp ? formatClp(0) : `0,00 ${unitLabel}`)
        : isToClp
            ? formatClp(amount * rate)
            : `${new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount / rate)} ${unitLabel}`;

    const toggleLabel = isToClp
        ? `Cambiar a conversión de pesos a ${unitLabel}`
        : `Cambiar a conversión de ${unitLabel} a pesos`;

    return (
        <Card className="p-8 shadow-2xl">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-400 uppercase">
                        {isToClp ? `${unitLabel} a pesos` : `Pesos a ${unitLabel}`}
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

                <p className="text-sm text-slate-400">
                    1 {unitLabel} = <strong className="text-slate-200">{formatClp(rate)}</strong>
                </p>

                <Input
                    id={`monto-${unitLabel.toLowerCase()}`}
                    inputMode="decimal"
                    pattern="[0-9.,]*"
                    spellCheck={false}
                    aria-label={isToClp ? `Monto en ${unitLabel}` : 'Monto en pesos chilenos'}
                    aria-describedby="resultado"
                    value={inputValue}
                    onChange={handleAmountChange}
                    onBlur={() => setInputValue(formatAmountInput(amount))}
                />

                <ConversionResult value={result} />
            </div>
        </Card>
    );
};
