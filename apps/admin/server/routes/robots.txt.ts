// Admin panel is private — keep it out of search engines entirely, as a backstop
// to the per-page `noindex` meta set via useSeoPage().
export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "text/plain")
  return "User-agent: *\nDisallow: /\n"
})
