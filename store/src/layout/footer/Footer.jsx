import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  XIcon,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  WhatsappIcon,
} from "react-share";

//internal imports

import useUtilsFunction from "@hooks/useUtilsFunction";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getUserServerSession } from "@lib/auth-server";

const Footer = async ({ error, storeCustomizationSetting }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const footer = storeCustomizationSetting?.footer;
  const userInfo = await getUserServerSession();

  // console.log("userInfo", userInfo);

  return (
    <div className="pb-16 lg:pb-0 xl:pb-0 bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <div className="grid grid-cols-2 md:grid-cols-7 xl:grid-cols-12 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 py-10 lg:py-16 justify-between">
          {footer?.block1_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5">
                <CMSkeletonTwo
                  count={1}
                  height={20}
                  // error={error}
                  loading={false}
                  data={footer?.block1_title}
                />
              </h3>
              <ul className="text-sm flex flex-col space-y-3">
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block1_sub_link1}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block1_sub_title1}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block1_sub_link2}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block1_sub_title2}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block1_sub_link3}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    {showingTranslateValue(
                      storeCustomizationSetting?.footer_block_one_link_three_title
                    )}
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block1_sub_title3}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block1_sub_link4}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block1_sub_title4}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {footer?.block2_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5">
                <CMSkeletonTwo
                  count={1}
                  height={20}
                  // error={error}
                  loading={false}
                  data={footer?.block2_title}
                />
              </h3>
              <ul className="text-sm lg:text-15px flex flex-col space-y-3">
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block2_sub_link1}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block2_sub_title1}
                    />
                  </Link>
                </li>

                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block2_sub_link2}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block2_sub_title2}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block2_sub_link3}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block2_sub_title3}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block2_sub_link4}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block2_sub_title4}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {footer?.block3_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5">
                <CMSkeletonTwo
                  count={1}
                  height={20}
                  // error={error}
                  loading={false}
                  data={footer?.block3_title}
                />
              </h3>
              <ul className="text-sm lg:text-15px flex flex-col space-y-3">
                <li className="flex items-baseline">
                  <Link
                    href={`${userInfo?.email ? footer?.block3_sub_link1 : "#"}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block3_sub_title1}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${userInfo?.email ? footer?.block3_sub_link2 : "#"}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block3_sub_title2}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${userInfo?.email ? footer?.block3_sub_link3 : "#"}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block3_sub_title3}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${userInfo?.email ? footer?.block3_sub_link4 : "#"}`}
                    className="text-gray-600 inline-block w-full hover:text-emerald-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block3_sub_title4}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {footer?.block4_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <Link
                href="/"
                className="mr-3 lg:mr-12 xl:mr-12"
                rel="noreferrer"
              >
                <div className="relative w-32 h-10">
                  <Image
                    // width={110}
                    // height={40}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-full h-auto"
                    src={footer?.block4_logo || "/logo/logo-color.svg"}
                    alt="logo"
                  />
                </div>
              </Link>
              <p className="leading-7 font-sans text-sm text-gray-600 mt-3">
                <CMSkeletonTwo
                  count={1}
                  height={10}
                  // error={error}
                  loading={false}
                  data={footer?.block4_address}
                />
                <br />
                <span> Tel : {footer?.block4_phone}</span>
                <br />
                <span> Email : {footer?.block4_email}</span>
              </p>
            </div>
          )}
        </div>

        <hr className="hr-line"></hr>

        <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 bg-gray-50 shadow-sm border border-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 py-8 items-center justify-between">
            <div className="col-span-1">
              {footer?.social_links_status && (
                <div>
                  {(footer?.social_facebook ||
                    footer?.social_twitter ||
                    footer?.social_pinterest ||
                    footer?.social_linkedin ||
                    footer?.social_whatsapp) && (
                    <span className="text-base leading-7 font-medium block mb-2 pb-0.5">
                      Follow Us
                    </span>
                  )}
                  <ul className="text-sm flex">
                    {footer?.social_facebook && (
                      <li className="flex items-center mr-3 transition ease-in-out duration-500">
                        <Link
                          href={`${footer?.social_facebook}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-gray-500 hover:text-white"
                        >
                          <FacebookIcon size={34} round />
                        </Link>
                      </li>
                    )}
                    {footer?.social_twitter && (
                      <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <Link
                          href={`${footer?.social_twitter}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-gray-500 hover:text-white"
                        >
                          <XIcon size={34} round />
                        </Link>
                      </li>
                    )}
                    {footer?.social_pinterest && (
                      <li className="flex items-center mr-3 transition ease-in-out duration-500">
                        <Link
                          href={`${footer?.social_pinterest}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-gray-500 hover:text-white"
                        >
                          <PinterestIcon size={34} round />
                        </Link>
                      </li>
                    )}
                    {footer?.social_linkedin && (
                      <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <Link
                          href={`${footer?.social_linkedin}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-gray-500 hover:text-white"
                        >
                          <LinkedinIcon size={34} round />
                        </Link>
                      </li>
                    )}
                    {footer?.social_whatsapp && (
                      <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <Link
                          href={`${footer?.social_whatsapp}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-gray-500 hover:text-white"
                        >
                          <WhatsappIcon size={34} round />
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="col-span-1 text-center hidden lg:block md:block">
              {footer?.bottom_contact_status && (
                <div>
                  <p className="text-base leading-7 font-medium block">
                    Call Us
                  </p>
                  <h5 className="text-2xl font-bold text-emerald-500 leading-7">
                    {/* +012345-67900 */}
                    {footer?.bottom_contact}
                  </h5>
                </div>
              )}
            </div>
            {footer?.payment_method_status && (
              <div className="col-span-1 hidden lg:block md:block">
                <ul className="lg:text-right">
                  <li className="px-1 mb-2 md:mb-0 transition hover:opacity-80 inline-flex">
                    <Image
                      width={274}
                      height={85}
                      className="w-full"
                      src={
                        footer?.payment_method_img ||
                        "/payment-method/payment-logo.png"
                      }
                      alt="payment method"
                    />
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 flex justify-center py-4">
        <p className="text-sm text-gray-500 leading-6">
          Copyright {new Date().getFullYear()} @{" "}
          <Link
            href="https://themeforest.net/user/htmllover"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-500"
          >
            HtmlLover
          </Link>
          , All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
