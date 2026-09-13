// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: [
    "@pinia/nuxt", // Load Pinia first so stores are ready before other modules
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxt/icon",
    "@vueuse/nuxt",
    "@vee-validate/nuxt",
  ],
  postcss: {
    plugins: {
      tailwindcss: {
        config: join(currentDir, "./tailwind.config.ts"),
      },
      autoprefixer: {},
    },
  },
  // VeeValidate configuration
  veeValidate: {
    autoImports: true,
  },
  i18n: {
    locales: [
      { code: "en", language: "en-US", file: "en.json", name: "English" },
      {
        code: "ar",
        language: "ar-EG",
        file: "ar.json",
        name: "العربية",
        dir: "rtl",
      },
    ],
    defaultLocale: "en",
    // Always show the locale in the URL, e.g. /en, /ar (including the default locale)
    strategy: "prefix",
    lazy: true,
    langDir: "locales",
    // Static per-environment value: a function here can't survive serialization to the
    // client runtime config (it silently becomes undefined after hydration), so each app
    // overrides this with its own dev port below and its production URL via the
    // NUXT_PUBLIC_I18N_BASE_URL env var.
    baseUrl: "http://localhost:3000",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      fallbackLocale: "en",
      redirectOn: "root",
    },
  },
  app: {
    head: {
      title: "Rafiq - Freelance Platform",
      script: [{}],
      noscript: [],
      link: [{}],
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          charset: "utf-8",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
});
