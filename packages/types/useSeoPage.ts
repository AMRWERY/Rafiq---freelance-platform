export interface SeoPageOptions {
  /** Short page title. The app's `titleTemplate` (see nuxt.config `app.head`) appends the site name. */
  title: string;
  description: string;
  /** Absolute URL or path under /public. Omit to leave OG/Twitter image unset. */
  image?: string;
  type?: "website" | "article" | "profile";
  /** Pages with private/user-specific content (dashboards, auth forms, …) should opt out of indexing. */
  noindex?: boolean;
}