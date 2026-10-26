/// <reference types="vite-plugin-pwa/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly PUBLIC_BUILD_COMMIT: string;
    readonly PUBLIC_BUILD_BRANCH: string;
    readonly PUBLIC_BUILD_TIME: string;
    readonly PUBLIC_BUILD_DATE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
