import Link from "next/link";
import React from "react";

//internal import

import { getStoreCustomizationSetting } from "@services/SettingServices";
import { showingTranslateValue } from "@lib/translate";

const Banner = async ({}) => {
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();
  const home = storeCustomizationSetting?.home;

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className=" text-xl">
            <span className="text-emerald-600 dark:text-gray-200 font-bold">
              {showingTranslateValue(home?.promotion_title)}
            </span>{" "}
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            {showingTranslateValue(home?.promotion_description)}
          </p>
        </div>
        <Link
          href={`${home?.promotion_button_link}`}
          className="text-sm  font-medium px-6 py-2 bg-emerald-500 text-center rounded-full text-white hover:bg-emerald-700"
        >
          {showingTranslateValue(home?.promotion_button_name)}
        </Link>
      </div>
    </>
  );
};

export default Banner;
