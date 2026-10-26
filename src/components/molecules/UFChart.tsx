import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    type ScriptableContext,
} from 'chart.js';
import { crosshairPlugin } from './ChartPlugins';
import { formatUfShortDate } from '../../lib/date';
import type { UFData } from '../../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    crosshairPlugin
);

interface UFChartProps {
    history: UFData[];
}

const valueFormatter = new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const UFChart: React.FC<UFChartProps> = ({ history }) => {
    const chartData = {
        labels: history.map((item) => formatUfShortDate(item.fecha)),
        datasets: [{
            data: history.map((item) => item.valor),
            borderColor: '#22c55e',
            borderWidth: 2,
            fill: true,
            backgroundColor: (context: ScriptableContext<'line'>) => {
                const chart = context.chart;
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;

                if (!chartArea) {
                    return 'rgba(34, 197, 94, 0.2)';
                }

                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, 'rgba(34, 197, 94, 0.5)');
                gradient.addColorStop(0.8, 'rgba(34, 197, 94, 0.1)');
                gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
                return gradient;
            },
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#22c55e',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: { display: false as const },
            tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#1e293b',
                bodyColor: '#0f172a',
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
                titleFont: {
                    size: 13,
                    family: "'Inter', sans-serif",
                    weight: 'normal' as const
                },
                bodyFont: {
                    size: 14,
                    family: "'Inter', sans-serif",
                    weight: 'bold' as const
                },
                callbacks: {
                    title: (context: any) => context[0].label,
                    label: (context: any) => valueFormatter.format(context.raw),
                },
                borderColor: '#e2e8f0',
                borderWidth: 1,
            },
            crosshair: true,
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 10 },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6
                },
                border: { display: false }
            },
            y: {
                display: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 10 },
                    maxTicksLimit: 5,
                    callback: (value: any) => new Intl.NumberFormat('es-CL').format(value)
                },
                border: { display: false }
            }
        }
    };

    const first = history[0];
    const last = history[history.length - 1];
    const ariaLabel = first && last
        ? `Evolución del valor de la UF: desde ${valueFormatter.format(first.valor)} el ${formatUfShortDate(first.fecha)} hasta ${valueFormatter.format(last.valor)} el ${formatUfShortDate(last.fecha)}.`
        : 'Evolución del valor de la UF.';

    return (
        <div role="img" aria-label={ariaLabel} className="h-full w-full">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default UFChart;
