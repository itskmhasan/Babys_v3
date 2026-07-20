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
       
  <div className="bg-sg-black">
    <div className="container">
      <div className="flex justify-between flex-col md:flex-row flex-wrap text-white">

        {/* Logo + About links + Social */}
        <div className="py-6 md:py-10">
          <a href="/">
            <div className="relative w-[180px] h-[25px]">
              <Image
                fill
                className="object-contain object-left"
                src="/assets/your-footer-logo.png"
                alt="your-logo"
              />
            </div>
          </a>

          <div className="pt-4 flex flex-col gap-2 text-sm">
            <a className="hover:text-sg-pink" href="/about-us">OUR STORY</a>
            <a className="hover:text-sg-pink" href="/magazine">MAGAZINE</a>
            <a className="hover:text-sg-pink" href="/join-our-team">JOIN OUR TEAM</a>
            <a className="hover:text-sg-pink" href="/authenticity">AUTHENTICITY</a>
          </div>

          <hr className="my-2" />

          <div>
            <p className="m-0 text-sm">SHARE YOUR LOVE</p>
            <div className="flex mt-1 gap-2">
              {footer?.social_facebook && (
                <Link target="_blank" href={footer.social_facebook} aria-label="Facebook">
                  <FaFacebookF size={22} />
                </Link>
              )}
              {footer?.social_twitter && (
                <Link target="_blank" href={footer.social_twitter} aria-label="Twitter">
                  <FaXTwitter size={22} />
                </Link>
              )}
              {footer?.social_youtube && (
                <Link target="_blank" href={footer.social_youtube} aria-label="YouTube">
                  <FaYoutube size={22} />
                </Link>
              )}
              {footer?.social_instagram && (
                <Link target="_blank" href={footer.social_instagram} aria-label="Instagram">
                  <FaInstagram size={22} />
                </Link>
              )}
              {footer?.social_pinterest && (
                <Link target="_blank" href={footer.social_pinterest} aria-label="Pinterest">
                  <FaPinterestP size={22} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="py-6 md:py-10">
          <h5 className="text-sg-pink">TOP CATEGORIES</h5>
          <div className="pt-4 flex flex-col gap-2 text-sm">
            {blockOneLinks.map((item, idx) => (
              <a key={idx} className="hover:text-sg-pink" href={item.href}>
                {item.title}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3 */}
        <div className="py-6 md:py-10">
          <h5 className="text-sg-pink">QUICK LINKS</h5>
          <div className="pt-4 flex flex-col gap-2 text-sm">
            {blockTwoLinks.map((item, idx) => (
              <a key={idx} className="hover:text-sg-pink" href={item.href}>
                {item.title}
              </a>
            ))}
          </div>
        </div>

        {/* Column 4 */}
        <div className="py-6 md:py-10">
          <h5 className="text-sg-pink">RESOURCES</h5>
          <div className="pt-4 flex flex-col gap-2 text-sm">
            {blockThreeLinks.map((item, idx) => (
              <a key={idx} target="_blank" className="hover:text-sg-pink" href={item.href}>
                {item.title}
              </a>
            ))}
          </div>
        </div>

        {/* Column 5: Help + payments */}
        <div className="py-6 md:py-10">
          <h5 className="text-sg-pink">HELP</h5>
          <div className="pt-4 flex flex-col gap-2 text-sm">
            <a className="hover:text-sg-pink" href="/contact">CONTACT US</a>
            <a className="hover:text-sg-pink" href="/points">POINTS</a>
            <a className="hover:text-sg-pink" href="/faqs">FAQS</a>
            <a className="hover:text-sg-pink" href="/shipping-delivery">SHIPPING &amp; DELIVERY</a>
            <a className="hover:text-sg-pink" href="/terms-conditions">TERMS &amp; CONDITIONS</a>
            <a className="hover:text-sg-pink" href="/refund-and-return-policy">REFUND &amp; RETURN POLICY</a>
            <a className="hover:text-sg-pink" href="/trade-licence.pdf" target="_blank">TRADE LICENSE</a>
            <a className="hover:text-sg-pink" href="/privacy-policy">PRIVACY POLICY</a>
          </div>

          <hr className="my-5 md:my-2" />

          <div>
            <p className="m-0 mb-1 text-sm">PAYMENTS ACCEPTED</p>
            <div className="flex items-center">
              <div className="relative w-[160px] h-[30px]">
                <Image
                  fill
                  className="object-contain object-left"
                  src="/assets/payment-system.png"
                  alt="payment-systems"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Bottom bar */}
      <div className="pb-7">
        <div className="flex flex-wrap justify-center text-white text-sm">
          <a className="hover:text-sg-pink p-3" href="/authenticity">AUTHENTICITY</a>
          <a className="hover:text-sg-pink p-3" href="/terms-conditions">TERMS &amp; CONDITIONS</a>
          <a className="hover:text-sg-pink p-3" href="/privacy-policy">PRIVACY POLICY</a>
          <a className="hover:text-sg-pink p-3" href="/refund-and-return-policy">REFUND &amp; RETURN POLICY</a>
          <a className="hover:text-sg-pink p-3" href="/faqs">FAQS</a>
        </div>
        <p className="text-white text-center text-sm">
          Copyright © {new Date().getFullYear()} Your Company Name. All Rights Reserved
        </p>
      </div>
    </div>
  </div>


      </div>
  );
};

export default Footer;
