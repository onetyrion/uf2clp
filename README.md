# uf2clp.cl - Dashboard Inteligente PWA

Aplicación moderna para la conversión de UF a CLP y monitoreo de indicadores económicos en Chile. Construida con Astro, React y Tailwind CSS, diseñada para ser rápida, instalable (PWA) y amigable con SEO.

![UF2CLP Preview](public/favicon.svg)

## 🚀 Características Principales

### 💎 Diseño & UX
- **Atomic Design**: Arquitectura de componentes escalable y mantenible.
- **Permanent Dark Mode**: Interfaz oscura premium por defecto para menor fatiga visual.
- **Visualización de Datos Minimalista**: Gráfico de tendencia UF interactivo y limpio, con "tooltips" detallados.
- **Glassmorphism**: Estética moderna con efectos de vidrio y transiciones suaves.

### 📱 Progressive Web App (PWA)
- **Instalable**: Botón "Instalar App" integrado directamente en la interfaz.
- **Offline First**: Cacheo de assets para funcionamiento sin conexión.
- **Manifest**: Identidad de marca completa (Iconos, Colores, Nombre).

### 🔍 SEO Expert Level
- **Visibilidad Total**: Sitemap.xml y Robots.txt autogenerados.
- **Rich Results**: Datos estructurados JSON-LD (`FinanceApplication`).
- **Social**: Meta tags OpenGraph y Twitter Cards optimizados para compartir.
- **Palabras Clave**: Optimización semántica para "Calculadora UF", "Valor UF", etc.

## 🛠️ Stack Tecnológico

- **Framework**: [Astro 5](https://astro.build/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/) + React-Chartjs-2
- **State**: [Nano Stores](https://github.com/nanostores/nanostores) + Hooks Personalizados
- **PWA**: [Vite PWA](https://vite-pwa-org.netlify.app/)

## ⚙️ Instalación y Uso

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Configurar Variables de Entorno**:
    Crea un archivo `.env` en la raíz basado en `.env.example`:
    ```env
    PUBLIC_WEATHER_API_KEY=tu_api_key_de_openweathermap
    ```

3.  **Desarrollo**:
    ```bash
    npm run dev
    ```

4.  **Generar Producción**:
    ```bash
    npm run build
    ```

## 🔄 Rebuild diario (valor UF)

El valor de la UF se prerenderiza en el HTML durante el build, por lo que el sitio debe reconstruirse a diario. El workflow `.github/workflows/daily-rebuild.yml` dispara el deploy hook de Cloudflare Pages todos los días (12:10 UTC, después de la publicación diaria del indicador).

Para activarlo, crea un **Deploy Hook** en Cloudflare Pages (Settings → Builds & deployments → Deploy hooks) y guárdalo como secret del repositorio:

```
CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...
```

También se puede ejecutar manualmente desde **Actions → Daily rebuild → Run workflow**.

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── atoms/       # Buttons, Inputs, Typography
│   ├── molecules/   # ConversionResult, PWA Buttons
│   ├── organisms/   # Navbar, ConverterSection, ChartSection
│   └── templates/   # Dashboard Layouts
├── styles/          # Global styles & Tailwind
├── services/        # API integrations (Mindicador, Weather)
└── pages/           # Astro routes
```

## 👨‍💻 Créditos

Creado por [@onetyrion](https://github.com/onetyrion) &bull; 2025
