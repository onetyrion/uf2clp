/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly PUBLIC_WEATHER_API_KEY: string;
    readonly PUBLIC_BUILD_COMMIT: string;
    readonly PUBLIC_BUILD_BRANCH: string;
    readonly PUBLIC_BUILD_TIME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
