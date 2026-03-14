const siteUrl =
  (process.env.NEXT_PUBLIC_STORE_DOMAIN || "https://babys.com.bd").replace(
    /\/$/,
    ""
  );

const publicRoutes = [
  "/",
  "/about-us",
  "/offers",
  "/contact-us",
  "/faq",
  "/privacy-policy",
  "/terms-and-conditions",
  "/site-map",
  "/bmi-calculator",
  "/pregnancy-calculator",
  "/search",
  "/shop",
];

export default async function sitemap() {
  const staticEntries = publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return staticEntries;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/products/show`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return staticEntries;
    }

    const products = await response.json();

    const productEntries = (Array.isArray(products) ? products : [])
      .filter((item) => item?.slug)
      .map((item) => ({
        url: `${siteUrl}/product/${item.slug}`,
        lastModified: item.updatedAt || item.createdAt || new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      }));

    return [...staticEntries, ...productEntries];
  } catch {
    return staticEntries;
  }
}
