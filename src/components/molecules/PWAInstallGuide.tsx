import React, { useEffect, useState } from 'react';
import { Card } from '../atoms/Card';

export const PWAInstallGuide = () => {
    const [isInstalled, setIsInstalled] = useState(true); // Default to true to prevent flash
    const [deviceInfo, setDeviceInfo] = useState<{ os: 'ios' | 'android' | 'desktop' | 'other', browser: string }>({ os: 'other', browser: '' });

    useEffect(() => {
        // Check if app is installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
        setIsInstalled(isStandalone);

        if (isStandalone) return;

        // Detect OS and Browser
        const ua = navigator.userAgent.toLowerCase();
        let os: 'ios' | 'android' | 'desktop' | 'other' = 'other';
        let browser = '';

        if (/iphone|ipad|ipod/.test(ua)) {
            os = 'ios';
            browser = /crios/.test(ua) ? 'Chrome' : 'Safari';
        } else if (/android/.test(ua)) {
            os = 'android';
            browser = /chrome/.test(ua) ? 'Chrome' : 'Native';
        } else if (!/mobile/.test(ua)) {
            os = 'desktop';
            browser = /chrome/.test(ua) ? 'Chrome' : 'Browser';
        }

        setDeviceInfo({ os, browser });
        setIsInstalled(false); // Show if not standalone
    }, []);

    if (isInstalled) return null;
    if (deviceInfo.os === 'desktop') return null; // Usually desktop users install via address bar icon

    return (
        <section className="max-w-4xl mx-auto px-6 mb-12">
            <Card className="p-5 border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/5">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g fill="none" fillRule="evenodd"><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L21 3" /></g></svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            Instalar App en {deviceInfo.browser} ({deviceInfo.os === 'ios' ? 'iPhone/iPad' : 'Android'})
                        </h3>

                        {deviceInfo.os === 'ios' && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Para una mejor experiencia, instala esta web como una App:
                                <br />
                                1. Presiona el botón <strong>"Compartir"</strong> <span className="inline-block align-middle"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg></span> en la barra inferior.
                                <br />
                                2. Baja y selecciona <strong>"Agregar a Inicio"</strong>.
                            </p>
                        )}

                        {deviceInfo.os === 'android' && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Instala uf2clp como una App nativa para usarla sin internet:
                                <br />
                                1. Presiona los <strong>tres puntos</strong> <span className="inline-block align-middle">⋮</span> arriba a la derecha.
                                <br />
                                2. Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                            </p>
                        )}

                        {deviceInfo.os === 'other' && (
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Instala esta página web en tu dispositivo para acceder más rápido y sin conexión. Busca la opción "Agregar a inicio" en el menú de tu navegador.
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        </section>
    );
};
