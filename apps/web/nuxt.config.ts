// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Extend the shared layers: base (Tailwind, i18n, Pinia, VueUse, VeeValidate, Icon, jsPDF, xlsx, …)
  // and ui (shared components, e.g. VButton)
  extends: ["../../packages/base", "../../packages/ui"],

  i18n: {
    // Override in production via the NUXT_PUBLIC_I18N_BASE_URL env var
    baseUrl: "http://localhost:3000",
  },

  app: {
    head: {
      titleTemplate: "%s",
    },
  },
});
