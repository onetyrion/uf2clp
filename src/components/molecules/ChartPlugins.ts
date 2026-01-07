import type { Plugin } from 'chart.js';

export const crosshairPlugin: Plugin = {
    id: 'crosshair',
    afterDraw: (chart) => {
        if (chart.tooltip?.opacity && chart.tooltip.x) {
            const { ctx, chartArea: { top, bottom } } = chart;
            const x = chart.tooltip.caretX;

            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#94a3b8'; // slate-400
            ctx.stroke();
            ctx.restore();
        }
    }
};
