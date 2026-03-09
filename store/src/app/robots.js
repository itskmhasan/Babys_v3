const siteUrl =
  (process.env.NEXT_PUBLIC_STORE_DOMAIN || "https://babys.com.bd").replace(
    /\/$/,
    ""
  );

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
