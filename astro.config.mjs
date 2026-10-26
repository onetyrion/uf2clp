// @ts-check
import { execSync } from 'node:child_process';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import { VitePWA } from 'vite-plugin-pwa';

/** @param {string} args */
function git(args) {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

function resolveBuildInfo() {
  const commit = (process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || git('rev-parse HEAD')).slice(0, 7) || 'local';
  const branch = process.env.CF_PAGES_BRANCH || process.env.GITHUB_REF_NAME || git('rev-parse --abbrev-ref HEAD') || 'local';
  const now = new Date();
  const builtAt = now
    .toLocaleString('es-CL', {
      timeZone: 'America/Santiago',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
    .replace(',', '');
  const builtAtIso = now.toISOString();

  return { commit, branch, builtAt, builtAtIso };
}

const buildInfo = resolveBuildInfo();

// https://astro.build/config
export default defineConfig({
  site: 'https://uf2clp.cl',
  integrations: [react(), sitemap()],

  vite: {
    define: {
      'import.meta.env.PUBLIC_BUILD_COMMIT': JSON.stringify(buildInfo.commit),
      'import.meta.env.PUBLIC_BUILD_BRANCH': JSON.stringify(buildInfo.branch),
      'import.meta.env.PUBLIC_BUILD_TIME': JSON.stringify(buildInfo.builtAt),
      'import.meta.env.PUBLIC_BUILD_DATE': JSON.stringify(buildInfo.builtAtIso),
    },
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'robots.txt'],
        manifest: {
          name: 'UF2CLP - Calculadora UF',
          short_name: 'UF2CLP',
          description: 'Calculadora de UF a CLP actualizada al instante.',
          lang: 'es',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'icons/maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
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