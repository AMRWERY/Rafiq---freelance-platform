import type { SeoPageOptions } from "~/types/useSeoPage";

const SITE_NAME = "Rafiq";

export function useSeoPage(options: SeoPageOptions) {
  const {
    title,
    description,
    image,
    type = "website",
    noindex = false,
  } = options;

  const route = useRoute();
  const requestURL = useRequestURL();
  const canonicalUrl = new URL(route.path, requestURL.origin).toString();
  const imageUrl = image
    ? new URL(image, requestURL.origin).toString()
    : undefined;
  const socialTitle = `${title} - ${SITE_NAME}`;

  useSeoMeta({
    title,
    description,
    ogTitle: socialTitle,
    ogDescription: description,
    ogType: type,
    ogUrl: canonicalUrl,
    ogSiteName: SITE_NAME,
    ogImage: imageUrl,
    twitterCard: imageUrl ? "summary_large_image" : "summary",
    twitterTitle: socialTitle,
    twitterDescription: description,
    twitterImage: imageUrl,
    robots: noindex ? "noindex, nofollow" : "index, follow",
  });

  const localeHead = useLocaleHead({
    dir: true,
    lang: true,
    seo: { canonicalQueries: [] },
  });

  useHead({
    htmlAttrs: computed(() => localeHead.value.htmlAttrs),
    link: computed(() => [
      ...(localeHead.value.link ?? []),
      { rel: "canonical", href: canonicalUrl },
    ]),
    meta: computed(() => localeHead.value.meta ?? []),
  });
}