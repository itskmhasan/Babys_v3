import React from "react";

//internal imports
import Coupon from "@components/coupon/Coupon";
import PageHeader from "@components/header/PageHeader";
import { getStoreCustomizationSetting } from "@services/SettingServices";

export const metadata = {
  title: "Offers",
  description:
    "Discover the latest offers and discounts available at Kachabazar.",
  keywords: ["offers", "discounts", "promotions", "sales"],
};

const Offers = async () => {
  const { storeCustomizationSetting } = await getStoreCustomizationSetting();
  return (
    <div className="dark:bg-zinc-900">
      <PageHeader
        headerBg={storeCustomizationSetting?.offers?.header_bg}
        title={storeCustomizationSetting?.offers?.title}
      />

      <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:py-20 sm:px-10">
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          <Coupon />
        </div>
      </div>
    </div>
  );
};

export default Offers;
