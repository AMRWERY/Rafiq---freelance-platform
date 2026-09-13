// Public, indexable routes only — pages marked `noindex` in useSeoPage() (auth, dashboard,
// contracts, disputes, …) are intentionally left out. Add new public pages here as they ship.
const PUBLIC_ROUTES = [
  "/",
  "/projects",
  "/freelancers",
  "/blog",
  "/community",
  "/courses",
]

// Keep in sync with packages/base/nuxt.config.ts `i18n.locales`
const LOCALES = ["en", "ar"]

export default defineEventHandler((event) => {
  const { origin } = getRequestURL(event)
  setHeader(event, "Content-Type", "application/xml")

  const urls = PUBLIC_ROUTES.flatMap((path) =>
    LOCALES.map((locale) => {
      const loc = path === "/" ? `/${locale}` : `/${locale}${path}`
      const alternates = LOCALES.map(
        (altLocale) =>
          `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${origin}${path === "/" ? `/${altLocale}` : `/${altLocale}${path}`}"/>`,
      ).join("")
      return `  <url><loc>${origin}${loc}</loc><changefreq>weekly</changefreq>${alternates}</url>`
    }),
  ).join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`
})
