import React from 'react';
import { Card } from '../atoms/Card';

export const ContentSection = () => {
    return (
        <section className="max-w-4xl mx-auto px-6 pb-20 space-y-12 text-slate-400">

            <article className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">¿Qué es la Unidad de Fomento (UF)?</h2>
                <p className="leading-relaxed">
                    La <strong className="text-blue-400">Unidad de Fomento (UF)</strong> es una unidad de cuenta reajustable de acuerdo con la inflación, usada en Chile.
                    Su valor se actualiza diariamente basándose en la variación del Índice de Precios al Consumidor (IPC).
                    Fue creada en 1967 para proteger los ahorros de la inflación y hoy es fundamental para calcular créditos hipotecarios, arriendos, planes de salud y multas.
                </p>
            </article>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 bg-slate-900/50 border-slate-800">
                    <h3 className="text-xl font-semibold text-white mb-3">¿Para qué sirve la UF?</h3>
                    <ul className="list-disc list-inside space-y-2 marker:text-blue-500">
                        <li>Créditos Hipotecarios y de Consumo.</li>
                        <li>Contratos de Arriendo a largo plazo.</li>
                        <li>Planes de Isapre y Seguros.</li>
                        <li>Pago de Multas y Deudas.</li>
                    </ul>
                </Card>

                <Card className="p-6 bg-slate-900/50 border-slate-800">
                    <h3 className="text-xl font-semibold text-white mb-3">Valor de la UF Hoy</h3>
                    <p className="mb-4">
                        En <strong>uf2clp.cl</strong> actualizamos el valor de la UF todos los días automáticamente usando datos oficiales del Banco Central.
                        Nuestra calculadora te permite convertir de pesos chilenos a UF y viceversa de manera instantánea y precisa.
                    </p>
                </Card>
            </div>

            <article className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-white mb-1">¿Cuándo cambia el valor de la UF?</h4>
                        <p>El valor cambia todos los días. El Banco Central de Chile publica la tabla de valores mensuales basada en el IPC del mes anterior.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-1">¿Cómo usar la calculadora UF a Peso?</h4>
                        <p>Simplemente ingresa el monto en UF o Pesos en el campo de arriba. La conversión es automática y utiliza el valor oficial del día.</p>
                    </div>
                </div>
            </article>

        </section>
    );
};
