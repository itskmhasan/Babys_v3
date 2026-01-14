import React from "react";

//internal import
import PageHeader from "@components/header/PageHeader";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getStoreCustomizationSetting } from "@services/SettingServices";

export const metadata = {
  title: "Terms and Conditions | Kachabazar",
  description:
    "Read our terms and conditions to understand your rights and obligations.",
  keywords: ["terms", "conditions", "user rights", "legal"],
  // You can also add more advanced metadata here
  openGraph: {
    title: "Terms and Conditions | Kachabazar",
    description:
      "Read our terms and conditions to understand your rights and obligations.",
    url: "https://kachabazar-store-nine.vercel.app/terms-and-conditions",
    images: [
      {
        url: "https://kachabazar-store-nine.vercel.app/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Terms and Conditions Page",
      },
    ],
  },
};

const TermsAndConditions = async () => {
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();

  const terms_and_conditions = storeCustomizationSetting?.term_and_condition;

  // console.log("storeCustomizationSetting", storeCustomizationSetting);

  return (
    <div className="">
      <PageHeader
        headerBg={terms_and_conditions?.header_bg}
        title={terms_and_conditions?.title}
      />

      <div className="bg-white dark:bg-zinc-900 dark:text-gray-300">
        <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-3 sm:px-10">
          <CMSkeletonTwo
            html
            count={15}
            height={15}
            error={error}
            loading={false}
            data={terms_and_conditions?.description}
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

export default TermsAndConditions;
