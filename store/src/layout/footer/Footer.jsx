import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMail } from "react-icons/fi";
import { cookies } from "next/headers";
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
  const isEnabled = (value) => value === true || value === "true";

  const showBlock1 = isEnabled(footer?.block1_status);
  const showBlock2 = isEnabled(footer?.block2_status);
  const showBlock3 = isEnabled(footer?.block3_status);
  const showBlock4 = isEnabled(footer?.block4_status);
  const showPaymentMethod = isEnabled(footer?.payment_method_status);
  const showSocialLinks = isEnabled(footer?.social_links_status);
  const showBottomContact = isEnabled(footer?.bottom_contact_status);

  const userInfo = await getUserServerSession();
  const cookieStore = await cookies();
  const lang = cookieStore.get("_lang")?.value || "en";
  const copyrightYear = new Date().getFullYear();
  const copyrightTextRaw =
    footer?.copyright_text?.[lang] ||
    footer?.copyright_text?.en ||
    "Copyright {{year}} @";
  const copyrightTextTemplate =
    copyrightTextRaw.replace(
      "{{year}}",
      String(copyrightYear)
    );

  const blockOneLinks = [
    { title: footer?.block1_sub_title1, href: footer?.block1_sub_link1 },
    { title: footer?.block1_sub_title2, href: footer?.block1_sub_link2 },
    { title: footer?.block1_sub_title3, href: footer?.block1_sub_link3 },
    { title: footer?.block1_sub_title4, href: footer?.block1_sub_link4 },
    { title: footer?.block1_sub_title5, href: footer?.block1_sub_link5 },
  ].filter((item) => item?.title && item?.href);

  const blockTwoLinks = [
    { title: footer?.block2_sub_title1, href: footer?.block2_sub_link1 },
    { title: footer?.block2_sub_title2, href: footer?.block2_sub_link2 },
    { title: footer?.block2_sub_title3, href: footer?.block2_sub_link3 },
    { title: footer?.block2_sub_title4, href: footer?.block2_sub_link4 },
  ].filter((item) => item?.title && item?.href);

  const blockThreeLinks = [
    { title: footer?.block3_sub_title1, href: footer?.block3_sub_link1 },
    { title: footer?.block3_sub_title2, href: footer?.block3_sub_link2 },
    { title: footer?.block3_sub_title3, href: footer?.block3_sub_link3 },
    { title: footer?.block3_sub_title4, href: footer?.block3_sub_link4 },
  ].filter((item) => item?.title && item?.href);

  // console.log("userInfo", userInfo);

  return (
    <div className="bg-slate-100 border-t border-slate-200">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 py-10 lg:py-14">
        {showPaymentMethod && (
          <div className="text-center mb-5">
            <h3 className="text-xl font-semibold text-slate-900">
              <CMSkeletonTwo
                count={1}
                height={16}
                loading={false}
                data={footer?.payment_title || { en: "We Accept EMI" }}
              />
            </h3>
          </div>
        )}

        {showPaymentMethod && (
          <div className="mb-6">
            <div className="relative mx-auto w-full max-w-[1055px] aspect-[1055/140]">
              <Image
                fill
                className="object-contain"
                src={footer?.payment_method_img || "/payment-method/payment-logo.png"}
                alt="payment method"
              />
            </div>
          </div>
        )}

        {showBlock4 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="relative w-full aspect-square min-h-[180px] sm:min-h-[220px] lg:min-h-[240px]">
                <Image
                  fill
                  className="object-contain p-2"
                  src={footer?.top_image_one || footer?.block4_logo || "/logo/logo-color.svg"}
                  alt="footer support"
                />
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="relative w-full aspect-square min-h-[180px] sm:min-h-[220px] lg:min-h-[240px]">
                <Image
                  fill
                  className="object-contain p-2"
                  src={footer?.top_image_two || footer?.payment_method_img || "/payment-method/payment-logo.png"}
                  alt="footer payment"
                />
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="relative w-full aspect-square min-h-[180px] sm:min-h-[220px] lg:min-h-[240px]">
                <Image
                  fill
                  className="object-contain p-2"
                  src={footer?.top_image_three || footer?.block4_logo || "/logo/logo-color.svg"}
                  alt="footer contact"
                />
              </div>
            </div>
          </div>
        )}
        </div>
        <div className="bg-[#649DD7]">
  <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
      {showBlock4 && (
        <div className="lg:col-span-4">
          <h5 className="text-lg font-bold text-white mb-4">
            <CMSkeletonTwo
              count={1}
              height={14}
              loading={false}
              data={footer?.about_title || { en: "ABOUT US" }}
            />
          </h5>
          <div className="relative w-48 h-10 mb-3">
            <Image
              fill
              className="object-contain object-left"
              src={footer?.block4_logo || "/logo/logo-white.svg"}
              alt="about logo"
            />
          </div>
          <p className="text-sm leading-7 text-white/90 text-justify">
            <CMSkeletonTwo
              count={1}
              height={10}
              loading={false}
              data={footer?.block4_address}
            />
            {showBlock1 && (
              <>
                <br />
                <Link
                  href={footer?.block1_sub_link1 || "/about-us"}
                  className="text-white font-medium hover:underline"
                >
                  <CMSkeletonTwo
                    count={1}
                    height={10}
                    loading={false}
                    data={footer?.block1_sub_title1 || { en: "Know more..." }}
                  />
                </Link>
              </>
            )}
          </p>

          {/* Social icons under logo, matching screenshot */}
          <div className="flex items-center gap-3 mt-6">
            {footer?.social_facebook && (
              <Link
                href={footer?.social_facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#649DD7] transition"
              >
                <FaFacebookF size={16} />
              </Link>
            )}
            {footer?.social_twitter && (
              <Link
                href={footer?.social_twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#649DD7] transition"
              >
                <FaXTwitter size={16} />
              </Link>
            )}
            {footer?.social_pinterest && (
              <Link
                href={footer?.social_pinterest}
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#649DD7] transition"
              >
                <FaPinterestP size={16} />
              </Link>
            )}
            {footer?.social_linkedin && (
              <Link
                href={footer?.social_linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#649DD7] transition"
              >
                <FaLinkedinIn size={16} />
              </Link>
            )}
            {footer?.social_whatsapp && (
              <Link
                href={footer?.social_whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#649DD7] transition"
              >
                <FaWhatsapp size={16} />
              </Link>
            )}
          </div>
        </div>
      )}

      {showBlock1 && (
        <div className="lg:col-span-2">
          <h5 className="text-lg font-bold text-pink-200 mb-3">
            <CMSkeletonTwo
              count={1}
              height={14}
              loading={false}
              data={footer?.block1_title || { en: "TOP CATEGORIES" }}
            />
          </h5>
          <div className="space-y-2">
            {blockOneLinks.map((item, idx) => (
              <Link
                key={`b1-${idx}`}
                href={item.href || "#"}
                className="block text-sm text-white/90 hover:text-white"
              >
                <CMSkeletonTwo count={1} height={10} loading={false} data={item.title} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {showBlock2 && (
        <div className="lg:col-span-2">
          <h5 className="text-lg font-bold text-pink-200 mb-3">
            <CMSkeletonTwo
              count={1}
              height={14}
              loading={false}
              data={footer?.block2_title || { en: "QUICK LINKS" }}
            />
          </h5>
          <div className="space-y-2">
            {blockTwoLinks.map((item, idx) => (
              <Link
                key={`b2-${idx}`}
                href={item.href || "#"}
                className="block text-sm text-white/90 hover:text-white"
              >
                <CMSkeletonTwo count={1} height={10} loading={false} data={item.title} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {showBlock3 && (
        <div className="lg:col-span-2">
          <h5 className="text-lg font-bold text-pink-200 mb-3">
            <CMSkeletonTwo
              count={1}
              height={14}
              loading={false}
              data={footer?.block3_title || { en: "ALL ABOUT BEAUTY" }}
            />
          </h5>
          <div className="space-y-2">
            {blockThreeLinks.map((item, idx) => (
              <Link
                key={`b3-${idx}`}
                href={userInfo?.email ? item.href || "#" : "#"}
                className="block text-sm text-white/90 hover:text-white"
              >
                <CMSkeletonTwo count={1} height={10} loading={false} data={item.title} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {showBlock4 && (
        <div className="lg:col-span-2">
          <h5 className="text-lg font-bold text-pink-200 mb-3">
            <CMSkeletonTwo
              count={1}
              height={14}
              loading={false}
              data={footer?.contact_title || { en: "HELP" }}
            />
          </h5>
          <div className="space-y-2">
            {footer?.block4_email && (
              <Link
                href={`mailto:${footer?.block4_email}`}
                className="block text-sm text-white/90 hover:text-white"
              >
                {footer?.block4_email}
              </Link>
            )}
            {footer?.block4_phone && (
              <p className="block text-sm text-white/90">{footer?.block4_phone}</p>
            )}
            {showBottomContact && footer?.bottom_contact && (
              <p className="block text-sm text-white/90">{footer?.bottom_contact}</p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Bottom bar: matches screenshot's centered links + copyright row */}
  <div className="border-t border-white/20">
    <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 py-6">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/90 mb-4">
        {footer?.bottom_links?.map((item, idx) => (
          <Link
            key={`bottom-${idx}`}
            href={item.href || "#"}
            className="hover:text-white hover:underline"
          >
            <CMSkeletonTwo count={1} height={10} loading={false} data={item.title} />
          </Link>
        ))}
      </div>

      <div className="text-center text-sm text-white/80">
        {copyrightTextTemplate}{" "}
        <Link
          href={footer?.copyright_link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white hover:underline"
        >
          <CMSkeletonTwo
            count={1}
            height={10}
            loading={false}
            data={footer?.copyright_label || { en: "Baby's" }}
          />
        </Link>
      </div>
    </div>
  </div>
</div>

      </div>
  );
};

export default Footer;
