import { CONSENT_EVENT, CONSENT_KEY } from './lib/consent';

const GTM_ID = 'GTM-MFGCC357';
const CLARITY_ID = 'vu8xkzt2oy';

let loaded = false;

function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    const dataLayer = ((window as any).dataLayer = (window as any).dataLayer || []);
    dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const gtm = document.createElement('script');
    gtm.async = true;
    gtm.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(gtm);

    (window as any).clarity =
        (window as any).clarity ||
        function (...args: unknown[]) {
            ((window as any).clarity.q = (window as any).clarity.q || []).push(args);
        };

    const clarity = document.createElement('script');
    clarity.async = true;
    clarity.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    document.head.appendChild(clarity);
}

function getConsent(): string | null {
    try {
        return localStorage.getItem(CONSENT_KEY);
    } catch {
        return null;
    }
}

if (getConsent() === 'granted') {
    loadAnalytics();
}

window.addEventListener(CONSENT_EVENT, () => {
    if (getConsent() === 'granted') {
        loadAnalytics();
    }
});
