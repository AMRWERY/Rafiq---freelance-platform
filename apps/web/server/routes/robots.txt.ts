export default defineEventHandler((event) => {
  const { origin } = getRequestURL(event)
  setHeader(event, "Content-Type", "text/plain")
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n")
})
