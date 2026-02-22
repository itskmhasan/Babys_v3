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
      <div className="flex items-center justify-between gap-8 py-2">
        {/* Icon/Image Section */}
        <div className="hidden sm:flex items-center justify-center flex-shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center shadow-lg">
            <span className="text-3xl md:text-4xl">🚀</span>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {showingTranslateValue(home?.promotion_title)}
          </h2>
          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {showingTranslateValue(home?.promotion_description)}
          </p>
        </div>

        {/* Button Section */}
        <div className="flex-shrink-0">
          <Link
            href={`${home?.promotion_button_link}`}
            className="inline-flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3 bg-gradient-to-r from-violet-500 via-pink-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out whitespace-nowrap text-sm md:text-base"
          >
            {showingTranslateValue(home?.promotion_button_name)}
            <span>→</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Banner;
