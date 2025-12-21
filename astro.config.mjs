// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import { VitePWA } from 'vite-plugin-pwa';

// https://astro.build/config
export default defineConfig({
  site: 'https://uf2clp.cl',
  integrations: [react(), sitemap()],

  vite: {
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'robots.txt'],
        manifest: {
          name: 'UF2CLP - Calculadora UF',
          short_name: 'UF2CLP',
          description: 'Calculadora de UF a CLP actualizada al instante.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: 'favicon.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'favicon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          navigateFallback: '/index.html'
        }
      })
    ]
  }
});