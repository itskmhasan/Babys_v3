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
            <div className="relative mx-auto w-full max-w-4xl h-20 sm:h-24 lg:h-28">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {showBlock4 && (
            <div className="lg:col-span-4">
            <h5 className="text-lg font-bold text-slate-900 mb-4">
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
                src={footer?.block4_logo || "/logo/logo-color.svg"}
                alt="about logo"
              />
            </div>
            <p className="text-sm leading-7 text-slate-700 text-justify">
              <CMSkeletonTwo
                count={1}
                height={10}
                loading={false}
                data={footer?.block4_address}
              />
              {showBlock1 && (
                <>
                  <br />
                  <Link href={footer?.block1_sub_link1 || "/about-us"} className="text-emerald-700 font-medium hover:underline">
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
            </div>
          )}

          {showBlock1 && (
            <div className="lg:col-span-2">
            <h5 className="text-lg font-bold text-slate-900 mb-3">
              <CMSkeletonTwo count={1} height={14} loading={false} data={footer?.block1_title || { en: "LET'S GROW!" }} />
            </h5>
            <div className="space-y-1">
              {blockOneLinks.map((item, idx) => (
                <Link key={`b1-${idx}`} href={item.href || "#"} className="block text-sm text-slate-700 hover:text-emerald-700">
                  <CMSkeletonTwo count={1} height={10} loading={false} data={item.title} />
                </Link>
              ))}
            </div>
            </div>
          )}

          {showBlock2 && (
            <div className="lg:col-span-2">
            <h5 className="text-lg font-bold text-slate-900 mb-3">
              <CMSkeletonTwo count={1} height={14} loading={false} data={footer?.block2_title || { en: "MORE SERVICES" }} />
            </h5>
            <div className="space-y-1">
              {blockTwoLinks.map((item, idx) => (
                <Link key={`b2-${idx}`} href={item.href || "#"} className="block text-sm text-slate-700 hover:text-emerald-700">
                  <CMSkeletonTwo count={1} height={10} loading={false} data={item.title} />
                </Link>
              ))}
            </div>
            </div>
          )}

          {showBlock3 && (
            <div className="lg:col-span-2">
            <h5 className="text-lg font-bold text-slate-900 mb-3">
              <CMSkeletonTwo count={1} height={14} loading={false} data={footer?.block3_title || { en: "TRAINING" }} />
            </h5>
            <div className="space-y-1">
              {blockThreeLinks.map((item, idx) => (
                <Link
                  key={`b3-${idx}`}
                  href={userInfo?.email ? item.href || "#" : "#"}
                  className="block text-sm text-slate-700 hover:text-emerald-700"
                >
                  <CMSkeletonTwo count={1} height={10} loading={false} data={item.title} />
                </Link>
              ))}
            </div>
            </div>
          )}

          {showBlock4 && (
            <div className="lg:col-span-2">
            <h5 className="text-lg font-bold text-slate-900 mb-3">
              <CMSkeletonTwo
                count={1}
                height={14}
                loading={false}
                data={footer?.contact_title || { en: "EXTRA LINKS" }}
              />
            </h5>
            <div className="space-y-1">
              {footer?.block4_email && (
                <Link href={`mailto:${footer?.block4_email}`} className="block text-sm text-slate-700 hover:text-emerald-700">
                  {footer?.block4_email}
                </Link>
              )}
              {footer?.block4_phone && (
                <p className="block text-sm text-slate-700">{footer?.block4_phone}</p>
              )}
              {showBottomContact && footer?.bottom_contact && (
                <p className="block text-sm text-slate-700">{footer?.bottom_contact}</p>
              )}
            </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-300 bg-slate-200/50">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-center md:text-left text-sm text-slate-700">
              {copyrightTextTemplate}{" "}
              <Link
                href={footer?.copyright_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-emerald-700"
              >
                <CMSkeletonTwo
                  count={1}
                  height={10}
                  loading={false}
                  data={footer?.copyright_label || { en: "Baby's" }}
                />
              </Link>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-4 text-slate-800">
              {showSocialLinks && (
                <>
              {footer?.social_twitter && (
                <Link href={footer?.social_twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-emerald-700">
                  <FaXTwitter size={18} />
                </Link>
              )}
              {footer?.social_facebook && (
                <Link href={footer?.social_facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-emerald-700">
                  <FaFacebookF size={18} />
                </Link>
              )}
              {footer?.social_pinterest && (
                <Link href={footer?.social_pinterest} target="_blank" rel="noreferrer" aria-label="Youtube" className="hover:text-emerald-700">
                  <FaPinterestP size={18} />
                </Link>
              )}
              {footer?.social_linkedin && (
                <Link href={footer?.social_linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-emerald-700">
                  <FaLinkedinIn size={18} />
                </Link>
              )}
              {footer?.social_whatsapp && (
                <Link href={footer?.social_whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-emerald-700">
                  <FaWhatsapp size={18} />
                </Link>
              )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <a
        href="#"
        className="fixed left-5 bottom-5 z-40 h-11 w-11 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 flex items-center justify-center"
        title="Back to Top"
      >
        ↑
      </a>
    </div>
  );
};

export default Footer;
