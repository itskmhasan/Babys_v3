import React from "react";

//internal import

import PageHeader from "@components/header/PageHeader";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getStoreCustomizationSetting } from "@services/SettingServices";

export const metadata = {
  title: "Privacy Policy | Kachabazar",
  description:
    "Learn about our privacy practices and how we protect your information.",
  keywords: ["privacy", "policy", "data protection", "user rights"],
  // You can also add more advanced metadata here
  openGraph: {
    title: "Privacy Policy | Kachabazar",
    description:
      "Learn about our privacy practices and how we protect your information.",
    url: "https://kachabazar-store-nine.vercel.app/privacy-policy",
    images: [
      {
        url: "https://kachabazar-store-nine.vercel.app/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Privacy Policy Page",
      },
    ],
  },
};

const PrivacyPolicy = async () => {
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();

  const privacy_policy = storeCustomizationSetting?.privacy_policy;

  return (
    <div className="">
      <PageHeader
        headerBg={privacy_policy?.header_bg}
        title={privacy_policy?.title}
      />
      <div className="bg-white dark:bg-zinc-900 dark:text-gray-300">
        <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
          <CMSkeletonTwo
            html
            count={15}
            height={15}
            error={error}
            loading={false}
            data={privacy_policy?.description}
          />
          <br />
          <CMSkeletonTwo count={15} height={15} loading={false} />
          <br />
          <CMSkeletonTwo count={15} height={15} loading={false} />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
