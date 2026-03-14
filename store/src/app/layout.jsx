//internal imports
import React from "react";
import Script from "next/script";
import "@styles/custom.css";
import Providers from "./provider";
import Navbar from "@layout/navbar/Navbar";
import Footer from "@layout/footer/Footer";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
import FeatureCard from "@components/feature-card/FeatureCard";
import GoogleTagPageView from "@components/analytics/GoogleTagPageView";
import {
  getStoreSetting,
  getGlobalSetting,
  getStoreCustomizationSetting,
} from "@services/SettingServices";
import { storeCustomization as fallbackStoreCustomization } from "@utils/storeCustomizationSetting";

import { SettingProvider } from "@context/SettingContext";

export async function generateMetadata() {
  const { storeCustomizationSetting } = await getStoreCustomizationSetting();
  const resolvedStoreCustomization =
    storeCustomizationSetting || fallbackStoreCustomization;
  const favicon = resolvedStoreCustomization?.seo?.favicon || "/favicon.png";

  return {
    title: "Babys | Best Shop for Moms and Babies - e-commerce Store",
    description:
      "Babys - Best Shop for Moms and Babies. Premium products for mothers and babies with fast delivery and special offers.",
    icons: {
      icon: [{ url: favicon }],
      shortcut: [{ url: favicon }],
      apple: [{ url: favicon }],
    },
  };
}

export default async function RootLayout({ children }) {
  const { globalSetting } = await getGlobalSetting();
  const { storeSetting } = await getStoreSetting();

  const googleTagId =
    storeSetting?.google_analytic_status && storeSetting?.google_analytic_key
      ? storeSetting.google_analytic_key
      : process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;

  // Fetch all customization data at once (adjust your API to return full data)
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();
  const resolvedStoreCustomization =
    storeCustomizationSetting || fallbackStoreCustomization;

  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-white antialiased dark:bg-zinc-900"
      >
        {googleTagId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
              strategy="afterInteractive"
            />
            <Script id="google-tag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${googleTagId}');
              `}
            </Script>
            <GoogleTagPageView tagId={googleTagId} />
          </>
        ) : null}
        <div>
          <SettingProvider
            initialGlobalSetting={globalSetting}
            initialStoreSetting={storeSetting}
            initialCustomizationSetting={resolvedStoreCustomization}
          >
            <Providers storeSetting={storeSetting}>
              <Navbar
                globalSetting={globalSetting}
                storeCustomization={resolvedStoreCustomization}
              />
              <main className="bg-gray-50 dark:bg-zinc-900 z-10">
                {children}
              </main>
              {/* <div className="bg-gray-50 dark:bg-zinc-900 z-10">{children}</div> */}
              {/* <MobileFooter globalSetting={globalSetting} /> */}
              <div className="w-full">
                <FooterTop
                  error={resolvedStoreCustomization ? null : error}
                  storeCustomizationSetting={resolvedStoreCustomization}
                />
                <div className="hidden relative  lg:block mx-auto max-w-screen-2xl py-6 px-3 sm:px-10">
                  <FeatureCard
                    storeCustomizationSetting={resolvedStoreCustomization}
                  />
                </div>
                <hr className="hr-line"></hr>
                <div className="border-t border-gray-100 w-full">
                  <Footer
                    error={resolvedStoreCustomization ? null : error}
                    storeCustomizationSetting={resolvedStoreCustomization}
                  />
                </div>
              </div>
            </Providers>
          </SettingProvider>
        </div>
      </body>
    </html>
  );
}
