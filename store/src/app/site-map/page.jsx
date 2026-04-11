import Link from "next/link";

import PageHeader from "@components/header/PageHeader";

export const metadata = {
  title: "Sitemap",
  description: "Browse the main pages and shopping destinations across the Babys store.",
};

const sitemapSections = [
  {
    title: "Shop",
    links: [
      { label: "Shop All Products", href: "/shop" },
      { label: "Offers", href: "/offers" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Pregnancy Calculator", href: "/pregnancy-calculator" },
      { label: "BMI Calculator", href: "/bmi-calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms and Conditions", href: "/terms-and-conditions" },
      { label: "XML Sitemap", href: "/sitemap.xml" },
    ],
  },
];

const SiteMapPage = async () => {
  return (
    <div>
      <PageHeader
        title={{ en: "Sitemap", de: "Sitemap" }}
        headerBg="/page-header-bg.jpg"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 py-10 lg:py-14">
          <div className="max-w-3xl mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Browse the store</h1>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Use this page to jump to key store sections, shopping pages, tools,
              and support pages.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {sitemapSections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-3 text-base text-gray-700">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-emerald-600">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMapPage;
