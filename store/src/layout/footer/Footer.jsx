import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMail } from "react-icons/fi";
import {
  FaFacebookF,
  FaXTwitter,
  FaPinterestP,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

//internal imports

import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getUserServerSession } from "@lib/auth-server";

const Footer = async ({ error, storeCustomizationSetting }) => {
  const footer = storeCustomizationSetting?.footer;
  const userInfo = await getUserServerSession();

  // console.log("userInfo", userInfo);

  return (
    <div className="bg-gray-100 border-t border-gray-200">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 py-12 lg:py-14">
        {footer?.block4_status && (
          <div className="pb-8 mb-8 border-b border-gray-300">
            <Link href="/" className="inline-block" rel="noreferrer">
              <div className="relative w-44 h-14">
                <Image
                  width={176}
                  height={56}
                  className="w-full h-auto object-contain"
                  src={footer?.block4_logo || "/logo/logo-color.svg"}
                  alt="logo"
                />
                <br></br>
              </div>
            </Link>

            <h3 className="mt-4 text-base text-gray-800 max-w-3xl leading-8">
              <CMSkeletonTwo
                count={1}
                height={12}
                loading={false}
                data={footer?.block4_address}
              />
            </h3>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {footer?.block1_status && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-5">
                <CMSkeletonTwo count={1} height={20} loading={false} data={footer?.block1_title} />
              </h3>
              <ul className="space-y-3 text-lg text-gray-800">
                <li>
                  <Link href={`${footer?.block1_sub_link1}`} className="hover:text-gray-600">
                    <CMSkeletonTwo count={1} height={10} loading={false} data={footer?.block1_sub_title1} />
                  </Link>
                </li>
                <li>
                  <Link href={`${footer?.block1_sub_link2}`} className="hover:text-gray-600">
                    <CMSkeletonTwo count={1} height={10} loading={false} data={footer?.block1_sub_title2} />
                  </Link>
                </li>
                <li>
                  <Link href={`${footer?.block1_sub_link3}`} className="hover:text-gray-600">
                    <CMSkeletonTwo count={1} height={10} loading={false} data={footer?.block1_sub_title3} />
                  </Link>
                </li>
                <li>
                  <Link href={`${footer?.block1_sub_link4}`} className="hover:text-gray-600">
                    <CMSkeletonTwo count={1} height={10} loading={false} data={footer?.block1_sub_title4} />
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {(footer?.block2_status || footer?.block3_status) && (
            <div>
              {footer?.block2_status && (
                <>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-5">
                    <CMSkeletonTwo count={1} height={20} loading={false} data={footer?.block2_title} />
                  </h3>
                  <ul className="space-y-3 text-lg text-gray-800">
                    <li>
                      <Link href={`${footer?.block2_sub_link1}`} className="hover:text-gray-600">
                        <CMSkeletonTwo count={1} height={10} loading={false} data={footer?.block2_sub_title1} />
                      </Link>
                    </li>
                    <li>
                      <Link href={`${footer?.block2_sub_link2}`} className="hover:text-gray-600">
                        <CMSkeletonTwo count={1} height={10} loading={false} data={footer?.block2_sub_title2} />
                      </Link>
                    </li>
                    <li>
                      <Link href={`${footer?.block2_sub_link3}`} className="hover:text-gray-600">
                        <CMSkeletonTwo count={1} height={10} loading={false} data={footer?.block2_sub_title3} />
                      </Link>
                    </li>
                    <li>
                      <Link href={`${footer?.block2_sub_link4}`} className="hover:text-gray-600">
                        <CMSkeletonTwo count={1} height={10} loading={false} data={footer?.block2_sub_title4} />
                      </Link>
                    </li>
                  </ul>
                </>
              )}

              {footer?.block3_status && (
                <div className={`${footer?.block2_status ? "mt-6" : ""}`}>
                  {!footer?.block2_status && (
                    <h3 className="text-2xl font-semibold text-gray-900 mb-5">
                      <CMSkeletonTwo
                        count={1}
                        height={20}
                        loading={false}
                        data={footer?.block3_title}
                      />
                    </h3>
                  )}
                  <ul className="space-y-3 text-lg text-gray-800">
                    <li>
                      <Link
                        href={`${userInfo?.email ? footer?.block3_sub_link1 : "#"}`}
                        className="hover:text-gray-600"
                      >
                        <CMSkeletonTwo
                          count={1}
                          height={10}
                          loading={false}
                          data={footer?.block3_sub_title1}
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`${userInfo?.email ? footer?.block3_sub_link2 : "#"}`}
                        className="hover:text-gray-600"
                      >
                        <CMSkeletonTwo
                          count={1}
                          height={10}
                          loading={false}
                          data={footer?.block3_sub_title2}
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`${userInfo?.email ? footer?.block3_sub_link3 : "#"}`}
                        className="hover:text-gray-600"
                      >
                        <CMSkeletonTwo
                          count={1}
                          height={10}
                          loading={false}
                          data={footer?.block3_sub_title3}
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`${userInfo?.email ? footer?.block3_sub_link4 : "#"}`}
                        className="hover:text-gray-600"
                      >
                        <CMSkeletonTwo
                          count={1}
                          height={10}
                          loading={false}
                          data={footer?.block3_sub_title4}
                        />
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-5">Get in touch</h3>
            {footer?.block4_email && (
              <Link
                href={`mailto:${footer?.block4_email}`}
                className="inline-flex items-center gap-2 text-lg text-gray-800 hover:text-gray-600"
              >
                <FiMail className="w-5 h-5" />
                <span>Email us</span>
              </Link>
            )}

            {(footer?.block4_address || footer?.block4_phone) && (
              <div className="mt-4 text-sm leading-7 text-gray-700 max-w-sm">
                {footer?.block4_address && (
                  <p>
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block4_address}
                    />
                  </p>
                )}
                {footer?.block4_phone && <p className="mt-1">{footer?.block4_phone}</p>}
              </div>
            )}

            {(footer?.social_links_status &&
              (footer?.social_facebook ||
                footer?.social_twitter ||
                footer?.social_pinterest ||
                footer?.social_linkedin ||
                footer?.social_whatsapp)) && (
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Follow us</h4>
                <ul className="flex items-center gap-4 text-gray-800">
                  {footer?.social_facebook && (
                    <li>
                      <Link
                        href={`${footer?.social_facebook}`}
                        aria-label="Facebook"
                        rel="noreferrer"
                        target="_blank"
                        className="hover:text-gray-600"
                      >
                        <FaFacebookF size={28} />
                      </Link>
                    </li>
                  )}
                  {footer?.social_twitter && (
                    <li>
                      <Link
                        href={`${footer?.social_twitter}`}
                        aria-label="Twitter"
                        rel="noreferrer"
                        target="_blank"
                        className="hover:text-gray-600"
                      >
                        <FaXTwitter size={28} />
                      </Link>
                    </li>
                  )}
                  {footer?.social_pinterest && (
                    <li>
                      <Link
                        href={`${footer?.social_pinterest}`}
                        aria-label="Pinterest"
                        rel="noreferrer"
                        target="_blank"
                        className="hover:text-gray-600"
                      >
                        <FaPinterestP size={28} />
                      </Link>
                    </li>
                  )}
                  {footer?.social_linkedin && (
                    <li>
                      <Link
                        href={`${footer?.social_linkedin}`}
                        aria-label="LinkedIn"
                        rel="noreferrer"
                        target="_blank"
                        className="hover:text-gray-600"
                      >
                        <FaLinkedinIn size={28} />
                      </Link>
                    </li>
                  )}
                  {footer?.social_whatsapp && (
                    <li>
                      <Link
                        href={`${footer?.social_whatsapp}`}
                        aria-label="Whatsapp"
                        rel="noreferrer"
                        target="_blank"
                        className="hover:text-gray-600"
                      >
                        <FaWhatsapp size={28} />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-5">We accept</h3>
            {footer?.payment_method_status && (
              <div className="relative w-full h-44 sm:h-48 lg:h-52 p-3">
                <Image
                  fill
                  className="object-contain object-left"
                  src={footer?.payment_method_img || "/payment-method/payment-logo.png"}
                  alt="payment method"
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-300 mt-10" />

        <div className="py-6 text-center">
          <p className="text-sm leading-7 text-gray-800">
            Copyright {new Date().getFullYear()} @{" "}
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
            >
              Baby's
            </Link>
            , All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
