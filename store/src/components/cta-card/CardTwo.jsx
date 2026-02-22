import React from "react";
import Image from "next/image";
import Link from "next/link";

//internal import
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import { showingTranslateValue } from "@lib/translate";

const CardTwo = async ({}) => {
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();
  const home = storeCustomizationSetting?.home;
  return (
    <div className="w-full bg-gradient-to-r from-emerald-50 via-white to-emerald-50 shadow-md lg:px-10 lg:py-8 p-6 md:p-8 rounded-2xl border border-emerald-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 dark:border-slate-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="lg:w-3/5 w-full">
          <span className="text-xs md:text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            <CMSkeletonTwo
              count={1}
              height={16}
              error={error}
              loading={false}
              data={home?.quick_delivery_subtitle}
            />
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            <CMSkeletonTwo
              count={1}
              height={32}
              error={error}
              loading={false}
              data={home?.quick_delivery_title}
            />
          </h2>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            <CMSkeletonTwo
              count={3}
              height={18}
              error={error}
              loading={false}
              data={home?.quick_delivery_description}
            />
          </p>
          <Link
            href={`${home?.quick_delivery_link}`}
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-violet-500 via-pink-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out text-sm md:text-base"
            target="_blank"
          >
            {showingTranslateValue(home?.quick_delivery_button)}
            <span>→</span>
          </Link>
        </div>
        <div className="hidden md:flex w-1/3 justify-end items-center flex-shrink-0">
          <Image
            width={300}
            height={250}
            alt="Quick Delivery to Your Home"
            className="w-auto max-w-xs object-contain drop-shadow-lg"
            src={home?.quick_delivery_img || "/cta/delivery-boy.png"}
          />
        </div>
      </div>
    </div>
  );
};

export default CardTwo;
